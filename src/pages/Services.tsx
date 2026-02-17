import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, Calendar, DollarSign, Plus, Camera } from "lucide-react";
import { BookingDialog } from "@/components/booking/BookingDialog";
import { AddCategoryDialog } from "@/components/marketplace/AddCategoryDialog";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast"; 

interface ServiceItem {
  id: string;
  vendor: string;
  vendor_id: string | null;
  title: string;
  category: string;
  price: string;
  rating: number;
  reviews: number;
  location: string;
  image: string | null;
  verified: boolean;
  languages: string[];
  experience: string;
  specialties: string[];
}

const Services = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [bookingDialog, setBookingDialog] = useState<{ isOpen: boolean; service: any }>({
    isOpen: false,
    service: null
  });
  const [addCategoryDialog, setAddCategoryDialog] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allServices, setAllServices] = useState<ServiceItem[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  
  // Initialize from URL params
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "All Categories");
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || "");
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || "All Locations");
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || "rating");
  
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  // Fetch real services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select(`
            *,
            profiles:vendor_id (
              id,
              name,
              avatar_url,
              location,
              bio,
              profession
            )
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mapped: ServiceItem[] = (data || []).map((s: any) => ({
          id: s.id,
          vendor: s.profiles?.name || 'Photographer',
          vendor_id: s.vendor_id,
          title: s.title,
          category: s.category,
          price: `₦${Number(s.price).toLocaleString()}${s.duration ? '/' + s.duration : ''}`,
          rating: s.rating || 0,
          reviews: s.reviews_count || 0,
          location: s.profiles?.location || s.location || 'Nigeria',
          image: s.image_url,
          verified: true,
          languages: ['English'],
          experience: s.profiles?.profession || 'Photography',
          specialties: [s.category, s.subcategory].filter(Boolean) as string[]
        }));

        setAllServices(mapped);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);
  
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
            {loadingServices ? (
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
              {visibleServices.map((service) => (
                <Card key={service.id} className="overflow-hidden hover:shadow-medium transition-smooth">
                  {/* Clickable Image */}
                  <div 
                    className="aspect-video bg-muted cursor-pointer"
                    onClick={() => navigate(`/service/${service.id}`)}
                  >
                    {service.image ? (
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                        <Camera className="w-12 h-12 text-muted-foreground/50" />
                      </div>
                    )}
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
                      onClick={() => service.vendor_id ? navigate(`/vendor/${service.vendor_id}`) : navigate(`/service/${service.id}`)}
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
            
            )}

            {/* Infinite Scroll Trigger */}
            {!loadingServices && hasMore && (
              <div ref={loadMoreRef} className="text-center py-8">
                {isLoadingMore && (
                  <div className="text-muted-foreground">{t('services.loadingMore')}</div>
                )}
              </div>
            )}

            {/* No Results */}
            {!loadingServices && filteredServices.length === 0 && (
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