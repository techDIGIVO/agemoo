import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DemoPaymentDialog } from "@/components/payment/DemoPaymentDialog";

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: number | string;
    title: string;
    vendor: string;
    vendorId?: string;
    price: string;
    category: string;
    image_url?: string;
    duration?: string;
  } | null;
}

export const BookingDialog = ({ isOpen, onClose, service }: BookingDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();

  // FIX: Hooks must strictly be at the top level, BEFORE any return statements.
  const [bookingForm, setBookingForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    eventDate: "",
    eventTime: "",
    location: "",
    duration: "",
    budget: "",
    eventType: "",
    specialRequests: "",
  });

  const eventTypes = [
    "Wedding", "Portrait Session", "Corporate Event", "Product Photography",
    "Fashion Shoot", "Event Coverage", "Real Estate", "Other"
  ];

  const durations = [
    "1 hour", "2 hours", "3 hours", "4 hours", "Half day (5 hours)", "Full day (8 hours)", "Multiple days"
  ];

  // Early return if service is null (Moved AFTER all hooks)
  if (!service) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!bookingForm.clientName || !bookingForm.clientEmail || !bookingForm.eventDate || !bookingForm.eventType || !bookingForm.location) {
        toast({
          variant: "destructive",
          title: "Missing information",
          description: "Please fill in all required fields.",
        });
        setIsLoading(false);
        return;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!service.vendorId) {
        toast({
          variant: "destructive",
          title: "Booking failed",
          description: "Unable to identify the service provider. Please try again.",
        });
        setIsLoading(false);
        return;
      }
      
      // Create booking
      const { error } = await supabase.from('bookings').insert([{
        client_id: user?.id || null,
        vendor_id: service.vendorId,
        booking_date: bookingForm.eventDate,
        booking_time: bookingForm.eventTime || '09:00',
        total_price: parseFloat(service.price.replace(/[^0-9.-]+/g, "")),
        duration: bookingForm.duration || '4 hours',
        status: 'pending',
        notes: `Event Type: ${bookingForm.eventType}\nLocation: ${bookingForm.location}\nClient: ${bookingForm.clientName} (${bookingForm.clientEmail}${bookingForm.clientPhone ? ', ' + bookingForm.clientPhone : ''})\n${bookingForm.specialRequests ? 'Special Requests: ' + bookingForm.specialRequests : ''}`
      }]);

      if (error) {
        console.error('Error creating booking:', error);
        toast({
          variant: "destructive",
          title: "Booking failed",
          description: "There was an error creating your booking. Please try again.",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Booking request submitted!",
        description: `Your booking request for ${service.title} has been sent. The photographer will review and accept it before payment is required.`,
      });

      onClose();
      setBookingForm({
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        eventDate: "",
        eventTime: "",
        location: "",
        duration: "",
        budget: "",
        eventType: "",
        specialRequests: "",
      });
      setIsLoading(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Booking failed",
        description: "There was an error processing your booking request. Please try again.",
      });
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    // Payment success logic (kept simplified as per previous context)
    toast({
      title: "Booking confirmed!",
      description: `Your booking for ${service.title} with ${service.vendor} has been confirmed.`,
    });

    onClose();
    setShowPayment(false);
    setBookingForm({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      eventDate: "",
      eventTime: "",
      location: "",
      duration: "",
      budget: "",
      eventType: "",
      specialRequests: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Service</DialogTitle>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>{service.title}</span>
              <span className="text-primary">{service.price}</span>
            </CardTitle>
            <CardDescription>by {service.vendor} • {service.category}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Full Name *</Label>
                    <Input
                      id="clientName"
                      value={bookingForm.clientName}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, clientName: e.target.value }))}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Email *</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={bookingForm.clientEmail}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, clientEmail: e.target.value }))}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Phone Number</Label>
                  <Input
                    id="clientPhone"
                    type="tel"
                    value={bookingForm.clientPhone}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, clientPhone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Event Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type *</Label>
                  <Select 
                    value={bookingForm.eventType} 
                    onValueChange={(value) => setBookingForm(prev => ({ ...prev, eventType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Event Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="eventDate"
                        type="date"
                        className="pl-10"
                        value={bookingForm.eventDate}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, eventDate: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventTime">Event Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="eventTime"
                        type="time"
                        className="pl-10"
                        value={bookingForm.eventTime}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, eventTime: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      className="pl-10"
                      value={bookingForm.location}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Event venue or address"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Expected Duration</Label>
                    <Select 
                      value={bookingForm.duration} 
                      onValueChange={(value) => setBookingForm(prev => ({ ...prev, duration: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {durations.map((duration) => (
                          <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="budget"
                        className="pl-10"
                        value={bookingForm.budget}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, budget: e.target.value }))}
                        placeholder="$500 - $1000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests or Notes</Label>
                  <Textarea
                    id="specialRequests"
                    value={bookingForm.specialRequests}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                    placeholder="Any specific requirements, style preferences, or important details..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Processing..." : "Submit Booking Request"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>

      <DemoPaymentDialog
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
        amount={service.price}
        description={`${service.title} by ${service.vendor}`}
        type="booking"
      />
    </Dialog>
  );
};