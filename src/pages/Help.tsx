import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MessageCircle, FileText, Camera, DollarSign, Settings, Mail, Phone, Clock } from "lucide-react";

const Help = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { 
      name: "Getting Started", 
      icon: Camera, 
      color: "bg-blue-500",
      articles: 12,
      description: "Learn the basics of using BOP 3.0"
    },
    { 
      name: "Booking & Payments", 
      icon: DollarSign, 
      color: "bg-green-500",
      articles: 8,
      description: "Payment processing and booking management"
    },
    { 
      name: "Account Settings", 
      icon: Settings, 
      color: "bg-purple-500",
      articles: 6,
      description: "Manage your profile and preferences"
    },
    { 
      name: "Gear Rentals", 
      icon: Camera, 
      color: "bg-orange-500",
      articles: 5,
      description: "Everything about renting equipment"
    },
    { 
      name: "Safety & Guidelines", 
      icon: FileText, 
      color: "bg-red-500",
      articles: 4,
      description: "Community guidelines and safety tips"
    },
    { 
      name: "Technical Support", 
      icon: Settings, 
      color: "bg-gray-500",
      articles: 10,
      description: "Troubleshooting and technical issues"
    }
  ];

  const faqs = [
    {
      question: "How do I create my photographer profile?",
      answer: "Go to your Dashboard, click on 'Profile' tab, and fill in your professional information including bio, services, pricing, and portfolio. Make sure to upload high-quality images and detailed service descriptions."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and bank transfers. All payments are processed securely through our encrypted payment system."
    },
    {
      question: "How does gear rental work?",
      answer: "Browse available gear, select your rental dates, and complete the booking. You'll receive pickup/delivery instructions. A security deposit is required and will be refunded after the equipment is returned in good condition."
    },
    {
      question: "Can I cancel or modify my booking?",
      answer: "Yes, you can cancel or modify bookings up to 24 hours before the scheduled time. Cancellations within 24 hours may incur a fee. Check our cancellation policy for specific terms."
    },
    {
      question: "How do I become a verified photographer?",
      answer: "Submit your professional credentials, portfolio samples, and complete our verification process. This includes background checks and skill assessments. Verified photographers get priority in search results."
    },
    {
      question: "What if I have technical issues during a session?",
      answer: "Contact our 24/7 support team immediately. We provide backup equipment recommendations and emergency support for critical situations. Premium members get priority technical support."
    }
  ];

  const popularArticles = [
    { title: "Setting Up Your Photography Business Profile", category: "Getting Started", readTime: "5 min" },
    { title: "Understanding Our Payment System", category: "Payments", readTime: "3 min" },
    { title: "Best Practices for Client Communication", category: "Tips", readTime: "7 min" },
    { title: "Equipment Care and Maintenance", category: "Gear", readTime: "6 min" },
    { title: "Maximizing Your Booking Success Rate", category: "Business", readTime: "8 min" },
    { title: "Safety Guidelines for Location Shoots", category: "Safety", readTime: "4 min" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        {/* Hero Section */}
        <section className="py-20 hero-gradient">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
              How can we help you?
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Find answers to your questions, browse our guides, or contact our support team.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search for help articles, FAQs, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg"
              />
              <Button className="absolute right-2 top-2">Search</Button>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                <p className="text-muted-foreground text-sm mb-4">Get instant help from our support team</p>
                <Button 
                  className="w-full"
                  onClick={() => window.open('https://wa.me/2348012345678', '_blank')}
                >
                  Start Chat
                </Button>
              </Card>
              
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                <p className="text-muted-foreground text-sm mb-4">Send us your questions via email</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = 'mailto:support@agemoo.com'}
                >
                  Send Email
                </Button>
              </Card>
              
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
                <p className="text-muted-foreground text-sm mb-4">Speak directly with our team</p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = 'tel:+2348012345678'}
                >
                  Call Us
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="categories" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                <TabsTrigger value="categories">Browse Topics</TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
                <TabsTrigger value="articles">Popular Articles</TabsTrigger>
              </TabsList>

              <TabsContent value="categories" className="mt-12">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Browse Help Topics</h2>
                  <p className="text-muted-foreground">Find help organized by category</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category, index) => (
                    <Card 
                      key={index} 
                      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate('/support/faqs')}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${category.color}`}>
                          <category.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{category.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                          <Badge variant="secondary">{category.articles} articles</Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="faqs" className="mt-12">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                  <p className="text-muted-foreground">Quick answers to common questions</p>
                </div>
                
                <div className="max-w-4xl mx-auto">
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>

              <TabsContent value="articles" className="mt-12">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Popular Help Articles</h2>
                  <p className="text-muted-foreground">Most helpful guides and tutorials</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {popularArticles.map((article, index) => (
                    <Card 
                      key={index} 
                      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate('/support/faqs')}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{article.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <Badge variant="outline">{article.category}</Badge>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{article.readTime}</span>
                            </div>
                          </div>
                        </div>
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Support Hours */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Support Hours</h2>
                  <p className="text-muted-foreground mb-6">Our support team is here to help you</p>
                  
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                      <h3 className="font-semibold mb-2">Live Chat</h3>
                      <p className="text-sm text-muted-foreground">24/7 Available</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Email Support</h3>
                      <p className="text-sm text-muted-foreground">Response within 2 hours</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Phone Support</h3>
                      <p className="text-sm text-muted-foreground">Mon-Fri 9AM-6PM WAT</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Help;