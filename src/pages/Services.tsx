import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, Calendar, DollarSign, Plus } from "lucide-react";
import { BookingDialog } from "@/components/booking/BookingDialog";
import { AddCategoryDialog } from "@/components/marketplace/AddCategoryDialog";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import beautyModel from "@/assets/beauty-model-girl-fashion-manicure-make-up-35653081.webp" 

const Services = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [bookingDialog, setBookingDialog] = useState<{ isOpen: boolean; service: any }>({
    isOpen: false,
    service: null
  });
  const [addCategoryDialog, setAddCategoryDialog] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Initialize from URL params
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "All Categories");
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || "All Locations");
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || "rating");
  
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  
  // Fetch custom categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('name')
        .eq('type', 'service')
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
    if (sortBy !== "rating") params.set('sort', sortBy);
    setSearchParams(params, { replace: true });
  }, [selectedCategory, searchTerm, selectedLocation, sortBy, setSearchParams]);

  const categories = [
    "All Categories",
    "Portrait Photography", 
    "Wedding Photography",
    "Event Photography",
    "Fashion Photography",
    "Product Photography",
    "Wildlife Photography",
    "Street Photography",
    "Video Production",
    "Photo Editing",
    ...customCategories
  ];

  const locations = [
    "All Locations",
    "Lagos, Nigeria",
    "Accra, Ghana", 
    "Nairobi, Kenya",
    "Cape Town, South Africa",
    "Cairo, Egypt",
    "Kigali, Rwanda",
    "Dar es Salaam, Tanzania",
    "Abuja, Nigeria",
    "Casablanca, Morocco"
  ];

  const allServices = [
    {
      id: 1,
      vendor: "Amara Johnson",
      title: "Creative Portrait Photography",
      category: "Portrait Photography",
      price: "₦45,000/session",
      rating: 4.9,
      reviews: 127,
      location: "Lagos, Nigeria",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=300&fit=crop",
      verified: true,
      languages: ["English", "Yoruba"],
      experience: "5+ years",
      specialties: ["Natural Light", "Studio Portraits", "Family Photos"]
    },
    {
      id: 2,
      vendor: "Zara Okafor",
      title: "Wedding & Event Photography",
      category: "Wedding Photography",
      price: "₦120,000/day",
      rating: 4.8,
      reviews: 89,
      location: "Abuja, Nigeria",
      image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=300&fit=crop",
      verified: true,
      languages: ["English", "Igbo"],
      experience: "7+ years",
      specialties: ["Traditional Weddings", "Modern Ceremonies", "Pre-wedding"]
    },
    {
      id: 3,
      vendor: "Kemi Adebayo",
      title: "Fashion & Beauty Photography",
      category: "Fashion Photography",
      price: "₦65,000/shoot",
      rating: 4.9,
      reviews: 203,
      location: "Lagos, Nigeria",
      image: beautyModel,
      verified: true,
      languages: ["English", "Yoruba"],
      experience: "4+ years",
      specialties: ["Editorial", "Commercial", "Beauty Shots"]
    },
    {
      id: 4,
      vendor: "Akosua Frimpong",
      title: "Documentary & Street Photography",
      category: "Street Photography",
      price: "₦55,000/day",
      rating: 4.7,
      reviews: 156,
      location: "Accra, Ghana",
      image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=400&h=300&fit=crop",
      verified: true,
      languages: ["English", "Twi"],
      experience: "6+ years",
      specialties: ["Cultural Events", "Street Life", "Documentaries"]
    },
    {
      id: 5,
      vendor: "Fatima Al-Hassan",
      title: "Professional Product Photography",
      category: "Product Photography",
      price: "₦35,000/session",
      rating: 4.8,
      reviews: 142,
      location: "Cairo, Egypt",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
      verified: true,
      languages: ["Arabic", "English", "French"],
      experience: "5+ years",
      specialties: ["E-commerce", "Luxury Goods", "Food Photography"]
    },
    {
      id: 6,
      vendor: "Grace Akinyi",
      title: "Wildlife & Nature Photography",
      category: "Wildlife Photography",
      price: "₦85,000/day",
      rating: 4.9,
      reviews: 98,
      location: "Nairobi, Kenya",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=300&fit=crop",
      verified: true,
      languages: ["English", "Swahili"],
      experience: "8+ years",
      specialties: ["Safari Photography", "Bird Watching", "Conservation"]
    },
    {
      id: 7,
      vendor: "Kwame Asante",
      title: "Corporate Event Photography",
      category: "Event Photography",
      price: "₦75,000/event",
      rating: 4.6,
      reviews: 134,
      location: "Accra, Ghana",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      verified: true,
      languages: ["English", "Twi"],
      experience: "6+ years",
      specialties: ["Corporate Events", "Conferences", "Team Building"]
    },
    {
      id: 8,
      vendor: "Nomsa Mbeki",
      title: "Cinematic Wedding Videography",
      category: "Video Production",
      price: "₦150,000/wedding",
      rating: 4.8,
      reviews: 87,
      location: "Cape Town, South Africa",
      image: "https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?w=400&h=300&fit=crop",
      verified: true,
      languages: ["English", "Afrikaans", "Xhosa"],
      experience: "5+ years",
      specialties: ["Wedding Films", "Love Stories", "Drone Footage"]
    },
    {
      id: 9,
      vendor: "Aishah Mwangi",
      title: "Children & Family Portraits",
      category: "Portrait Photography",
      price: "₦40,000/session",
      rating: 4.9,
      reviews: 176,
      location: "Nairobi, Kenya",
      image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop",
      verified: true,
      languages: ["English", "Swahili"],
      experience: "4+ years",
      specialties: ["Newborn Photography", "Family Sessions", "Children Portraits"]
    },
    {
      id: 10,
      vendor: "Blessing Adegoke",
      title: "Traditional & Cultural Photography",
      category: "Event Photography",
      price: "₦60,000/event",
      rating: 4.7,
      reviews: 112,
      location: "Lagos, Nigeria",
      image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=300&fit=crop",
      verified: true,
      languages: ["English", "Yoruba"],
      experience: "6+ years",
      specialties: ["Cultural Festivals", "Traditional Ceremonies", "Heritage Events"]
    },
    {
      id: 11,
      vendor: "Youssef Benali",
      title: "Architectural & Interior Photography",
      category: "Product Photography",
      price: "₦70,000/project",
      rating: 4.8,
      reviews: 95,
      location: "Casablanca, Morocco",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
      verified: true,
      languages: ["Arabic", "French", "English"],
      experience: "7+ years",
      specialties: ["Real Estate", "Interior Design", "Architecture"]
    },
    {
      id: 12,
      vendor: "Chiamaka Okwu",
      title: "Professional Photo Editing",
      category: "Photo Editing",
      price: "₦15,000/session",
      rating: 4.9,
      reviews: 234,
      location: "Lagos, Nigeria",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
      verified: true,
      languages: ["English", "Igbo"],
      experience: "5+ years",
      specialties: ["Color Grading", "Retouching", "Digital Art"]
    },
    {
      id: 13,
      vendor: "Abena Asante",
      title: "Maternity & Newborn Photography",
      category: "Portrait Photography",
      price: "₦50,000/session",
      rating: 4.8,
      reviews: 143,
      location: "Accra, Ghana",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      verified: true,
      languages: ["English", "Twi"],
      experience: "4+ years",
      specialties: ["Maternity Sessions", "Newborn Photography", "Pregnancy Journey"]
    },
    {
      id: 14,
      vendor: "Divine Uwimana",
      title: "Event & Conference Photography",
      category: "Event Photography",
      price: "₦55,000/day",
      rating: 4.7,
      reviews: 108,
      location: "Kigali, Rwanda",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=300&fit=crop",
      verified: true,
      languages: ["English", "French", "Kinyarwanda"],
      experience: "5+ years",
      specialties: ["Corporate Events", "Conferences", "Business Photography"]
    },
    {
      id: 15,
      vendor: "Amina Hassan",
      title: "Fashion & Commercial Photography",
      category: "Fashion Photography",
      price: "₦80,000/shoot",
      rating: 4.9,
      reviews: 167,
      location: "Dar es Salaam, Tanzania",
      image: "https://images.unsplash.com/photo-1488998527040-85054a85150e?w=400&h=300&fit=crop",
      verified: true,
      languages: ["English", "Swahili"],
      experience: "6+ years",
      specialties: ["Fashion Editorial", "Commercial", "Brand Photography"]
    },
    {
      id: 16,
      vendor: "Sekai Moyo",
      title: "Music & Entertainment Photography",
      category: "Event Photography",
      price: "₦65,000/event",
      rating: 4.8,
      reviews: 124,
      location: "Cape Town, South Africa",
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop",
      verified: true,
      languages: ["English", "Shona"],
      experience: "5+ years",
      specialties: ["Concert Photography", "Music Videos", "Entertainment Events"]
    }
  ];

  // Filter services based on search and category
  const filteredServices = allServices.filter(service => {
    const matchesSearch = service.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All Categories" || service.category === selectedCategory;
    const matchesLocation = selectedLocation === "All Locations" || service.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const visibleServices = filteredServices.slice(0, visibleCount);
  const hasMore = visibleCount < filteredServices.length;

  const loadMore = () => {
    setIsLoadingMore(true);
    // Simulate loading delay
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        {/* Hero Section */}
        <section className="py-12 hero-gradient">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t('services.title')}
              </h1>
              <p className="text-xl text-muted-foreground">
                {t('services.heroDescription')}
              </p>
              <div className="mt-6">
                <Badge className="mr-2 bg-green-100 text-green-800">
                  {filteredServices.length} {t('services.photographersAvailable')}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">
                  {t('services.across')} {locations.length - 1} {t('services.majorCities')}
                </Badge>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <Card className="p-6 shadow-medium">
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder={t('services.searchPlaceholder')} 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder={t('services.categoryLabel')} />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg z-50">
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat === "All Categories" ? t('services.allCategories') : cat}</SelectItem>
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
                          {t('services.addCustomCategory')}
                        </Button>
                      </SelectContent>
                    </Select>
                    {selectedCategory !== "All Categories" && (
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
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder={t('services.locationLabel')} />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>{location === "All Locations" ? t('services.allLocations') : location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button className="font-medium">
                    {t('common.search')} ({filteredServices.length})
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleServices.map((service) => (
                <Card key={service.id} className="overflow-hidden hover:shadow-medium transition-smooth">
                  {/* Clickable Image */}
                  <div 
                    className="aspect-video bg-muted cursor-pointer"
                    onClick={() => navigate(`/service/${service.id}`)}
                  >
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      {/* Clickable Category Badge */}
                      <Badge 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-secondary/80"
                        onClick={() => {
                          setSelectedCategory(service.category);
                          setVisibleCount(6);
                        }}
                      >
                        {service.category}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        {service.verified && (
                          <Badge className="bg-green-100 text-green-800 text-xs">{t('services.verified')}</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {service.experience}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Clickable Title */}
                    <h3 
                      className="text-lg font-semibold mb-1 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => navigate(`/service/${service.id}`)}
                    >
                      {service.title}
                    </h3>
                    
                    {/* Clickable Vendor Name */}
                    <p 
                      className="text-muted-foreground mb-2 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => navigate(`/vendor/service-${service.id}`)}
                    >
                      {t('services.by')} {service.vendor}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{service.rating}</span>
                        <span>({service.reviews})</span>
                      </div>
                      
                      {/* Clickable Location */}
                      <div 
                        className="flex items-center space-x-1 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => {
                          setSelectedLocation(service.location);
                          setVisibleCount(6);
                        }}
                      >
                        <MapPin className="w-4 h-4" />
                        <span>{service.location}</span>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {service.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {service.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{service.specialties.length - 2} {t('services.more')}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground">
                        {t('services.languages')}: {service.languages.join(", ")}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold text-primary">
                        {service.price}
                      </div>
                      <Button onClick={() => setBookingDialog({ isOpen: true, service })}>
                        {t('common.bookNow')}
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
                  <div className="text-muted-foreground">{t('services.loadingMore')}</div>
                )}
              </div>
            )}

            {/* No Results */}
            {filteredServices.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('services.noResultsTitle')}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('services.noResultsDesc')}
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All Categories");
                    setSelectedLocation("All Locations");
                  }}
                >
                  {t('services.clearFilters')}
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      
      {bookingDialog.service && (
        <BookingDialog
          isOpen={bookingDialog.isOpen}
          onClose={() => setBookingDialog({ isOpen: false, service: null })}
          service={bookingDialog.service}
        />
      )}
      
      <AddCategoryDialog
        isOpen={addCategoryDialog}
        onClose={() => setAddCategoryDialog(false)}
        onCategoryAdded={(category) => {
          setCustomCategories(prev => [...prev, category]);
          setSelectedCategory(category);
        }}
        type="service"
      />
    </div>
  );
};

export default Services;