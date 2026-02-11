import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Star, MapPin, Clock, DollarSign, Calendar, MessageCircle, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SaveButton } from "@/components/marketplace/SaveButton";
import { MessageButton } from "@/components/marketplace/MessageButton";

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      if (!slug) return;
      
      // Try to fetch by slug first, if not found, try by ID (for backward compatibility)
      let data, error;
      
      // Check if slug is a number (old ID-based URLs)
      if (!isNaN(Number(slug))) {
        // For demo, use mock data based on ID
        setService({
          id: slug,
          title: "Professional Photography Service",
          category: "Portrait Photography",
          price: "45,000",
          rating: 4.9,
          reviews: 127,
          location: "Lagos, Nigeria",
          duration: "2-3 hours",
          description: "Professional photography service with years of experience capturing beautiful moments.",
          vendor_id: `vendor-${slug}`,
          image_url: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=300&fit=crop"
        });
        setLoading(false);
        return;
      }
      
      // Otherwise fetch from database by slug
      ({ data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .maybeSingle());

      if (error) {
        console.error('Error fetching service:', error);
      } else {
        setService(data);
      }
      setLoading(false);
    };

    fetchService();
  }, [slug]);

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

  if (!service) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
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
              {/* Service Image */}
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                {service.image_url ? (
                  <img 
                    src={service.image_url} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground">No image available</span>
                  </div>
                )}
              </div>

              {/* Service Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Badge className="mb-2">{service.category}</Badge>
                    <h1 className="text-4xl font-bold mb-2">{service.title}</h1>
                    <div className="flex items-center space-x-4 text-muted-foreground">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-primary text-primary mr-1" />
                        <span>{service.rating || 0} ({service.reviews_count || 0} reviews)</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{service.location}</span>
                      </div>
                    </div>
                  </div>
                  <SaveButton 
                    itemType="service" 
                    itemId={service.id}
                    variant="outline"
                    size="icon"
                  />
                </div>

                <Tabs defaultValue="description">
                  <TabsList>
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">About this service</h3>
                      <p className="text-muted-foreground">
                        {service.description || "No description available"}
                      </p>
                    </div>
                    {service.duration && (
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Duration: {service.duration}</span>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="reviews">
                    <div className="text-center py-8 text-muted-foreground">
                      No reviews yet
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-20">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">₦{service.price.toLocaleString()}</span>
                      {service.duration && (
                        <span className="text-muted-foreground ml-2">/ {service.duration}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      size="lg"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                    <MessageButton 
                      vendorId={service.vendor_id || service.id}
                      variant="outline"
                      className="w-full"
                    />
                  </div>

                  <div className="pt-4 border-t space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Response time</span>
                      <span className="font-medium">Usually within 24 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cancellation</span>
                      <span className="font-medium">Free up to 48h before</span>
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

export default ServiceDetail;
