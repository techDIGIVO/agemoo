import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import weddingHero from "@/assets/wedding-collection.jpg";
import corporateHero from "@/assets/corporate-collection.jpg";
import portraitHero from "@/assets/portrait-collection.jpg";
import { Camera, MapPin, Star, Clock, ArrowLeft, TrendingUp, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookingDialog } from "@/components/booking/BookingDialog";

// Data sourced from Marketplace.tsx collections object
const COLLECTIONS_DATA: Record<string, any> = {
  wedding: {
    title: "Wedding Photography",
    description: "Capture your special day with our top-rated wedding photographers across Nigeria.",
    heroImage: weddingHero,
    price: "₦150,000",
    photographerCount: 28,
    photographers: [
      { name: "Amara Okafor", rating: 4.9, location: "Lagos", experience: "8 years", price: "₦180,000", specialties: ["Weddings", "Pre-wedding"], image: "AO" },
      { name: "Emeka Nwachukwu", rating: 4.8, location: "Abuja", experience: "6 years", price: "₦160,000", specialties: ["Weddings", "Events"], image: "EN" },
      { name: "Fatima Aliyu", rating: 4.9, location: "Kano", experience: "5 years", price: "₦150,000", specialties: ["Weddings", "Traditional"], image: "FA" },
      { name: "Blessing Okoro", rating: 4.7, location: "Port Harcourt", experience: "7 years", price: "₦170,000", specialties: ["Weddings", "Portrait"], image: "BO" }
    ]
  },
  corporate: {
    title: "Corporate Events",
    description: "Professional corporate event photography for conferences, seminars, and business gatherings.",
    heroImage: corporateHero,
    price: "₦80,000",
    photographerCount: 19,
    photographers: [
      { name: "Ahmed Musa", rating: 4.8, location: "Abuja", experience: "10 years", price: "₦95,000", specialties: ["Corporate", "Events"], image: "AM" },
      { name: "Chioma Adebayo", rating: 4.9, location: "Lagos", experience: "7 years", price: "₦85,000", specialties: ["Corporate", "Business"], image: "CA" },
      { name: "Yusuf Ibrahim", rating: 4.7, location: "Kaduna", experience: "6 years", price: "₦80,000", specialties: ["Corporate", "Professional"], image: "YI" },
      { name: "Grace Okonkwo", rating: 4.8, location: "Enugu", experience: "9 years", price: "₦90,000", specialties: ["Corporate", "Events"], image: "GO" }
    ]
  },
  portrait: {
    title: "Portrait Sessions",
    description: "Professional portrait photography for individuals, families, and personal branding.",
    heroImage: portraitHero,
    price: "₦45,000",
    photographerCount: 35,
    photographers: [
      { name: "Kemi Adebayo", rating: 4.8, location: "Lagos", experience: "5 years", price: "₦55,000", specialties: ["Portrait", "Fashion"], image: "KA" },
      { name: "David Okafor", rating: 4.9, location: "Abuja", experience: "8 years", price: "₦65,000", specialties: ["Portrait", "Commercial"], image: "DO" },
      { name: "Aisha Muhammad", rating: 4.7, location: "Kano", experience: "4 years", price: "₦45,000", specialties: ["Portrait", "Lifestyle"], image: "AM2" },
      { name: "Tunde Bakare", rating: 4.8, location: "Ibadan", experience: "6 years", price: "₦50,000", specialties: ["Portrait", "Creative"], image: "TB" }
    ]
  }
};

const CollectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const collection = id ? COLLECTIONS_DATA[id] : null;
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  // Helper to construct a mock service object for the booking dialog
const handleBookNow = (photographer: any) => {
  setSelectedService({
    id: `mock-${photographer.name.replace(/\s+/g, '-').toLowerCase()}`,
    title: `${collection.title} with ${photographer.name}`,
    price: photographer.price,
    vendor: photographer.name, // BookingDialog needs a 'vendor' name to display
    vendorId: "00000000-0000-0000-0000-000000000001", // Change vendor_id -> vendorId
    category: collection.title, // BookingDialog needs a category
    image_url: collection.heroImage,
    duration: "Standard Session"
  });
  setIsBookingOpen(true);
};

  if (!collection) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Collection Not Found</h2>
          <Button onClick={() => navigate("/marketplace")}>Back to Marketplace</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Full Page Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src={collection.heroImage} 
          alt={collection.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 container mx-auto px-4 text-center text-white">
          <Button 
            variant="link" 
            onClick={() => navigate("/marketplace")} 
            className="text-white hover:text-primary mb-6 p-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
          </Button>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Camera className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">{collection.title}</h1>
          </div>
          <p className="text-xl max-w-2xl mx-auto opacity-90">{collection.description}</p>
        </div>
      </section>

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="p-6 bg-muted/50 rounded-2xl text-center border">
              <div className="text-3xl font-bold text-primary">{collection.photographerCount}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Active Professionals</div>
            </div>
            <div className="p-6 bg-muted/50 rounded-2xl text-center border">
              <div className="text-3xl font-bold text-primary">{collection.price}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Starting Price</div>
            </div>
            <div className="p-6 bg-muted/50 rounded-2xl text-center border">
              <div className="text-3xl font-bold text-primary">4.8</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Average Rating</div>
            </div>
            <div className="p-6 bg-muted/50 rounded-2xl text-center border">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Verified Vendors</div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-primary" />
              Featured {collection.title} Experts
            </h2>
            <div className="flex items-center text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 mr-1 text-green-500" />
              Agemoo Verified Professional Guarantee
            </div>
          </div>

          {/* Professionals Grid - Full Width */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {collection.photographers.map((photographer: any, index: number) => (
              <Card key={index} className="p-6 shadow-md hover:shadow-xl transition-all duration-300 border-primary/5 group">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg group-hover:scale-105 transition-transform">
                    {photographer.image}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-bold">{photographer.name}</h4>
                        <div className="flex items-center space-x-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {photographer.location}</span>
                          <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {photographer.experience}</span>
                        </div>
                      </div>
                      <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center text-sm font-bold">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        {photographer.rating}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {photographer.specialties.map((specialty: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="px-3 py-0.5">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-xs text-muted-foreground block">Session from</span>
                        <span className="text-2xl font-bold text-primary">{photographer.price}</span>
                      </div>
                      <div className="space-x-3">
                        <Button 
                          variant="outline"
                          onClick={() => navigate(`/vendor/${photographer.name.toLowerCase().replace(' ', '-')}`)}
                        >
                          View Profile
                        </Button>
                        <Button onClick={() => handleBookNow(photographer)}>
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-16 bg-muted/30 p-10 rounded-3xl text-center border-2 border-dashed border-primary/20">
            <h3 className="text-2xl font-bold mb-4">Don't see what you're looking for?</h3>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Our marketplace has dozens of other professionals specialized in {collection.title.toLowerCase()} ready to bring your vision to life.
            </p>
            <Button size="lg" onClick={() => navigate(`/services?category=${collection.title}`)}>
              Browse All {collection.title} Services
            </Button>
          </div>
        </div>
      </main>

      <Footer />

      <BookingDialog 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        service={selectedService}
      />
    </div>
  );
};

export default CollectionDetail;