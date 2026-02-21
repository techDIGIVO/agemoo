import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Users, Globe, Award, Heart, Zap } from "lucide-react";
import CommunitySignupDialog from "@/components/community/CommunitySignupDialog";

const About = () => {
  const [showCommunityDialog, setShowCommunityDialog] = useState(false);
  
  const stats = [
    { label: "Active Photographers", value: "10,000+", icon: Camera },
    { label: "Countries Served", value: "45+", icon: Globe },
    { label: "Projects Completed", value: "50,000+", icon: Award },
    { label: "Community Members", value: "25,000+", icon: Users }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Photography",
      description: "We believe photography is more than just capturing moments - it's about telling stories and preserving memories."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Our platform is built by photographers, for photographers. Every feature is designed with our community in mind."
    },
    {
      icon: Zap,
      title: "Innovation & Excellence",
      description: "We continuously push boundaries to provide the best tools and opportunities for creative professionals."
    }
  ];


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        {/* Hero Section */}
        <section className="py-20 hero-gradient">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                About Agemoo
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Empowering the Next Generation of 
                <span className="text-gradient"> African Photographers</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                We're on a mission to revolutionize the photography industry across Africa and beyond, 
                creating opportunities for talented photographers to thrive and succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="text-lg px-8"
                  onClick={() => setShowCommunityDialog(true)}
                >
                  Join Our Community
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Our Story
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6 text-center shadow-soft">
                  <stat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Mission</h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-12">
                To democratize access to photography opportunities across Africa while providing world-class 
                tools and resources that enable photographers to build sustainable, profitable businesses. 
                We believe every talented photographer deserves the chance to turn their passion into prosperity.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mt-16">
                {values.map((value, index) => (
                  <Card key={index} className="p-8 shadow-soft">
                    <value.icon className="w-12 h-12 text-primary mx-auto mb-6" />
                    <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>


      </main>
      <Footer />
      
      <CommunitySignupDialog 
        open={showCommunityDialog}
        onOpenChange={setShowCommunityDialog}
      />
    </div>
  );
};

export default About;