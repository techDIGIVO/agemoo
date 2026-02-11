import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, MapPin, Phone, Mail, Globe, Instagram, ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const VendorRegistration = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    location: "",
    specialties: [] as string[],
    experience: "",
    portfolio: "",
    instagram: "",
    description: "",
    equipment: "",
    pricing: "",
    availability: ""
  });

  const specialtyOptions = [
    "Wedding Photography", "Portrait Photography", "Event Photography",
    "Corporate Photography", "Fashion Photography", "Street Photography",
    "Documentary Photography", "Product Photography", "Real Estate Photography",
    "Food Photography"
  ];

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      specialties: checked 
        ? [...prev.specialties, specialty]
        : prev.specialties.filter(s => s !== specialty)
    }));
  };

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'submitted') => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to submit your application.",
      });
      navigate("/auth?mode=signin");
      return;
    }

    if (status === 'submitted' && formData.specialties.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select at least one photography specialty.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('applications').insert({
        user_id: user.id,
        business_name: formData.businessName,
        owner_name: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        specialties: formData.specialties,
        experience: formData.experience,
        portfolio: formData.portfolio,
        instagram: formData.instagram,
        description: formData.description,
        equipment: formData.equipment,
        pricing: formData.pricing,
        availability: formData.availability,
        status: status
      });

      if (error) throw error;

      toast({
        title: status === 'draft' ? "Draft Saved!" : "Application Submitted!",
        description: status === 'draft' 
          ? "You can complete it later from your dashboard." 
          : "We'll review your application and get back to you within 24 hours.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process application",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-12 bg-muted/30">
        <div className="container max-w-4xl mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-6 hover:bg-transparent p-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
          </Button>

          <div className="bg-background rounded-2xl shadow-xl border overflow-hidden">
            <div className="p-8 border-b bg-primary/5">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-3xl font-bold">Join Agemoo as a Vendor</h1>
              </div>
              <p className="text-muted-foreground">
                Complete the form below to start reaching thousands of clients across Nigeria.
              </p>
            </div>

            <form onSubmit={(e) => handleSubmit(e, 'submitted')} className="p-8 space-y-10">
              {/* Business Section */}
              <section className="space-y-6">
                <div className="flex items-center space-x-2 border-b pb-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Business Details</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business/Studio Name *</Label>
                    <Input
                      id="businessName"
                      placeholder="e.g., Pixel Perfect Studios"
                      value={formData.businessName}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name *</Label>
                    <Input
                      id="ownerName"
                      placeholder="Your full name"
                      value={formData.ownerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        className="pl-10"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Primary Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      className="pl-10"
                      placeholder="e.g., Ikeja, Lagos"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </section>

              {/* Specialties Section */}
              <section className="space-y-6">
                <div className="flex items-center space-x-2 border-b pb-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Specialties & Portfolio</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {specialtyOptions.map((specialty) => (
                    <div key={specialty} className="flex items-center space-x-2 p-3 rounded-lg border bg-muted/20">
                      <Checkbox
                        id={specialty}
                        checked={formData.specialties.includes(specialty)}
                        onCheckedChange={(checked) => handleSpecialtyChange(specialty, checked as boolean)}
                      />
                      <Label htmlFor={specialty} className="text-sm cursor-pointer flex-1">{specialty}</Label>
                    </div>
                  ))}
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Portfolio Link</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="https://behance.net/yourprofile"
                        value={formData.portfolio}
                        onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Instagram Handle</Label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="@yourhandle"
                        value={formData.instagram}
                        onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>About Your Style</Label>
                  <Textarea
                    placeholder="Describe your creative approach..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                  />
                </div>
              </section>

              {/* Operations Section */}
              <section className="space-y-6">
                <div className="flex items-center space-x-2 border-b pb-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-lg">Equipment & Pricing</h3>
                </div>
                <div className="space-y-2">
                  <Label>Main Equipment</Label>
                  <Textarea
                    placeholder="List your cameras, lenses, etc."
                    value={formData.equipment}
                    onChange={(e) => setFormData(prev => ({ ...prev, equipment: e.target.value }))}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Starting Price Range (NGN)</Label>
                    <Select onValueChange={(v) => setFormData(p => ({ ...p, pricing: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20000-50000">₦20,000 - ₦50,000</SelectItem>
                        <SelectItem value="50000-100000">₦50,000 - ₦100,000</SelectItem>
                        <SelectItem value="100000+">₦100,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Capacity</Label>
                    <Select onValueChange={(v) => setFormData(p => ({ ...p, availability: v }))}>
                      <SelectTrigger><SelectValue placeholder="Bookings per month" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5">1-5 bookings</SelectItem>
                        <SelectItem value="5-10">5-10 bookings</SelectItem>
                        <SelectItem value="10+">10+ bookings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={(e) => handleSubmit(e, 'draft')}
                  disabled={isSubmitting}
                  className="flex-1 py-6"
                >
                  Save as Draft
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-1 py-6 shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? "Processing..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VendorRegistration;