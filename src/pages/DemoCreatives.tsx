import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, ArrowLeft, Camera, Users, Star, TrendingUp } from "lucide-react";

const DemoCreatives = () => {
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
            <h1 className="text-4xl font-bold mb-4">Platform Demo - For Creatives</h1>
            <p className="text-xl text-muted-foreground mb-8">
              See how photographers and creatives use Agemoo to grow their business
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
                      Watch how photographers manage bookings, showcase portfolios, and grow their client base
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Key Features */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="p-6">
                <Camera className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Portfolio Management</h3>
                <p className="text-muted-foreground">
                  Create stunning galleries, organize your work by category, and showcase your best projects to potential clients.
                </p>
              </Card>

              <Card className="p-6">
                <Users className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Client Bookings</h3>
                <p className="text-muted-foreground">
                  Manage bookings, accept payments, and communicate with clients all in one place. Never miss an opportunity.
                </p>
              </Card>

              <Card className="p-6">
                <Star className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Build Your Reputation</h3>
                <p className="text-muted-foreground">
                  Collect reviews, showcase testimonials, and build a 5-star profile that attracts premium clients.
                </p>
              </Card>

              <Card className="p-6">
                <TrendingUp className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Grow Your Business</h3>
                <p className="text-muted-foreground">
                  Get discovered by thousands of potential clients actively searching for photography services.
                </p>
              </Card>
            </div>

            {/* CTA */}
            <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of photographers already using Agemoo to grow their business
              </p>
              <Button size="lg" onClick={() => navigate("/auth?mode=signup")}>
                Start Your Free Trial
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DemoCreatives;
