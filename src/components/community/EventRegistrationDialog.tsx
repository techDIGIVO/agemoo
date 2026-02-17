import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface EventData {
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  type: string;
  host: string;
}

interface EventRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: EventData | null;
}

const EventRegistrationDialog = ({
  open,
  onOpenChange,
  event,
}: EventRegistrationDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setIsRegistered(false);
  };

  const handleClose = (value: boolean) => {
    if (!value) resetForm();
    onOpenChange(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide your name and email address.",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!event) return;

    setIsLoading(true);

    try {
      const { error } = await supabase.from("event_registrations").insert([
        {
          event_title: event.title,
          event_date: event.date,
          event_location: event.location,
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
          user_id: user?.id ?? null,
        },
      ]);

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already Registered",
            description: `You're already registered for "${event.title}". Check your email for details.`,
          });
        } else {
          console.error("Event registration error:", error);
          toast({
            title: "Registration Failed",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        setIsRegistered(true);
        toast({
          title: "Registration Successful!",
          description: `You're registered for "${event.title}". A confirmation will be sent to ${email.trim().toLowerCase()}.`,
        });
      }
    } catch (error) {
      console.error("Event registration error:", error);
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {isRegistered ? (
          <div className="text-center py-6 space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-center">You're Registered!</DialogTitle>
              <DialogDescription className="text-center">
                You've successfully registered for <strong>{event.title}</strong>.
                We'll send a confirmation and event details to your email.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-muted rounded-lg p-4 text-sm space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{event.date} at {event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
            </div>
            <Button className="w-full" onClick={() => handleClose(false)}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Register for Event</DialogTitle>
              <DialogDescription>
                Fill in your details to register for this event.
              </DialogDescription>
            </DialogHeader>

            {/* Event Summary */}
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{event.title}</h3>
                <Badge>{event.type}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Hosted by {event.host}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{event.date} at {event.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{event.attendees} attending</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventEmail">Email Address *</Label>
                <Input
                  id="eventEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventPhone">Phone Number (optional)</Label>
                <Input
                  id="eventPhone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +234 801 234 5678"
                  disabled={isLoading}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleClose(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Confirm Registration"}
                </Button>
              </div>
            </form>

            <p className="text-xs text-muted-foreground">
              By registering, you agree to receive event updates and reminders via
              email. You can cancel your registration at any time.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationDialog;
