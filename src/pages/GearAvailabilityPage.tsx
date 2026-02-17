import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Star,
  Shield,
  Camera,
  DollarSign,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DemoPaymentDialog } from "@/components/payment/DemoPaymentDialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";



const GearAvailabilityPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [gear, setGear] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState({ start: "", end: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const fetchGear = async () => {
      if (!id) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('gear')
        .select('*, profiles:vendor_id (id, name, location)')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching gear:', error);
      }

      if (data) {
        // Map DB fields to the shape the component expects
        setGear({
          ...data,
          owner: data.profiles?.name || 'Equipment Owner',
          priceDay: `\u20a6${Number(data.price_per_day).toLocaleString()}`,
          priceWeek: `\u20a6${Math.round(Number(data.price_per_day) * 5.5).toLocaleString()}`,
          image: data.image_url,
          rating: data.rating || 0,
          reviews: data.reviews_count || 0,
          verified: true,
          condition: 'Good'
        });
      }
      setLoading(false);
    };

    fetchGear();
  }, [id]);

  const handleRentalRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDates.start || !selectedDates.end) {
      toast({
        variant: "destructive",
        title: "Missing dates",
        description: "Please select both start and end dates.",
      });
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    const startDate = new Date(selectedDates.start);
    const endDate = new Date(selectedDates.end);
    const daysDiff = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

    toast({
      title: "Rental confirmed!",
      description: `Your rental for ${gear.title} has been confirmed for ${daysDiff} day(s).`,
    });

    setShowPayment(false);
    setSelectedDates({ start: "", end: "" });
    navigate("/dashboard/bookings"); // Send them to their bookings after success
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!gear) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center pt-40 pb-40"><h2 className="text-2xl font-bold mb-4">Gear Not Found</h2><Button onClick={() => navigate("/gear")}>Back to Gear</Button></main>
        <Footer />
      </div>
    );
  }

  // Calculate price for payment dialog
  const dailyRateNumeric = parseInt(gear.priceDay?.replace(/[^\d]/g, '') || "0");
  const daysDiff = selectedDates.start && selectedDates.end
    ? Math.max(1, Math.ceil((new Date(selectedDates.end).getTime() - new Date(selectedDates.start).getTime()) / (1000 * 60 * 60 * 24)))
    : 1;
  const totalAmount = dailyRateNumeric * daysDiff;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-12 bg-muted/20">
        <div className="container max-w-6xl mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column: Media & Core Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  <img src={gear.image} alt={gear.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur">{gear.category}</Badge>
                    <Badge variant="outline" className="bg-background/80 backdrop-blur">{gear.condition}</Badge>
                  </div>
                </div>
                <CardContent className="p-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-bold">{gear.title}</h1>
                      <p className="text-muted-foreground">Owned by <span className="text-primary font-medium">{gear.owner}</span></p>
                    </div>
                    {gear.verified && (
                      <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                        <Shield className="w-4 h-4 mr-1" />
                        <span className="text-xs font-bold uppercase">Verified</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" /> <strong>{gear.rating}</strong> <span className="ml-1 text-muted-foreground">({gear.reviews} reviews)</span></div>
                    <div className="flex items-center text-muted-foreground"><MapPin className="w-4 h-4 mr-1" /> {gear.location}</div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{gear.description || "Professional grade equipment, well maintained and regularly serviced."}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Bottom Tabs Section */}
              <Tabs defaultValue="specs" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 h-12">
                  <TabsTrigger value="specs">Specifications</TabsTrigger>
                  <TabsTrigger value="included">What's Included</TabsTrigger>
                  <TabsTrigger value="policies">Policies</TabsTrigger>
                </TabsList>
                <TabsContent value="specs" className="mt-4">
                  <Card><CardContent className="pt-6">
                    <ul className="grid sm:grid-cols-2 gap-4">
                      {(gear.specifications || ["Professional standard", "Reliable performance"]).map((s: string, i: number) => (
                        <li key={i} className="flex items-center text-sm"><CheckCircle2 className="w-4 h-4 mr-2 text-primary" /> {s}</li>
                      ))}
                    </ul>
                  </CardContent></Card>
                </TabsContent>
                <TabsContent value="included" className="mt-4">
                  <Card><CardContent className="pt-6">
                    <ul className="grid sm:grid-cols-2 gap-4">
                      {(gear.included || ["Main Unit", "Carrying Case"]).map((item: string, i: number) => (
                        <li key={i} className="flex items-center text-sm"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" /> {item}</li>
                      ))}
                    </ul>
                  </CardContent></Card>
                </TabsContent>
                <TabsContent value="policies" className="mt-4">
                  <Card><CardContent className="pt-6 space-y-4">
                    <div><h4 className="text-sm font-bold">Damage Policy</h4><p className="text-xs text-muted-foreground">Security deposit required. Users are responsible for equipment during the rental period.</p></div>
                    <div><h4 className="text-sm font-bold">Late Returns</h4><p className="text-xs text-muted-foreground">Late returns are charged at 1.5x the daily rate.</p></div>
                  </CardContent></Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column: Booking & Pricing */}
            <div className="space-y-6">
              <Card className="border-primary/10 shadow-lg sticky top-24">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="flex items-center"><DollarSign className="w-5 h-5 mr-2 text-primary" /> Pricing & Availability</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center"><span className="text-muted-foreground">Daily:</span> <span className="text-2xl font-bold text-primary">{gear.priceDay}</span></div>
                    <div className="flex justify-between items-center"><span className="text-muted-foreground">Weekly:</span> <span className="font-semibold">{gear.priceWeek}</span></div>
                    <p className="text-[10px] text-primary bg-primary/10 p-2 rounded text-center">Weekly rentals save you up to 30%</p>
                  </div>

                  <form onSubmit={handleRentalRequest} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input id="start-date" type="date" value={selectedDates.start} onChange={(e) => setSelectedDates(p => ({ ...p, start: e.target.value }))} min={new Date().toISOString().split('T')[0]} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <Input id="end-date" type="date" value={selectedDates.end} onChange={(e) => setSelectedDates(p => ({ ...p, end: e.target.value }))} min={selectedDates.start || new Date().toISOString().split('T')[0]} required />
                    </div>
                    <Button type="submit" className="w-full py-6 text-lg shadow-md" disabled={isLoading}>
                      {isLoading ? "Processing..." : "Request Rental"}
                    </Button>
                  </form>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => toast({ title: "Gallery", description: "More photos coming soon!" })}>
                      <Camera className="w-3 h-3 mr-2" /> Gallery
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => toast({ title: "History", description: "This item has been rented 12 times." })}>
                      <Clock className="w-3 h-3 mr-2" /> History
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4 bg-background border border-dashed border-primary/20 flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-full"><Shield className="w-5 h-5 text-primary" /></div>
                <div><h4 className="text-xs font-bold">Agemoo Guarantee</h4><p className="text-[10px] text-muted-foreground">Secure payments and verified equipment.</p></div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <DemoPaymentDialog
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
        amount={`₦${totalAmount.toLocaleString()}`}
        description={`${gear.title} rental for ${daysDiff} day(s)`}
        type="rental"
      />
    </div>
  );
};

export default GearAvailabilityPage;