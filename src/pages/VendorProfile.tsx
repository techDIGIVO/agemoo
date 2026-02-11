import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Star, MapPin, MessageCircle, Share2, Camera, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageButton } from "@/components/marketplace/MessageButton";
import { useToast } from "@/hooks/use-toast";

const VendorProfile = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vendor, setVendor] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [gear, setGear] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vendor.name} - Photographer Profile`,
          text: `Check out ${vendor.name}'s profile on Agemoo`,
          url: url
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "Profile link copied to clipboard",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to copy",
          description: "Could not copy link to clipboard",
        });
      }
    }
  };

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!vendorId) return;

      // Fetch services by vendor
      const { data: servicesData } = await supabase
        .from('services')
        .select('*')
        .eq('vendor_id', vendorId);

      // Fetch gear by vendor
      const { data: gearData } = await supabase
        .from('gear')
        .select('*')
        .eq('vendor_id', vendorId);

      setServices(servicesData || []);
      setGear(gearData || []);
      
      // For demo, create a vendor profile
      setVendor({
        id: vendorId,
        name: "Professional Photographer",
        bio: "Passionate photographer specializing in capturing life's precious moments",
        location: "Lagos, Nigeria",
        rating: 4.8,
        reviewCount: 45,
        joinedDate: "2023"
      });

      setLoading(false);
    };

    fetchVendorData();
  }, [vendorId]);

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

  if (!vendor) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Vendor Not Found</h1>
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

          {/* Vendor Header */}
          <Card className="p-8 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="text-2xl">
                    {vendor.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{vendor.name}</h1>
                  <div className="flex items-center space-x-4 text-muted-foreground mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-primary text-primary mr-1" />
                      <span>{vendor.rating} ({vendor.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{vendor.location}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground max-w-2xl">{vendor.bio}</p>
                  <div className="mt-4 flex items-center space-x-3">
                    <MessageButton 
                      vendorId={vendorId || ''}
                      vendorName={vendor.name}
                    />
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Vendor Listings */}
          <Tabs defaultValue="services">
            <TabsList>
              <TabsTrigger value="services">
                <Camera className="w-4 h-4 mr-2" />
                Services ({services.length})
              </TabsTrigger>
              <TabsTrigger value="gear">
                <Package className="w-4 h-4 mr-2" />
                Gear ({gear.length})
              </TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="mt-6">
              {services.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <Card 
                      key={service.id} 
                      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigate(`/service/${service.slug}`)}
                    >
                      <div className="aspect-video bg-muted" />
                      <div className="p-4">
                        <Badge className="mb-2">{service.category}</Badge>
                        <h3 className="font-semibold mb-2">{service.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="font-bold">₦{service.price.toLocaleString()}</span>
                          <div className="flex items-center text-sm">
                            <Star className="w-3 h-3 fill-primary text-primary mr-1" />
                            <span>{service.rating || 0}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No services available yet
                </div>
              )}
            </TabsContent>

            <TabsContent value="gear" className="mt-6">
              {gear.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gear.map((item) => (
                    <Card 
                      key={item.id} 
                      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigate(`/gear/${item.slug}`)}
                    >
                      <div className="aspect-video bg-muted" />
                      <div className="p-4">
                        <Badge className="mb-2">{item.category}</Badge>
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="font-bold">₦{item.price_per_day.toLocaleString()}/day</span>
                          <Badge variant={item.is_available ? "default" : "secondary"}>
                            {item.is_available ? "Available" : "Rented"}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No gear available yet
                </div>
              )}
            </TabsContent>

            <TabsContent value="about" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">About {vendor.name}</h3>
                <p className="text-muted-foreground mb-6">{vendor.bio}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member since</span>
                    <span className="font-medium">{vendor.joinedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response time</span>
                    <span className="font-medium">Usually within 24 hours</span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card className="p-6">
                <div className="text-center py-12 text-muted-foreground">
                  No reviews yet
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default VendorProfile;
