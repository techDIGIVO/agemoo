import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, ArrowLeft, Printer, Package, DollarSign, BarChart3 } from "lucide-react";

const DemoPrinters = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      <Header />
      <main className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Platform Demo - For Print Services</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover how printing businesses connect with photographers on Agemoo
            </p>

            {/* Video Player Placeholder */}
            <Card className="overflow-hidden mb-12">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                {!isPlaying ? (
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="w-20 h-20 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all hover:scale-110"
                  >
                    <Play className="w-10 h-10 text-primary ml-1" />
                  </button>
                ) : (
                  <div className="text-center text-white p-8">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <h3 className="text-2xl font-semibold mb-2">Demo Video Coming Soon</h3>
                    <p className="text-lg opacity-90">
                      Learn how print services manage orders, showcase products, and connect with photographers
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Key Features */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="p-6">
                <Printer className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Product Showcase</h3>
                <p className="text-muted-foreground">
                  Display your printing services, paper types, finishes, and sizes. Let photographers see exactly what you offer.
                </p>
              </Card>

              <Card className="p-6">
                <Package className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Order Management</h3>
                <p className="text-muted-foreground">
                  Receive, track, and fulfill print orders seamlessly. Stay organized with built-in order management tools.
                </p>
              </Card>

              <Card className="p-6">
                <DollarSign className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                <p className="text-muted-foreground">
                  Get paid securely through our platform. Set your prices, offer packages, and track your earnings.
                </p>
              </Card>

              <Card className="p-6">
                <BarChart3 className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Business Analytics</h3>
                <p className="text-muted-foreground">
                  Track your most popular products, revenue trends, and customer satisfaction metrics.
                </p>
              </Card>
            </div>

            {/* CTA */}
            <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Join Our Network</h2>
              <p className="text-muted-foreground mb-6">
                Connect with photographers across Africa and grow your printing business
              </p>
              <Button size="lg" onClick={() => navigate("/auth?mode=signup")}>
                Register Your Print Service
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DemoPrinters;
