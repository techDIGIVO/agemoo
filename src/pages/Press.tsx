import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Camera, TrendingUp, Users, Globe } from "lucide-react";

const Press = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        <section className="py-20 hero-gradient">
          <div className="container mx-auto px-4 text-center">
            <Camera className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">Press Kit</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Media resources, company information, and press materials for journalists and partners.
            </p>
            <Button size="lg">
              <Download className="w-4 h-4 mr-2" />
              Download Full Press Kit
            </Button>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                { label: "Active Photographers", value: "12,000+", icon: Users },
                { label: "Successful Bookings", value: "50,000+", icon: Camera },
                { label: "Countries Served", value: "25+", icon: Globe },
                { label: "Platform Growth", value: "300%", icon: TrendingUp }
              ].map((stat, index) => (
                <Card key={index} className="p-6 text-center">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </Card>
              ))}
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              <Card className="p-8">
                <CardHeader>
                  <CardTitle>About Agemoo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Agemoo is Nigeria's leading photography marketplace platform, 
                    connecting professional photographers with clients and providing comprehensive 
                    business tools for creative professionals.
                  </p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <CardTitle className="mb-4">Media Resources</CardTitle>
                  <div className="space-y-3">
                    {['Company Logo (PNG)', 'Company Logo (SVG)', 'Brand Guidelines', 'Product Screenshots'].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm">{item}</span>
                        <Button variant="outline" size="sm">Download</Button>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <CardTitle className="mb-4">Recent News</CardTitle>
                  <div className="space-y-4">
                    {[
                      { title: "Agemoo Raises $5M Series A", date: "Jan 2024" },
                      { title: "Platform Expansion to Ghana", date: "Dec 2023" },
                      { title: "Photography Awards Partnership", date: "Nov 2023" }
                    ].map((news, idx) => (
                      <div key={idx}>
                        <h4 className="font-medium">{news.title}</h4>
                        <Badge variant="outline" className="mt-1">{news.date}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Press;