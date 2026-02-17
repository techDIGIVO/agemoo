import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, Phone, MapPin, Clock, MessageCircle, AlertCircle, 
  CheckCircle, Users, Headphones, FileText, Globe 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
    priority: "normal"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const contactMethods = [
    {
      title: "Email Support",
      description: "Get help via email",
      icon: Mail,
      contact: "support@bop3.com",
      hours: "24/7 - Response within 2 hours",
      color: "bg-blue-500"
    },
    {
      title: "Phone Support",
      description: "Speak with our team",
      icon: Phone,
      contact: "+234-800-BOP-HELP",
      hours: "Mon-Fri 9AM-6PM WAT",
      color: "bg-green-500"
    },
    {
      title: "Live Chat",
      description: "Instant messaging support",
      icon: MessageCircle,
      contact: "Available on platform",
      hours: "24/7 - Average response 5 minutes",
      color: "bg-purple-500"
    },
    {
      title: "Office Visits",
      description: "Meet us in person",
      icon: MapPin,
      contact: "Lagos & Abuja offices",
      hours: "Mon-Fri 9AM-5PM WAT",
      color: "bg-orange-500"
    }
  ];

  const supportCategories = [
    { value: "technical", label: "Technical Support", description: "Platform issues, bugs, and technical questions" },
    { value: "billing", label: "Billing & Payments", description: "Payment issues, subscriptions, and billing inquiries" },
    { value: "account", label: "Account Support", description: "Profile setup, verification, and account management" },
    { value: "business", label: "Business Inquiries", description: "Partnerships, enterprise solutions, and collaborations" },
    { value: "safety", label: "Safety & Trust", description: "Report violations, safety concerns, and platform abuse" },
    { value: "feedback", label: "Feedback & Suggestions", description: "Feature requests, improvements, and general feedback" }
  ];

  const officeLocations = [
    {
      city: "Lagos",
      address: "Victoria Island Business District, Lagos, Nigeria",
      hours: "Monday - Friday: 9:00 AM - 6:00 PM WAT",
      phone: "+234-901-234-5678",
      email: "lagos@bop3.com"
    },
    {
      city: "Abuja",
      address: "Central Business District, Abuja, Nigeria",
      hours: "Monday - Friday: 9:00 AM - 6:00 PM WAT",
      phone: "+234-902-345-6789",
      email: "abuja@bop3.com"
    }
  ];

  const faqHighlights = [
    {
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page and follow the email instructions.",
      category: "Account"
    },
    {
      question: "How do I become a verified photographer?",
      answer: "Submit your credentials through your profile settings for our verification process.",
      category: "Verification"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and bank transfers.",
      category: "Payments"
    },
    {
      question: "How do I report a safety concern?",
      answer: "Use the 'Report' button on profiles or contact our safety team immediately.",
      category: "Safety"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("contact_messages").insert([
        {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          subject: formData.subject.trim(),
          category: formData.category || null,
          priority: formData.priority,
          message: formData.message.trim(),
          user_id: user?.id ?? null,
        },
      ]);

      if (error) {
        console.error("Contact form error:", error);
        toast({
          variant: "destructive",
          title: "Failed to send message",
          description: "Please try again or contact us directly via phone or email.",
        });
      } else {
        toast({
          title: "Message sent successfully!",
          description:
            "Your message has been received by our support team. We'll get back to you within 24 hours at " +
            formData.email.trim().toLowerCase() +
            ".",
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          category: "",
          message: "",
          priority: "normal",
        });
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "Please try again or contact us directly via phone or email.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        {/* Hero Section */}
        <section className="py-20 hero-gradient">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-6">
              <Headphones className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              We're here to help you succeed. Reach out to our support team for assistance, 
              questions, or feedback about the BOP 3.0 platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg">
                Start Live Chat
              </Button>
              <Button variant="outline" size="lg">
                Call Support
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How Can We Help?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose the contact method that works best for you
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <div className={`w-12 h-12 ${method.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                  <p className="font-medium text-primary mb-2">{method.contact}</p>
                  <p className="text-xs text-muted-foreground">{method.hours}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="p-8">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-6 h-6 text-primary" />
                    <span>Send us a Message</span>
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {supportCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              <div>
                                <div className="font-medium">{category.label}</div>
                                <div className="text-xs text-muted-foreground">{category.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your inquiry"
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority Level</Label>
                      <Select 
                        value={formData.priority} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - General inquiry</SelectItem>
                          <SelectItem value="normal">Normal - Standard support</SelectItem>
                          <SelectItem value="high">High - Urgent issue</SelectItem>
                          <SelectItem value="critical">Critical - Service affecting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Please provide as much detail as possible about your inquiry..."
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                {/* Quick FAQ */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Answers</h3>
                  <div className="space-y-4">
                    {faqHighlights.map((faq, index) => (
                      <div key={index} className="border-l-4 border-primary pl-4">
                        <h4 className="font-medium mb-1">{faq.question}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{faq.answer}</p>
                        <Badge variant="outline" className="text-xs">{faq.category}</Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All FAQs
                  </Button>
                </Card>

                {/* Response Times */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Response Times</h3>
                  <div className="space-y-4">
                    {[
                      { method: "Live Chat", time: "< 5 minutes", status: "Available now", color: "text-green-600" },
                      { method: "Email Support", time: "< 2 hours", status: "24/7 monitoring", color: "text-blue-600" },
                      { method: "Phone Support", time: "Immediate", status: "Business hours", color: "text-orange-600" },
                      { method: "Critical Issues", time: "< 15 minutes", status: "Emergency response", color: "text-red-600" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.method}</p>
                          <p className="text-sm text-muted-foreground">{item.status}</p>
                        </div>
                        <div className={`text-right ${item.color}`}>
                          <p className="font-semibold">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Emergency Contact */}
                <Card className="p-6 bg-red-50 border-red-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <h3 className="text-lg font-semibold text-red-800">Emergency Support</h3>
                  </div>
                  <p className="text-red-700 text-sm mb-4">
                    For critical safety issues, platform outages, or urgent security concerns.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-red-800">
                      <Phone className="w-4 h-4" />
                      <span className="font-medium">+234-800-EMERGENCY</span>
                    </div>
                    <div className="flex items-center space-x-2 text-red-800">
                      <Mail className="w-4 h-4" />
                      <span className="font-medium">emergency@bop3.com</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Visit Our Offices</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Meet our team in person at our offices across Nigeria
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {officeLocations.map((office, index) => (
                <Card key={index} className="p-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span>{office.city} Office</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{office.address}</p>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{office.hours}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{office.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{office.email}</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      Get Directions
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Global Support */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Globe className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Global Support Network</h2>
              <p className="text-muted-foreground mb-8">
                While we're based in Nigeria, our support team provides assistance to photographers 
                and clients worldwide. We're committed to helping the global photography community succeed.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-2">24/7</h3>
                  <p className="text-muted-foreground">Support Availability</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-2">15+</h3>
                  <p className="text-muted-foreground">Languages Supported</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-2">50+</h3>
                  <p className="text-muted-foreground">Countries Served</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;