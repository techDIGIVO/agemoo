import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Star, MapPin, Calendar, MessageCircle, Heart, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const GearDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gear, setGear] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGear = async () => {
      if (!id) return;
      
      // Try to fetch by slug first, if not found, try by ID (for backward compatibility)
      let data, error;
      
      // Check if slug is a number (old ID-based URLs)
      if (!isNaN(Number(id))) {
        // For demo, use mock data based on ID
        setGear({
          id: id,
          title: "Professional Camera Equipment",
          category: "Cameras",
          price_per_day: 25000,
          rating: 4.8,
          reviews_count: 45,
          location: "Lagos, Nigeria",
          description: "High-quality camera equipment available for rent with flexible rental periods.",
          vendor_id: `vendor-${id}`,
          is_available: true
        });
        setLoading(false);
        return;
      }
      
      // Otherwise fetch from database by slug
      ({ data, error } = await supabase
        .from('gear')
        .select('*')
        .eq('id', id)
        .maybeSingle());

      if (error) {
        console.error('Error fetching gear:', error);
      } else {
        setGear(data);
      }
      setLoading(false);
    };

    fetchGear();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!gear) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Gear Not Found</h1>
            <Button onClick={() => navigate('/marketplace')}>
              Back to Marketplace
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

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

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Gear Image */}
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                {gear.image_url ? (
                  <img 
                    src={gear.image_url} 
                    alt={gear.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Gear Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Badge className="mb-2">{gear.category}</Badge>
                    <h1 className="text-4xl font-bold mb-2">{gear.title}</h1>
                    <div className="flex items-center space-x-4 text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-primary text-primary mr-1" />
                        <span>{gear.rating || 0} ({gear.reviews_count || 0} reviews)</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{gear.location}</span>
                      </div>
                      <Badge variant={gear.is_available ? "default" : "secondary"}>
                        {gear.is_available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>

                <Tabs defaultValue="description">
                  <TabsList>
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="specs">Specifications</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">About this equipment</h3>
                      <p className="text-muted-foreground">
                        {gear.description || "No description available"}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="specs">
                    <div className="text-center py-8 text-muted-foreground">
                      Specifications coming soon
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews">
                    <div className="text-center py-8 text-muted-foreground">
                      No reviews yet
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Rental Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-20">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">₦{gear.price_per_day.toLocaleString()}</span>
                      <span className="text-muted-foreground ml-2">/ day</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      size="lg"
                      disabled={!gear.is_available}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      {gear.is_available ? "Rent Now" : "Currently Unavailable"}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/messages')}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Owner
                    </Button>
                  </div>

                  <div className="pt-4 border-t space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Minimum rental</span>
                      <span className="font-medium">1 day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Security deposit</span>
                      <span className="font-medium">Required</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Insurance</span>
                      <span className="font-medium">Optional</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default GearDetail;
