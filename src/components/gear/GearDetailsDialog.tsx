import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Star, Shield, Camera, DollarSign, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DemoPaymentDialog } from "@/components/payment/DemoPaymentDialog";

interface GearItem {
  id: number;
  owner: string;
  title: string;
  category: string;
  priceDay: string;
  priceWeek: string;
  rating: number;
  reviews: number;
  location: string;
  image: string;
  verified: boolean;
  condition: string;
}

interface GearDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gear: GearItem | null;
}

export const GearDetailsDialog = ({ isOpen, onClose, gear }: GearDetailsDialogProps) => {
  const [selectedDates, setSelectedDates] = useState({ start: "", end: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();

  // Early return if gear is null
  if (!gear) {
    return null;
  }

  const handleRentalRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate dates
      if (!selectedDates.start || !selectedDates.end) {
        toast({
          variant: "destructive",
          title: "Missing dates",
          description: "Please select both start and end dates for your rental.",
        });
        setIsLoading(false);
        return;
      }

      // Show payment dialog
      setShowPayment(true);
      setIsLoading(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Request failed",
        description: "There was an error processing your rental request. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // Calculate total days
      const startDate = new Date(selectedDates.start);
      const endDate = new Date(selectedDates.end);
      const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // For now, comment out database call until migration is confirmed
      // const { error } = await supabase.from('gear_rentals').insert([{
      //   user_id: user?.id || null,
      //   gear_title: gear.title,
      //   gear_category: gear.category,
      //   owner_name: gear.owner,
      //   start_date: selectedDates.start,
      //   end_date: selectedDates.end,
      //   total_days: daysDiff,
      //   daily_rate: gear.priceDay,
      //   total_amount: `₦${(parseInt(gear.priceDay.replace(/[^\d]/g, '')) * daysDiff).toLocaleString()}`,
      //   status: 'confirmed',
      //   payment_status: 'paid'
      // }]);

      // if (error) {
      //   console.error('Error saving rental:', error);
      //   toast({
      //     variant: "destructive",
      //     title: "Rental failed",
      //     description: "There was an error saving your rental. Please contact support.",
      //   });
      //   return;
      // }

      toast({
        title: "Rental confirmed!",
        description: `Your rental for ${gear.title} from ${gear.owner} has been confirmed for ${daysDiff} day(s). You will receive a confirmation email shortly.`,
      });

      onClose();
      setShowPayment(false);
      setSelectedDates({ start: "", end: "" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Rental failed",
        description: "There was an error confirming your rental. Please try again.",
      });
    }
  };

  const gearSpecs = {
    "Sony α7R V Mirrorless Camera": {
      specifications: [
        "61MP Full-Frame Sensor",
        "8K Video Recording",
        "Real-time Recognition AF",
        "5-axis In-body Stabilization",
        "CFexpress Type A & SD Card Slots"
      ],
      included: [
        "Camera Body",
        "Battery & Charger",
        "Strap",
        "USB Cable",
        "64GB SD Card"
      ]
    },
    "Canon EF 70-200mm f/2.8L": {
      specifications: [
        "70-200mm Focal Length",
        "f/2.8 Maximum Aperture",
        "Image Stabilization",
        "Weather Sealed",
        "Ultra-low Dispersion Glass"
      ],
      included: [
        "Lens",
        "Lens Hood",
        "Front & Rear Caps",
        "Protective Case",
        "UV Filter"
      ]
    },
    "Profoto B1X 500 AirTTL": {
      specifications: [
        "500Ws Flash Power",
        "AirTTL Technology",
        "1.3 Second Recycle Time",
        "325 Full Power Flashes",
        "Built-in Modeling Light"
      ],
      included: [
        "Flash Head",
        "Battery",
        "Charger",
        "Reflector",
        "Carrying Case"
      ]
    }
  };

  const specs = gearSpecs[gear.title as keyof typeof gearSpecs] || {
    specifications: ["Professional grade equipment", "Well maintained", "Regularly serviced"],
    included: ["Main item", "Accessories", "Carrying case"]
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gear Details</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Side - Image and Basic Info */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img 
                src={gear.image} 
                alt={gear.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{gear.category}</Badge>
                <div className="flex items-center space-x-2">
                  {gear.verified && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Verified</span>
                    </div>
                  )}
                  <Badge variant="outline">{gear.condition}</Badge>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold">{gear.title}</h2>
              <p className="text-muted-foreground">Owned by {gear.owner}</p>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{gear.rating}</span>
                  <span className="text-muted-foreground">({gear.reviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{gear.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Details and Rental */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Rental Pricing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Daily Rate:</span>
                  <span className="text-xl font-bold text-primary">{gear.priceDay}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Weekly Rate:</span>
                  <span className="text-xl font-bold text-primary">{gear.priceWeek}</span>
                </div>
                <Separator />
                <p className="text-sm text-muted-foreground">
                  Weekly rentals save you up to 30% compared to daily rates.
                </p>
              </CardContent>
            </Card>

            {/* Rental Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Check Availability</span>
                </CardTitle>
                <CardDescription>Select your rental dates to send a request</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRentalRequest} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={selectedDates.start}
                        onChange={(e) => setSelectedDates(prev => ({ ...prev, start: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={selectedDates.end}
                        onChange={(e) => setSelectedDates(prev => ({ ...prev, end: e.target.value }))}
                        min={selectedDates.start || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending Request..." : "Request Rental"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                View Gallery
              </Button>
              <Button variant="outline" className="w-full">
                <Clock className="w-4 h-4 mr-2" />
                Availability
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section - Specifications */}
        <Tabs defaultValue="specs" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="included">What's Included</TabsTrigger>
            <TabsTrigger value="policies">Rental Policies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="specs" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {specs.specifications.map((spec, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="included" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>What's Included in Rental</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {specs.included.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="policies" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Rental Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Damage Policy</h4>
                  <p className="text-sm text-muted-foreground">
                    Security deposit required. Normal wear and tear is expected, but damage beyond 
                    normal use will be charged according to repair costs.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Cancellation</h4>
                  <p className="text-sm text-muted-foreground">
                    Free cancellation up to 24 hours before rental start time. 
                    Cancellations within 24 hours are subject to a 50% fee.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Late Returns</h4>
                  <p className="text-sm text-muted-foreground">
                    Equipment must be returned by the agreed time. Late returns may incur 
                    additional daily charges.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>

      <DemoPaymentDialog
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
        amount={`₦${parseInt(gear.priceDay.replace(/[^\d]/g, '')) * Math.max(1, Math.ceil((new Date(selectedDates.end).getTime() - new Date(selectedDates.start).getTime()) / (1000 * 60 * 60 * 24)))}`}
        description={`${gear.title} rental from ${gear.owner}`}
        type="rental"
      />
    </Dialog>
  );
};