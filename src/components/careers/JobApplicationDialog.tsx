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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface PositionData {
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
}

interface JobApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: PositionData | null;
}

const JobApplicationDialog = ({
  open,
  onOpenChange,
  position,
}: JobApplicationDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setPortfolioUrl("");
    setCoverLetter("");
    setIsSubmitted(false);
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

    if (!position) return;

    setIsLoading(true);

    try {
      const { error } = await supabase.from("job_applications").insert([
        {
          position_title: position.title,
          department: position.department,
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
          portfolio_url: portfolioUrl.trim() || null,
          cover_letter: coverLetter.trim() || null,
          user_id: user?.id ?? null,
        },
      ]);

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already Applied",
            description: `You've already applied for the ${position.title} position. We'll review your application and get back to you.`,
          });
        } else {
          console.error("Job application error:", error);
          toast({
            title: "Application Failed",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        setIsSubmitted(true);
        toast({
          title: "Application Submitted!",
          description: `Your application for ${position.title} has been received.`,
        });
      }
    } catch (error) {
      console.error("Job application error:", error);
      toast({
        title: "Application Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!position) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-center">
                Application Submitted!
              </DialogTitle>
              <DialogDescription className="text-center">
                Thank you for applying for the{" "}
                <strong>{position.title}</strong> position. Our hiring team will
                review your application and get back to you within 5–7 business
                days.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-muted rounded-lg p-4 text-sm space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span>
                  {position.department} · {position.type}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{position.location}</span>
              </div>
            </div>
            <Button className="w-full" onClick={() => handleClose(false)}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Apply for {position.title}</DialogTitle>
              <DialogDescription>
                Fill in your details to submit your application.
              </DialogDescription>
            </DialogHeader>

            {/* Position Summary */}
            <div className="bg-muted rounded-lg p-4 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge>{position.department}</Badge>
                <Badge variant="outline">{position.type}</Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{position.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{position.experience}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="appFullName">Full Name *</Label>
                <Input
                  id="appFullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appEmail">Email Address *</Label>
                <Input
                  id="appEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appPhone">Phone Number</Label>
                <Input
                  id="appPhone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +234 801 234 5678"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appPortfolio">Portfolio / LinkedIn URL</Label>
                <Input
                  id="appPortfolio"
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://your-portfolio.com"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appCoverLetter">Cover Letter</Label>
                <Textarea
                  id="appCoverLetter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell us why you're a great fit for this role..."
                  rows={4}
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
                  {isLoading ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>

            <p className="text-xs text-muted-foreground">
              By submitting, you consent to our team reviewing your information
              for recruitment purposes. We'll only contact you regarding this
              application.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationDialog;
