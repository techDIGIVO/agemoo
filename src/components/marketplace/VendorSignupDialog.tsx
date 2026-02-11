import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, MapPin, Phone, Mail, Globe, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface VendorSignupDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VendorSignupDialog = ({ isOpen, onClose }: VendorSignupDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
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
    "Wedding Photography",
    "Portrait Photography",
    "Event Photography",
    "Corporate Photography",
    "Fashion Photography",
    "Street Photography",
    "Documentary Photography",
    "Product Photography",
    "Real Estate Photography",
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

  const handleSaveAsDraft = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to save your application.",
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
        status: 'draft'
      });

      if (error) throw error;

      toast({
        title: "Draft Saved!",
        description: "Your application has been saved as a draft. You can complete it later.",
      });
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save draft",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to submit your application.",
      });
      return;
    }

    if (formData.specialties.length === 0) {
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
        status: 'submitted'
      });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you within 24 hours.",
      });
      onClose();
      
      // Reset form
      setFormData({
        businessName: "",
        ownerName: "",
        email: "",
        phone: "",
        location: "",
        specialties: [],
        experience: "",
        portfolio: "",
        instagram: "",
        description: "",
        equipment: "",
        pricing: "",
        availability: ""
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit application",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-primary" />
            <span>Join Agemoo as a Vendor</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Business Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Business/Studio Name *</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ownerName">Owner/Lead Photographer *</Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
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
              <div>
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
            <div>
              <Label htmlFor="location">Primary Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  className="pl-10"
                  placeholder="e.g., Lagos, Nigeria"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Photography Specialties */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Photography Specialties *</h3>
            <div className="grid grid-cols-2 gap-3">
              {specialtyOptions.map((specialty) => (
                <div key={specialty} className="flex items-center space-x-2">
                  <Checkbox
                    id={specialty}
                    checked={formData.specialties.includes(specialty)}
                    onCheckedChange={(checked) => handleSpecialtyChange(specialty, checked as boolean)}
                  />
                  <Label htmlFor={specialty} className="text-sm">{specialty}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Experience & Portfolio */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Experience & Portfolio</h3>
            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-2">1-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="portfolio">Portfolio Website/Link</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="portfolio"
                  type="url"
                  className="pl-10"
                  placeholder="https://your-portfolio.com"
                  value={formData.portfolio}
                  onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="instagram">Instagram Handle</Label>
              <div className="relative">
                <Instagram className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="instagram"
                  className="pl-10"
                  placeholder="@yourhandle"
                  value={formData.instagram}
                  onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Tell us about your photography style and approach</Label>
              <Textarea
                id="description"
                placeholder="Describe your unique style, approach to photography, and what sets you apart..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>
          </div>

          {/* Equipment & Pricing */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Equipment & Pricing</h3>
            <div>
              <Label htmlFor="equipment">Main Equipment/Gear</Label>
              <Textarea
                id="equipment"
                placeholder="List your main cameras, lenses, lighting equipment, etc."
                value={formData.equipment}
                onChange={(e) => setFormData(prev => ({ ...prev, equipment: e.target.value }))}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="pricing">Starting Price Range (NGN)</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, pricing: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your starting price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20000-50000">₦20,000 - ₦50,000</SelectItem>
                  <SelectItem value="50000-100000">₦50,000 - ₦100,000</SelectItem>
                  <SelectItem value="100000-200000">₦100,000 - ₦200,000</SelectItem>
                  <SelectItem value="200000+">₦200,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="availability">Current Availability</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="How many bookings can you handle per month?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1-5 bookings/month</SelectItem>
                  <SelectItem value="6-10">6-10 bookings/month</SelectItem>
                  <SelectItem value="11-20">11-20 bookings/month</SelectItem>
                  <SelectItem value="20+">20+ bookings/month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex space-x-3 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSaveAsDraft} 
              disabled={isSubmitting}
              className="flex-1"
            >
              Save as Draft
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};