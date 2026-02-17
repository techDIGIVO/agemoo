import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, Calendar, Shield, Plus, Camera } from "lucide-react";
import { GearDetailsDialog } from "@/components/gear/GearDetailsDialog";
import { AddCategoryDialog } from "@/components/marketplace/AddCategoryDialog";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";

interface GearItem {
  id: string;
  owner: string;
  vendor_id: string | null;
  title: string;
  category: string;
  priceDay: string;
  priceWeek: string;
  rating: number;
  reviews: number;
  location: string;
  image: string | null;
  verified: boolean;
  condition: string;
}

const Gear = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedGear, setSelectedGear] = useState<any>(null);
  const [addCategoryDialog, setAddCategoryDialog] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allGearItems, setAllGearItems] = useState<GearItem[]>([]);
  const [loadingGear, setLoadingGear] = useState(true);
  
  // Initialize from URL params
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "All Categories");
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || "All Locations");
  
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  // Fetch real gear from Supabase
  useEffect(() => {
    const fetchGear = async () => {
      try {
        const { data, error } = await supabase
          .from('gear')
          .select(`
            *,
            profiles:vendor_id (
              id,
              name,
              avatar_url,
              location
            )
          `)
          .eq('is_available', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mapped: GearItem[] = (data || []).map((g: any) => ({
          id: g.id,
          owner: g.profiles?.name || 'Equipment Owner',
          vendor_id: g.vendor_id,
          title: g.title,
          category: g.category,
          priceDay: `\u20a6${Number(g.price_per_day).toLocaleString()}`,
          priceWeek: `\u20a6${Math.round(Number(g.price_per_day) * 5.5).toLocaleString()}`,
          rating: g.rating || 0,
          reviews: g.reviews_count || 0,
          location: g.profiles?.location || g.location || 'Nigeria',
          image: g.image_url,
          verified: true,
          condition: 'Good'
        }));

        setAllGearItems(mapped);
      } catch (error) {
        console.error('Error fetching gear:', error);
      } finally {
        setLoadingGear(false);
      }
    };

    fetchGear();
  }, []);
  
  // Fetch custom categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('name')
        .eq('type', 'gear')
        .order('name');
      
      if (data) {
        setCustomCategories(data.map(c => c.name));
      }
    };
    
    fetchCategories();
  }, []);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "All Categories") params.set('category', selectedCategory);
    if (searchTerm) params.set('search', searchTerm);
    if (selectedLocation !== "All Locations") params.set('location', selectedLocation);
    setSearchParams(params, { replace: true });
  }, [selectedCategory, searchTerm, selectedLocation, setSearchParams]);

  const categories = [
    "All Categories",
    "Cameras", 
    "Lenses",
    "Lighting",
    "Tripods",
    "Audio",
    "Accessories",
    ...customCategories
  ];

  const conditionLabels: Record<string, string> = {
    excellent: t('gear.condition.excellent'),
    'very good': t('gear.condition.veryGood'),
    good: t('gear.condition.good'),
  };

  // Filter gear based on search, category, and location
  const filteredGearItems = allGearItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || 
                           selectedCategory === "all categories" || 
                           item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesLocation = selectedLocation === "All Locations" || 
                           item.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const gearItems = filteredGearItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredGearItems.length;

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 6);
      setIsLoadingMore(false);
    }, 300);
  };

  const loadMoreRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading: isLoadingMore
  });

  const handleGearClick = (gearId: number) => {
  navigate(`/gear/${gearId}`);
};

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        {/* Hero Section */}
        <section className="py-12 hero-gradient">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t('gear.heroTitleStart')} <span className="text-gradient">{t('gear.heroTitleHighlight')}</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                {t('gear.subtitle')}
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <Card className="p-6 shadow-medium">
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder={t('gear.searchPlaceholder')} 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder={t('gear.categoryLabel')} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat.toLowerCase()}>
                            {cat === "All Categories" ? t('services.allCategories') : cat}
                          </SelectItem>
                        ))}
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start mt-2 border-t"
                          onClick={(e) => {
                            e.preventDefault();
                            setAddCategoryDialog(true);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {t('gear.addCustomCategory')}
                        </Button>
                      </SelectContent>
                    </Select>
                    {selectedCategory !== "All Categories" && selectedCategory !== "all categories" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setSelectedCategory("All Categories")}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                  <Button className="font-medium">{t('common.search')}</Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Gear Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loadingGear ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <div className="aspect-video bg-muted" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-5 bg-muted rounded w-2/3" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gearItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-medium transition-smooth">
                  {/* Clickable Image */}
                  <div 
                    className="aspect-video bg-muted relative cursor-pointer"
                    onClick={() => navigate(`/gear/${item.id}`)}
                  >
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                        <Camera className="w-12 h-12 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-100 text-green-800">{t('gear.available')}</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      {/* Clickable Category Badge */}
                      <Badge 
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                        onClick={() => {
                          setSelectedCategory(item.category);
                          setVisibleCount(6);
                        }}
                      >
                        {item.category}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        {item.verified && (
                          <Shield className="w-4 h-4 text-green-600" />
                        )}
                        <Badge variant="outline">{conditionLabels[item.condition.toLowerCase()] || item.condition}</Badge>
                      </div>
                    </div>
                    
                    {/* Clickable Title */}
                    <h3 
                      className="text-lg font-semibold mb-2 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => navigate(`/gear/${item.id}`)}
                    >
                      {item.title}
                    </h3>
                    
                    {/* Clickable Owner Name */}
                    <p 
                      className="text-muted-foreground mb-3 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => item.vendor_id ? navigate(`/vendor/${item.vendor_id}`) : navigate(`/gear/${item.id}`)}
                    >
                      {t('services.by')} {item.owner}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                      {/* Clickable Star/Reviews */}
                      <div 
                        className="flex items-center space-x-1 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => navigate(`/gear/${item.id}#reviews`)}
                      >
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{item.rating}</span>
                        <span>({item.reviews})</span>
                      </div>
                      
                      {/* Clickable Location */}
                      <div 
                        className="flex items-center space-x-1 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => {
                          setSelectedLocation(item.location);
                          setVisibleCount(6);
                        }}
                      >
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">{t('gear.dailyLabel')}</span>
                        <span className="font-semibold text-primary">{item.priceDay}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">{t('gear.weeklyLabel')}</span>
                        <span className="font-semibold text-primary">{item.priceWeek}</span>
                      </div>
                      <Button 
                        className="w-full"
                       onClick={() => navigate(`/gear/${item.id}/availability`)}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        {t('gear.checkAvailability')}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            )}

            {/* Infinite Scroll Trigger */}
            {!loadingGear && hasMore && (
              <div ref={loadMoreRef} className="text-center py-8">
                {isLoadingMore && (
                  <div className="text-muted-foreground">{t('gear.loadingMore')}</div>
                )}
              </div>
            )}

            {/* No Results */}
            {!loadingGear && filteredGearItems.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No gear found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search criteria or explore different categories</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All Categories");
                    setSelectedLocation("All Locations");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      
      {selectedGear && (
        <GearDetailsDialog
          isOpen={!!selectedGear}
          onClose={() => setSelectedGear(null)}
          gear={selectedGear}
        />
      )}
      
      <AddCategoryDialog
        isOpen={addCategoryDialog}
        onClose={() => setAddCategoryDialog(false)}
        onCategoryAdded={(category) => {
          setCustomCategories(prev => [...prev, category]);
          setSelectedCategory(category);
        }}
        type="gear"
      />
    </div>
  );
};

export default Gear;