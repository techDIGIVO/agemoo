import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, Calendar, Shield, Plus } from "lucide-react";
import { GearDetailsDialog } from "@/components/gear/GearDetailsDialog";
import { AddCategoryDialog } from "@/components/marketplace/AddCategoryDialog";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import canon5D from "@/assets/Canon5DIV.webp"
import manfrotto from "@/assets/manfrotto-tripod.avif"
import rode from "@/assets/RODE-side.jpg"
import ronin_gimbal from "@/assets/ronin-s-gimbal.jpg"
import tripod from "@/assets/tripod.jpg"

const Gear = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedGear, setSelectedGear] = useState<any>(null);
  const [addCategoryDialog, setAddCategoryDialog] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Initialize from URL params
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "All Categories");
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || "All Locations");
  
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  
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

  const allGearItems = [
    {
      id: 1,
      owner: "David Chen",
      title: "Sony α7R V Mirrorless Camera",
      category: "Cameras",
      priceDay: "$89",
      priceWeek: "$450",
      rating: 4.9,
      reviews: 67,
      location: "Cape Town, SA",
      image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop",
      verified: true,
      condition: "Excellent"
    },
    {
      id: 2,
      owner: "Sarah Williams", 
      title: "Canon EF 70-200mm f/2.8L",
      category: "Lenses",
      priceDay: "$45",
      priceWeek: "$250",
      rating: 4.8,
      reviews: 43,
      location: "Johannesburg, SA",
      image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&h=300&fit=crop",
      verified: true,
      condition: "Very Good"
    },
    {
      id: 3,
      owner: "Mike Thompson",
      title: "Profoto B1X 500 AirTTL",
      category: "Lighting",
      priceDay: "$75",
      priceWeek: "$400",
      rating: 5.0,
      reviews: 28,
      location: "Nairobi, Kenya",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop",
      verified: true,
      condition: "Excellent"
    },
    {
      id: 4,
      owner: "Emma Rodriguez",
      title: "Canon 5D Mark IV",
      category: "Cameras",
      priceDay: "$65",
      priceWeek: "$350",
      rating: 4.7,
      reviews: 89,
      location: "Lagos, Nigeria",
      image: canon5D,
      verified: true,
      condition: "Very Good"
    },
    {
      id: 5,
      owner: "James Wilson",
      title: "Sony FE 24-70mm f/2.8 GM",
      category: "Lenses",
      priceDay: "$55",
      priceWeek: "$300",
      rating: 4.9,
      reviews: 156,
      location: "Accra, Ghana",
      image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&h=300&fit=crop",
      verified: true,
      condition: "Excellent"
    },
    {
      id: 6,
      owner: "Lisa Park",
      title: "Manfrotto Carbon Fiber Tripod",
      category: "Tripods",
      priceDay: "$25",
      priceWeek: "$120",
      rating: 4.6,
      reviews: 34,
      location: "Durban, SA",
      image: manfrotto,
      verified: true,
      condition: "Good"
    },
    {
      id: 7,
      owner: "Ahmed Hassan",
      title: "Godox AD600 Pro",
      category: "Lighting",
      priceDay: "$60",
      priceWeek: "$320",
      rating: 4.8,
      reviews: 92,
      location: "Cairo, Egypt",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop",
      verified: true,
      condition: "Excellent"
    },
    {
      id: 8,
      owner: "Maria Santos",
      title: "DJI Ronin-S Gimbal",
      category: "Accessories",
      priceDay: "$40",
      priceWeek: "$200",
      rating: 4.5,
      reviews: 78,
      location: "Luanda, Angola",
      image: ronin_gimbal,
      verified: true,
      condition: "Very Good"
    },
    {
      id: 9,
      owner: "Kevin Chang",
      title: "Nikon D850",
      category: "Cameras",
      priceDay: "$70",
      priceWeek: "$380",
      rating: 4.7,
      reviews: 145,
      location: "Casablanca, Morocco",
      image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop",
      verified: true,
      condition: "Excellent"
    },
    {
      id: 10,
      owner: "Fatima Al-Zahra",
      title: "Canon RF 85mm f/1.2L",
      category: "Lenses",
      priceDay: "$80",
      priceWeek: "$420",
      rating: 5.0,
      reviews: 67,
      location: "Tunis, Tunisia",
      image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&h=300&fit=crop",
      verified: true,
      condition: "Excellent"
    },
    {
      id: 11,
      owner: "Tom Mitchell",
      title: "Rode VideoMic Pro Plus",
      category: "Audio",
      priceDay: "$20",
      priceWeek: "$100",
      rating: 4.6,
      reviews: 45,
      location: "Kigali, Rwanda",
      image: rode,
      verified: true,
      condition: "Good"
    },
    {
      id: 12,
      owner: "Sophie Laurent",
      title: "Elinchrom ELB 500 TTL",
      category: "Lighting",
      priceDay: "$65",
      priceWeek: "$340",
      rating: 4.7,
      reviews: 83,
      location: "Dakar, Senegal",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop",
      verified: true,
      condition: "Very Good"
    },
    {
      id: 13,
      owner: "Marcus Johnson",
      title: "Fujifilm X-T5",
      category: "Cameras",
      priceDay: "$75",
      priceWeek: "$390",
      rating: 4.8,
      reviews: 124,
      location: "Kampala, Uganda",
      image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop",
      verified: true,
      condition: "Excellent"
    },
    {
      id: 14,
      owner: "Priya Sharma",
      title: "Peak Design Travel Tripod",
      category: "Tripods",
      priceDay: "$35",
      priceWeek: "$180",
      rating: 4.9,
      reviews: 156,
      location: "Addis Ababa, Ethiopia",
      image: tripod,
      verified: true,
      condition: "Excellent"
    },
    {
      id: 15,
      owner: "Omar Benali",
      title: "Sony α7 III",
      category: "Cameras",
      priceDay: "$60",
      priceWeek: "$310",
      rating: 4.6,
      reviews: 203,
      location: "Rabat, Morocco",
      image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop",
      verified: true,
      condition: "Good"
    },
    {
      id: 16,
      owner: "Rachel Green",
      title: "Tamron 28-75mm f/2.8",
      category: "Lenses",
      priceDay: "$40",
      priceWeek: "$210",
      rating: 4.5,
      reviews: 87,
      location: "Windhoek, Namibia",
      image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&h=300&fit=crop",
      verified: true,
      condition: "Very Good"
    },
    {
      id: 17,
      owner: "Hassan Okoye",
      title: "Aputure LS 300D Mark II",
      category: "Lighting",
      priceDay: "$55",
      priceWeek: "$290",
      rating: 4.7,
      reviews: 76,
      location: "Abuja, Nigeria",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop",
      verified: true,
      condition: "Excellent"
    },
    {
      id: 18,
      owner: "Zara Mohammed",
      title: "Sigma 50mm f/1.4 Art",
      category: "Lenses",
      priceDay: "$50",
      priceWeek: "$260",
      rating: 4.8,
      reviews: 134,
      location: "Lusaka, Zambia",
      image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400&h=300&fit=crop",
      verified: true,
      condition: "Excellent"
    }
  ];

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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gearItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-medium transition-smooth">
                  {/* Clickable Image */}
                  <div 
                    className="aspect-video bg-muted relative cursor-pointer"
                    onClick={() => navigate(`/gear/${item.id}`)}
                  >
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
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
                      onClick={() => navigate(`/vendor/${item.id}`)}
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
            
            {/* Infinite Scroll Trigger */}
            {hasMore && (
              <div ref={loadMoreRef} className="text-center py-8">
                {isLoadingMore && (
                  <div className="text-muted-foreground">{t('gear.loadingMore')}</div>
                )}
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