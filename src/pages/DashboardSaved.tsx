import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Bookmark, Star, MapPin, Camera, Package, Users, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DashboardSaved = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchSavedItems();
  }, [user, navigate]);

  const fetchSavedItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_saves')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // For demo purposes, create mock data for saved items
      // In production, you'd join with services/gear/vendors tables
      const mockSavedItems = (data || []).map((save, index) => ({
        id: save.id,
        item_id: save.item_id,
        item_type: save.item_type,
        created_at: save.created_at,
        // Mock data based on type
        ...(save.item_type === 'service' ? {
          title: `Professional ${['Photography', 'Videography', 'Photo Editing'][index % 3]} Service`,
          vendor: `Vendor ${index + 1}`,
          price: `₦${(45 + index * 10) * 1000}`,
          rating: 4.5 + (index % 5) * 0.1,
          reviews: 50 + index * 10,
          location: ['Lagos', 'Abuja', 'Accra'][index % 3],
          category: ['Portrait', 'Wedding', 'Event'][index % 3],
        } : save.item_type === 'gear' ? {
          title: `Professional ${['Camera', 'Lens', 'Lighting'][index % 3]} Equipment`,
          owner: `Owner ${index + 1}`,
          price_per_day: `₦${(25 + index * 5) * 1000}`,
          rating: 4.6 + (index % 4) * 0.1,
          reviews: 30 + index * 5,
          location: ['Lagos', 'Cape Town', 'Nairobi'][index % 3],
          category: ['Cameras', 'Lenses', 'Lighting'][index % 3],
        } : {
          name: `Studio ${index + 1}`,
          owner: `Owner ${index + 1}`,
          rating: 4.7 + (index % 3) * 0.1,
          projects: 100 + index * 20,
          location: ['Lagos', 'Kigali', 'Dar es Salaam'][index % 3],
          specialties: ['Wedding', 'Portrait', 'Event'],
        })
      }));

      setSavedItems(mockSavedItems);
    } catch (error: any) {
      console.error('Error fetching saved items:', error);
      toast({
        variant: "destructive",
        title: "Error loading saved items",
        description: error.message || "Failed to load your saved items",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (saveId: string) => {
    try {
      const { error } = await supabase
        .from('user_saves')
        .delete()
        .eq('id', saveId);

      if (error) throw error;

      setSavedItems(items => items.filter(item => item.id !== saveId));
      
      toast({
        title: "Removed from saved",
        description: "Item has been removed from your saved items",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to remove item",
      });
    }
  };

  const filteredItems = activeTab === "all" 
    ? savedItems 
    : savedItems.filter(item => item.item_type === activeTab);

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">Loading your saved items...</div>
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
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold flex items-center">
                  <Bookmark className="w-8 h-8 mr-3 text-primary" />
                  Saved Items
                </h1>
                <p className="text-muted-foreground mt-1">
                  {savedItems.length} {savedItems.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>
          </div>

          {savedItems.length === 0 ? (
            <Card className="p-12 text-center">
              <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">No saved items yet</h2>
              <p className="text-muted-foreground mb-6">
                Start exploring and save your favorite services, gear, and vendors
              </p>
              <div className="flex justify-center space-x-3">
                <Button onClick={() => navigate('/services')}>
                  Browse Services
                </Button>
                <Button variant="outline" onClick={() => navigate('/gear')}>
                  Browse Gear
                </Button>
              </div>
            </Card>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">
                  All ({savedItems.length})
                </TabsTrigger>
                <TabsTrigger value="service">
                  <Camera className="w-4 h-4 mr-2" />
                  Services ({savedItems.filter(i => i.item_type === 'service').length})
                </TabsTrigger>
                <TabsTrigger value="gear">
                  <Package className="w-4 h-4 mr-2" />
                  Gear ({savedItems.filter(i => i.item_type === 'gear').length})
                </TabsTrigger>
                <TabsTrigger value="vendor">
                  <Users className="w-4 h-4 mr-2" />
                  Vendors ({savedItems.filter(i => i.item_type === 'vendor').length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {item.item_type === 'service' && (
                        <>
                          <div 
                            className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center cursor-pointer"
                            onClick={() => navigate(`/service/${item.item_id}`)}
                          >
                            <Camera className="w-12 h-12 text-primary" />
                          </div>
                          <div className="p-5">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary">{item.category}</Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleUnsave(item.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                            <h3 
                              className="text-lg font-semibold mb-1 cursor-pointer hover:text-primary"
                              onClick={() => navigate(`/service/${item.item_id}`)}
                            >
                              {item.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-3">by {item.vendor}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                                <span>{item.rating}</span>
                                <span className="ml-1">({item.reviews})</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{item.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-semibold text-primary">{item.price}</span>
                              <Button 
                                size="sm"
                                onClick={() => navigate(`/service/${item.item_id}`)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </>
                      )}

                      {item.item_type === 'gear' && (
                        <>
                          <div 
                            className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center cursor-pointer"
                            onClick={() => navigate(`/gear/${item.item_id}`)}
                          >
                            <Package className="w-12 h-12 text-purple-600" />
                          </div>
                          <div className="p-5">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary">{item.category}</Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleUnsave(item.id)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                            <h3 
                              className="text-lg font-semibold mb-1 cursor-pointer hover:text-primary"
                              onClick={() => navigate(`/gear/${item.item_id}`)}
                            >
                              {item.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-3">by {item.owner}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                                <span>{item.rating}</span>
                                <span className="ml-1">({item.reviews})</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{item.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-primary">{item.price_per_day}/day</span>
                              <Button 
                                size="sm"
                                onClick={() => navigate(`/gear/${item.item_id}`)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </>
                      )}

                      {item.item_type === 'vendor' && (
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div 
                              className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl cursor-pointer"
                              onClick={() => navigate(`/vendor/${item.item_id}`)}
                            >
                              {item.name.substring(0, 2)}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUnsave(item.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                          <h3 
                            className="text-lg font-semibold mb-1 cursor-pointer hover:text-primary"
                            onClick={() => navigate(`/vendor/${item.item_id}`)}
                          >
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">by {item.owner}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.specialties.map((specialty: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-sm mb-4">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                              <span>{item.rating}</span>
                            </div>
                            <span className="text-muted-foreground">{item.projects} projects</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-4">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{item.location}</span>
                          </div>
                          <Button 
                            className="w-full"
                            onClick={() => navigate(`/vendor/${item.item_id}`)}
                          >
                            View Profile
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>

                {filteredItems.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No {activeTab === 'all' ? '' : activeTab} items saved yet</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DashboardSaved;
