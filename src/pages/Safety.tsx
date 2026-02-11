import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, AlertTriangle, Users, Camera, MapPin, Phone, CheckCircle, FileText } from "lucide-react";

const Safety = () => {
  const safetyGuidelines = [
    {
      category: "Personal Safety",
      icon: Shield,
      color: "bg-green-500",
      guidelines: [
        "Always meet clients in public places for initial consultations",
        "Inform someone about your shoot location and expected return time",
        "Trust your instincts - leave if you feel uncomfortable",
        "Carry emergency contacts and a charged phone",
        "Use BOP 3.0's verified photographer badge system"
      ]
    },
    {
      category: "Equipment Safety",
      icon: Camera,
      color: "bg-blue-500",
      guidelines: [
        "Inspect all rented equipment before and after use",
        "Use proper carrying cases and protective gear",
        "Follow manufacturer guidelines for equipment operation",
        "Report any damage immediately to avoid liability",
        "Take photos/videos of equipment condition upon receipt"
      ]
    },
    {
      category: "Location Safety",
      icon: MapPin,
      color: "bg-orange-500",
      guidelines: [
        "Scout locations during daylight hours when possible",
        "Check for necessary permits and permissions",
        "Be aware of weather conditions and terrain hazards",
        "Respect private property and local regulations",
        "Have backup location plans for outdoor shoots"
      ]
    },
    {
      category: "Financial Safety",
      icon: AlertTriangle,
      color: "bg-red-500",
      guidelines: [
        "Use only BOP 3.0's secure payment system",
        "Never share banking details outside the platform",
        "Require deposits for high-value bookings",
        "Keep detailed records of all transactions",
        "Report suspicious payment requests immediately"
      ]
    }
  ];

  const communityGuidelines = [
    {
      title: "Professional Conduct",
      rules: [
        "Maintain professional communication at all times",
        "Deliver services as described in your profile",
        "Respect client privacy and confidentiality",
        "Provide honest and accurate service descriptions",
        "Respond to messages and bookings promptly"
      ]
    },
    {
      title: "Content Standards",
      rules: [
        "Upload only high-quality, original work",
        "Ensure you have rights to all posted content",
        "No inappropriate, offensive, or discriminatory content",
        "Accurately represent your skills and experience",
        "Respect copyright and intellectual property"
      ]
    },
    {
      title: "Platform Usage",
      rules: [
        "One account per person or business",
        "No spam, fake reviews, or manipulation",
        "Report violations and suspicious activity",
        "Follow all local laws and regulations",
        "Maintain accurate and up-to-date profile information"
      ]
    }
  ];

  const emergencyContacts = [
    { service: "Platform Support", number: "+234-800-BOP-HELP", hours: "24/7" },
    { service: "Emergency Services", number: "199 (Nigeria)", hours: "24/7" },
    { service: "Safety Hotline", number: "+234-800-SAFE-NOW", hours: "24/7" }
  ];

  const safetyTips = [
    {
      title: "Before the Shoot",
      tips: [
        "Verify client identity through platform messaging",
        "Discuss shoot details and expectations clearly",
        "Share your itinerary with a trusted contact",
        "Check weather and location conditions",
        "Ensure all equipment is functioning properly"
      ]
    },
    {
      title: "During the Shoot",
      tips: [
        "Stay alert and aware of your surroundings",
        "Keep communication devices accessible",
        "Take breaks when needed - don't overexert",
        "Document any issues or concerns immediately",
        "Trust your professional judgment on safety decisions"
      ]
    },
    {
      title: "After the Shoot",
      tips: [
        "Confirm safe arrival at your destination",
        "Complete payment processing promptly",
        "Return rented equipment as scheduled",
        "Update your calendar and availability",
        "Report any incidents through proper channels"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        {/* Hero Section */}
        <section className="py-20 hero-gradient">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
              Safety Guidelines
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Your safety is our top priority. Follow these guidelines to ensure secure and professional 
              experiences on the BOP 3.0 platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg">Download Safety Guide</Button>
              <Button variant="outline" size="lg">Report an Issue</Button>
            </div>
          </div>
        </section>

        {/* Safety Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Essential Safety Guidelines</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive safety protocols to protect photographers, clients, and equipment
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {safetyGuidelines.map((section, index) => (
                <Card key={index} className="p-6">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${section.color}`}>
                        <section.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>{section.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.guidelines.map((guideline, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{guideline}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Community Guidelines</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Standards that help maintain a professional and respectful environment for everyone
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {communityGuidelines.map((section, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-lg font-semibold">
                      {section.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-3">
                        {section.rules.map((rule, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Safety Tips */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Photography Session Safety Tips</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Step-by-step safety protocols for every phase of your photography work
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {safetyTips.map((phase, index) => (
                <Card key={index} className="p-6">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <span>{phase.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {phase.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency Contacts */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Emergency Contacts</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Important contacts for safety emergencies and platform support
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {emergencyContacts.map((contact, index) => (
                <Card key={index} className="p-6 text-center">
                  <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{contact.service}</h3>
                  <p className="text-lg font-mono text-primary mb-2">{contact.number}</p>
                  <Badge variant="secondary">{contact.hours}</Badge>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Card className="max-w-2xl mx-auto p-6 bg-red-50 border-red-200">
                <div className="flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Report Safety Concerns Immediately
                </h3>
                <p className="text-red-700 text-sm mb-4">
                  If you experience or witness any safety violations, harassment, or suspicious activity, 
                  report it through our platform immediately.
                </p>
                <Button className="bg-red-600 hover:bg-red-700">
                  Report Safety Issue
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Additional Resources</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Download guides, forms, and resources to help you stay safe
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { title: "Safety Checklist", type: "PDF", size: "2.1 MB" },
                { title: "Emergency Contact Form", type: "DOC", size: "156 KB" },
                { title: "Equipment Safety Guide", type: "PDF", size: "3.8 MB" },
                { title: "Location Safety Tips", type: "PDF", size: "1.9 MB" }
              ].map((resource, index) => (
                <Card key={index} className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">{resource.title}</h3>
                  <div className="flex justify-center space-x-2 text-xs text-muted-foreground">
                    <Badge variant="outline">{resource.type}</Badge>
                    <span>{resource.size}</span>
                  </div>
                  <Button variant="outline" className="w-full mt-3" size="sm">
                    Download
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Safety;