import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Briefcase, TrendingUp, Users, ArrowRight, CheckCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VendorSignupDialog } from "@/components/marketplace/VendorSignupDialog";
import { CollectionDialog } from "@/components/marketplace/CollectionDialog";
import { StudioDetailsDialog } from "@/components/marketplace/StudioDetailsDialog";
import { ProfileDetailsDialog } from "@/components/marketplace/ProfileDetailsDialog";
import { BookingDialog } from "@/components/booking/BookingDialog";
import { GearDetailsDialog } from "@/components/gear/GearDetailsDialog";
import marketplaceHero from "@/assets/marketplace-hero.jpg";
import vendorPhotographer from "@/assets/vendor-photographer.jpg";
import weddingCollection from "@/assets/wedding-collection.jpg";
import corporateCollection from "@/assets/corporate-collection.jpg";
import portraitCollection from "@/assets/portrait-collection.jpg";

const Marketplace = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [vendorDialog, setVendorDialog] = useState(false);
  const [realPhotographers, setRealPhotographers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [collectionDialog, setCollectionDialog] = useState<{
    isOpen: boolean;
    collection: any;
  }>({ isOpen: false, collection: null });
  const [studioDialog, setStudioDialog] = useState<{
    isOpen: boolean;
    studio: any;
  }>({ isOpen: false, studio: null });
  const [profileDialog, setProfileDialog] = useState<{
    isOpen: boolean;
    photographer: any;
  }>({ isOpen: false, photographer: null });
  const [bookingDialog, setBookingDialog] = useState<{
    isOpen: boolean;
    service: any;
  }>({ isOpen: false, service: null });
  const [gearDialog, setGearDialog] = useState<{
    isOpen: boolean;
    gear: any;
  }>({ isOpen: false, gear: null });

  useEffect(() => {
    fetchRealPhotographers();
  }, []);

  const fetchRealPhotographers = async () => {
    try {
      // Fetch services with profiles
      const { data: services, error } = await supabase
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

      // Group services by vendor
      const vendorMap = new Map();
      services?.forEach((service: any) => {
        if (service.profiles) {
          const vendorId = service.profiles.id;
          if (!vendorMap.has(vendorId)) {
            vendorMap.set(vendorId, {
              vendorId: vendorId,
              name: service.profiles.name || 'Anonymous',
              specialty: service.profiles.profession || service.category || 'Photography',
              rating: service.rating || 4.5,
              price: `₦${service.price.toLocaleString()}`,
              image: service.profiles.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'AN',
              location: service.profiles.location || service.location || 'Nigeria',
              experience: '3+ years experience',
              services: []
            });
          }
          vendorMap.get(vendorId).services.push(service);
        }
      });

      setRealPhotographers(Array.from(vendorMap.values()));
    } catch (error) {
      console.error('Error fetching photographers:', error);
    } finally {
      setLoading(false);
    }
  };

  const photographerData = {
    "Amara Okafor": {
      name: "Amara Okafor",
      specialty: "Wedding Photography",
      rating: 4.9,
      price: "₦180,000",
      image: "AO",
      location: "Lagos",
      experience: "8 years experience",
      bio: "I'm Amara, a passionate wedding photographer with over 8 years of experience capturing love stories across Nigeria. My approach combines photojournalistic storytelling with artistic portraiture to create timeless memories. I believe every couple has a unique story to tell, and I'm here to help you tell yours through beautiful, authentic imagery.",
      languages: ["English", "Igbo", "Yoruba"],
      equipment: ["Canon EOS R5", "85mm f/1.4 Lens", "24-70mm f/2.8", "Profoto B1X", "DJI Mavic Pro"],
      achievements: [
        "Wedding Photographer of the Year 2023 - Lagos Wedding Awards",
        "Featured in Bella Naija Weddings Top 50",
        "Certified Professional Photographer (CPP)",
        "Published in Wedding Digest Magazine"
      ],
      services: [
        { name: "Full Wedding Coverage", price: "₦180,000", duration: "10-12 hours", description: "Complete wedding day photography from getting ready to reception" },
        { name: "Pre-wedding Session", price: "₦85,000", duration: "3 hours", description: "Romantic engagement shoot at beautiful locations" },
        { name: "Traditional Wedding", price: "₦120,000", duration: "6-8 hours", description: "Cultural ceremony photography with traditional elements" },
        { name: "Wedding Album Design", price: "₦45,000", duration: "2 weeks", description: "Custom designed wedding album with premium materials" }
      ],
      packages: [
        {
          name: "Essential Package",
          price: "₦150,000",
          features: ["6 hours coverage", "200+ edited photos", "Online gallery", "USB delivery"]
        },
        {
          name: "Premium Package",
          price: "₦220,000",
          popular: true,
          features: ["10 hours coverage", "500+ edited photos", "Engagement session", "Wedding album", "USB + online gallery"]
        },
        {
          name: "Luxury Package",
          price: "₦350,000",
          features: ["12 hours coverage", "800+ edited photos", "2 photographers", "Videography", "Premium album", "Canvas prints"]
        }
      ],
      portfolio: [
        { title: "Romantic Garden Wedding", category: "Wedding", client: "Kemi & Tolu" },
        { title: "Traditional Igbo Ceremony", category: "Cultural", client: "Chioma & Emeka" },
        { title: "Lagos Sunset Engagement", category: "Engagement", client: "Blessing & David" },
        { title: "Beach Wedding Ceremony", category: "Destination", client: "Funmi & James" }
      ],
      reviews: [
        { client: "Kemi & Tolu", rating: 5, comment: "Amara captured our wedding day perfectly! She was professional, creative, and made us feel so comfortable. The photos are absolutely stunning!", date: "2 weeks ago", verified: true },
        { client: "Chioma & Emeka", rating: 5, comment: "Outstanding work! Amara understood our cultural requirements and delivered beyond expectations. Highly recommended!", date: "1 month ago", verified: true },
        { client: "Blessing & David", rating: 4, comment: "Beautiful engagement photos! Amara's artistic eye is incredible. Can't wait to book her for our wedding.", date: "3 weeks ago", verified: true }
      ],
      stats: {
        totalProjects: 127,
        responseTime: "2 hours",
        rebookingRate: "85%",
        completionRate: "98%"
      },
      contact: {
        email: "amara@weddings.ng",
        phone: "+234 901 234 5678",
        website: "www.amaraokafor.ng",
        instagram: "@amaraweddings"
      },
      availability: "Available weekends"
    },
    "Kemi Adebayo": {
      name: "Kemi Adebayo",
      specialty: "Portrait Photography",
      rating: 4.8,
      price: "₦75,000",
      image: "KA",
      location: "Abuja",
      experience: "5 years experience",
      bio: "I'm Kemi, a portrait photographer specializing in capturing the essence of individuals and families. My style focuses on natural lighting and authentic expressions to create portraits that tell your unique story. Whether it's professional headshots, family portraits, or personal branding photography, I'm here to help you shine.",
      languages: ["English", "Hausa", "French"],
      equipment: ["Sony A7R IV", "50mm f/1.2 Lens", "35mm f/1.4", "Godox AD600Pro", "Reflectors & Diffusers"],
      achievements: [
        "Portrait Photographer of the Year 2022 - Abuja Photography Guild",
        "Featured in Professional Photography Magazine",
        "Certified Portrait Specialist",
        "Corporate headshot specialist certification"
      ],
      services: [
        { name: "Professional Headshots", price: "₦45,000", duration: "1 hour", description: "Corporate headshots for LinkedIn and business use" },
        { name: "Family Portrait Session", price: "₦75,000", duration: "2 hours", description: "Beautiful family portraits in studio or outdoor locations" },
        { name: "Personal Branding", price: "₦95,000", duration: "3 hours", description: "Complete branding session for entrepreneurs and creatives" },
        { name: "Maternity Photography", price: "₦65,000", duration: "2 hours", description: "Elegant maternity portraits celebrating motherhood" }
      ],
      packages: [
        {
          name: "Basic Portrait",
          price: "₦55,000",
          features: ["1 hour session", "15 edited photos", "High-res digital files", "Online gallery"]
        },
        {
          name: "Professional Package",
          price: "₦85,000",
          popular: true,
          features: ["2 hour session", "30 edited photos", "Multiple outfit changes", "Print release", "USB delivery"]
        },
        {
          name: "Complete Branding",
          price: "₦120,000",
          features: ["3 hour session", "50+ edited photos", "Multiple locations", "Professional styling tips", "Social media kit"]
        }
      ],
      portfolio: [
        { title: "CEO Executive Portraits", category: "Corporate", client: "Tech Startup Lagos" },
        { title: "Family Heritage Session", category: "Family", client: "The Adebayo Family" },
        { title: "Personal Branding Series", category: "Branding", client: "Fashion Designer" },
        { title: "Newborn Family Session", category: "Lifestyle", client: "New Parents" }
      ],
      reviews: [
        { client: "Sarah Johnson", rating: 5, comment: "Kemi made my headshot session so comfortable and fun. The results exceeded my expectations - professional yet approachable!", date: "1 week ago", verified: true },
        { client: "The Adebayo Family", rating: 5, comment: "Amazing family session! Kemi captured our personalities perfectly. The kids loved working with her.", date: "2 weeks ago", verified: true },
        { client: "Business Executive", rating: 4, comment: "Professional service and great attention to detail. My LinkedIn profile has never looked better!", date: "1 month ago", verified: true }
      ],
      stats: {
        totalProjects: 89,
        responseTime: "1 hour",
        rebookingRate: "78%",
        completionRate: "100%"
      },
      contact: {
        email: "kemi@portraits.ng",
        phone: "+234 902 345 6789",
        instagram: "@kemiportraits"
      },
      availability: "Available weekdays"
    },
    "Tunde Bakare": {
      name: "Tunde Bakare",
      specialty: "Event Photography",
      rating: 4.9,
      price: "₦120,000",
      image: "TB",
      location: "Lagos",
      experience: "6 years experience",
      bio: "I'm Tunde, an event photographer passionate about capturing the energy and emotions of special occasions. From corporate conferences to birthday celebrations, I document every important moment with a keen eye for detail and storytelling. My goal is to help you relive your event through powerful imagery.",
      languages: ["English", "Yoruba"],
      equipment: ["Canon 5D Mark IV", "24-70mm f/2.8", "70-200mm f/2.8", "Flash system", "Backup equipment"],
      achievements: [
        "Event Photographer of the Year 2023 - Nigeria Photography Awards",
        "Certified in Corporate Event Photography",
        "Featured event photographer for major brands",
        "Over 200 successful events documented"
      ],
      services: [
        { name: "Corporate Events", price: "₦120,000", duration: "6-8 hours", description: "Professional coverage of conferences, seminars, and corporate gatherings" },
        { name: "Birthday Celebrations", price: "₦85,000", duration: "4 hours", description: "Fun and memorable birthday party photography" },
        { name: "Product Launches", price: "₦150,000", duration: "5 hours", description: "Brand event photography with promotional focus" },
        { name: "Social Gatherings", price: "₦95,000", duration: "4-6 hours", description: "Parties, reunions, and social events coverage" }
      ],
      packages: [
        {
          name: "Standard Coverage",
          price: "₦100,000",
          features: ["4 hours coverage", "200+ edited photos", "Same day highlights", "Online gallery"]
        },
        {
          name: "Premium Coverage",
          price: "₦140,000",
          popular: true,
          features: ["6 hours coverage", "400+ edited photos", "Multiple photographers", "Live social sharing", "USB delivery"]
        },
        {
          name: "Complete Documentation",
          price: "₦200,000",
          features: ["8 hours coverage", "600+ edited photos", "Video highlights", "Professional editing", "Print package"]
        }
      ],
      portfolio: [
        { title: "Tech Conference 2023", category: "Corporate", client: "TechLagos" },
        { title: "50th Birthday Celebration", category: "Social", client: "Private Client" },
        { title: "Product Launch Event", category: "Commercial", client: "Fashion Brand" },
        { title: "Charity Gala Dinner", category: "Formal", client: "NGO Lagos" }
      ],
      reviews: [
        { client: "TechLagos", rating: 5, comment: "Tunde captured our conference perfectly! Professional, unobtrusive, and delivered excellent results on time.", date: "1 week ago", verified: true },
        { client: "Birthday Client", rating: 5, comment: "Amazing work at my father's 50th! Tunde caught all the special moments we'll treasure forever.", date: "2 weeks ago", verified: true },
        { client: "Corporate Client", rating: 4, comment: "Great event coverage. Tunde was professional and the photos showcase our brand beautifully.", date: "3 weeks ago", verified: true }
      ],
      stats: {
        totalProjects: 156,
        responseTime: "3 hours",
        rebookingRate: "82%",
        completionRate: "97%"
      },
      contact: {
        email: "tunde@events.ng",
        phone: "+234 903 456 7890",
        website: "www.tundebakare.ng",
        instagram: "@tundeevents"
      },
      availability: "Flexible schedule"
    },
    "Fatima Aliyu": {
      name: "Fatima Aliyu",
      specialty: "Fashion Photography",
      rating: 4.7,
      price: "₦95,000",
      image: "FA",
      location: "Kano",
      experience: "4 years experience",
      bio: "I'm Fatima, a fashion photographer with a passion for creating stunning visual narratives in the fashion industry. My work spans from editorial shoots to brand campaigns, always focusing on bringing out the best in both the clothing and the model. I love experimenting with lighting and composition to create images that speak to the viewer.",
      languages: ["English", "Hausa", "Arabic"],
      equipment: ["Fujifilm X-T4", "50mm f/1.0 Lens", "23mm f/1.4", "Studio lighting kit", "Fashion accessories"],
      achievements: [
        "Rising Fashion Photographer 2022 - Nigeria Fashion Week",
        "Featured in Vogue Nigeria online",
        "Brand campaign photographer for major fashion houses",
        "Fashion photography certification from New York Institute"
      ],
      services: [
        { name: "Fashion Editorial", price: "₦120,000", duration: "4 hours", description: "High-end editorial shoots for magazines and portfolios" },
        { name: "Brand Campaign", price: "₦150,000", duration: "6 hours", description: "Commercial fashion photography for brand marketing" },
        { name: "Model Portfolio", price: "₦75,000", duration: "3 hours", description: "Professional portfolio shoots for aspiring models" },
        { name: "Lookbook Creation", price: "₦95,000", duration: "4 hours", description: "Fashion lookbooks for designers and brands" }
      ],
      packages: [
        {
          name: "Emerging Model",
          price: "₦65,000",
          features: ["2 hour session", "20 edited photos", "Multiple looks", "Digital portfolio"]
        },
        {
          name: "Professional Portfolio",
          price: "₦95,000",
          popular: true,
          features: ["4 hour session", "40 edited photos", "Styling consultation", "Print + digital delivery"]
        },
        {
          name: "Brand Campaign",
          price: "₦180,000",
          features: ["6 hour session", "60+ edited photos", "Multiple locations", "Commercial usage rights", "Video content"]
        }
      ],
      portfolio: [
        { title: "Northern Beauty Editorial", category: "Editorial", client: "Fashion Magazine" },
        { title: "Ankara Brand Campaign", category: "Commercial", client: "Fashion Designer" },
        { title: "Model Portfolio Session", category: "Portfolio", client: "Aspiring Model" },
        { title: "Traditional Meets Modern", category: "Creative", client: "Cultural Brand" }
      ],
      reviews: [
        { client: "Fashion Designer", rating: 5, comment: "Fatima brought my vision to life! Her understanding of fashion and lighting is exceptional. Highly recommend!", date: "1 week ago", verified: true },
        { client: "Aspiring Model", rating: 4, comment: "Great portfolio session! Fatima made me feel confident and the results speak for themselves.", date: "2 weeks ago", verified: true },
        { client: "Brand Manager", rating: 5, comment: "Professional service and stunning results. Our brand campaign exceeded expectations thanks to Fatima's work.", date: "1 month ago", verified: true }
      ],
      stats: {
        totalProjects: 94,
        responseTime: "4 hours",
        rebookingRate: "76%",
        completionRate: "95%"
      },
      contact: {
        email: "fatima@fashion.ng",
        phone: "+234 904 567 8901",
        instagram: "@fatimafashion"
      },
      availability: "Available by appointment"
    }
  };

  const studioData = {
    "PixelPerfect Studios": {
      name: "PixelPerfect Studios",
      owner: "Chioma Nwachukwu",
      specialties: ["Wedding", "Portrait", "Event"],
      rating: 4.9,
      projects: 127,
      location: "Lagos, Nigeria",
      image: "PS",
      description: "PixelPerfect Studios is a premier photography studio specializing in capturing life's most precious moments. With over 8 years of experience, we combine artistic vision with technical excellence to deliver stunning visual stories. Our team is passionate about creating images that not only document events but also evoke emotions and preserve memories for generations to come.",
      experience: "8 years",
      startingPrice: "₦120,000",
      equipment: ["Canon EOS R5", "Sony A7R IV", "Profoto B1X", "85mm f/1.4 Lens", "24-70mm f/2.8 Lens", "Godox AD600Pro"],
      services: [
        { name: "Wedding Photography", price: "₦180,000", duration: "8-10 hours", description: "Complete wedding day coverage with pre-wedding consultation and edited gallery" },
        { name: "Portrait Session", price: "₦65,000", duration: "2 hours", description: "Professional portrait session with wardrobe changes and retouched images" },
        { name: "Event Coverage", price: "₦95,000", duration: "4-6 hours", description: "Corporate or social event photography with same-day previews" },
        { name: "Engagement Shoot", price: "₦85,000", duration: "3 hours", description: "Romantic couple session in beautiful locations with edited gallery" }
      ],
      portfolio: [
        { title: "Modern Wedding at Four Points", category: "Wedding", image: "wedding1" },
        { title: "Lagos Corporate Gala", category: "Event", image: "event1" },
        { title: "CEO Portrait Series", category: "Portrait", image: "portrait1" },
        { title: "Traditional Wedding Ceremony", category: "Wedding", image: "wedding2" },
        { title: "Family Portrait Session", category: "Portrait", image: "family1" },
        { title: "Product Launch Event", category: "Corporate", image: "corporate1" }
      ],
      reviews: [
        { client: "Adaora & Kemi", rating: 5, comment: "Chioma captured our wedding day perfectly! Every emotion, every detail was beautifully documented. We couldn't be happier with the results.", date: "2 weeks ago" },
        { client: "MTN Nigeria", rating: 5, comment: "Professional, creative, and delivered beyond expectations. The corporate event photos were outstanding.", date: "1 month ago" },
        { client: "Sarah Okafor", rating: 4, comment: "Great experience during the portrait session. Chioma made me feel comfortable and the photos turned out amazing!", date: "3 weeks ago" }
      ],
      contact: {
        email: "hello@pixelperfectstudios.ng",
        phone: "+234 901 234 5678",
        website: "www.pixelperfectstudios.ng",
        instagram: "@pixelperfectstudios"
      },
      availability: "Available weekends"
    },
    "Urban Lens Co.": {
      name: "Urban Lens Co.",
      owner: "Ahmed Musa",
      specialties: ["Street", "Fashion", "Documentary"],
      rating: 4.8,
      projects: 89,
      location: "Abuja, Nigeria",
      image: "UL",
      description: "Urban Lens Co. specializes in contemporary photography that captures the pulse of modern Nigerian life. From street photography to high-fashion shoots, we tell authentic stories through powerful imagery. Our documentary approach combined with fashion-forward styling creates unique visual narratives.",
      experience: "6 years",
      startingPrice: "₦85,000",
      equipment: ["Fujifilm X-T4", "Canon 5D Mark IV", "35mm f/1.4 Lens", "50mm f/1.2 Lens", "Portable LED Panels"],
      services: [
        { name: "Fashion Photography", price: "₦120,000", duration: "4 hours", description: "High-end fashion shoot with styling consultation and retouched images" },
        { name: "Street Photography Session", price: "₦75,000", duration: "3 hours", description: "Authentic street-style photography in urban locations" },
        { name: "Documentary Project", price: "₦150,000", duration: "Full day", description: "Complete documentary coverage of events or stories" },
        { name: "Commercial Shoot", price: "₦200,000", duration: "6 hours", description: "Brand and commercial photography for businesses" }
      ],
      portfolio: [
        { title: "Lagos Street Style", category: "Street", image: "street1" },
        { title: "Fashion Week Coverage", category: "Fashion", image: "fashion1" },
        { title: "Urban Youth Documentary", category: "Documentary", image: "doc1" },
        { title: "Brand Campaign Shoot", category: "Commercial", image: "commercial1" },
        { title: "Abuja Night Life", category: "Street", image: "street2" },
        { title: "Designer Showcase", category: "Fashion", image: "fashion2" }
      ],
      reviews: [
        { client: "Fashion Brand XYZ", rating: 5, comment: "Ahmed's artistic vision brought our brand campaign to life. The images exceeded our expectations!", date: "1 week ago" },
        { client: "Documentary Client", rating: 5, comment: "Incredible storytelling through photography. Ahmed captured the essence of our community project beautifully.", date: "2 months ago" },
        { client: "Individual Client", rating: 4, comment: "Great street-style session! Ahmed made the whole experience fun and the photos are amazing.", date: "3 weeks ago" }
      ],
      contact: {
        email: "contact@urbanlensco.ng",
        phone: "+234 902 345 6789",
        website: "www.urbanlensco.ng",
        instagram: "@urbanlensco"
      },
      availability: "Flexible schedule"
    }
    // Add more studio data as needed...
  };

  const collections = {
    wedding: {
      title: "Wedding Photography",
      description: "Capture your special day with our top-rated wedding photographers across Nigeria",
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
      description: "Professional corporate event photography for conferences, seminars, and business gatherings",
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
      description: "Professional portrait photography for individuals, families, and personal branding",
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section with Full Image */}
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${marketplaceHero})` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              {t('marketplace.heroTitle')} <span className="text-gradient">{t('marketplace.heroTitleHighlight')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              {t('marketplace.heroDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate("/services")}
              >
                {t('marketplace.exploreServices')}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={() => navigate("/gear")}
              >
                {t('marketplace.browseGear')}
              </Button>
            </div>
          </div>
        </section>

        {/* Vendor Signup Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image Side */}
              <div className="relative">
                <img 
                  src={vendorPhotographer} 
                  alt="Professional photographer using BOP 3.0 platform"
                  className="rounded-2xl shadow-2xl w-full h-[600px] object-cover"
                />
                <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold">₦2.5M+</div>
                    <div className="text-sm opacity-90">{t('marketplace.earnedByVendors')}</div>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold mb-4">
                    {t('marketplace.joinPlatform')} <span className="text-gradient">{t('marketplace.photographyPlatform')}</span>
                  </h2>
                  <p className="text-xl text-muted-foreground mb-6">
                    {t('marketplace.vendorDescription')}
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    t('marketplace.featuresList.featured'),
                    t('marketplace.featuresList.bookingTools'),
                    t('marketplace.featuresList.securePayment'),
                    t('marketplace.featuresList.profileManagement'),
                    t('marketplace.featuresList.support'),
                    t('marketplace.featuresList.marketing')
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-6 h-6 text-primary" />
                      <span className="text-lg">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-6 w-full sm:w-auto"
                    onClick={() => navigate("/vendor-registration")}
                  >
                    {t('marketplace.startVendorJourney')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    {t('marketplace.joinPhotographers')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Marketplace Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="featured" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="featured">{t('marketplace.featured')}</TabsTrigger>
                <TabsTrigger value="services">{t('marketplace.topServices')}</TabsTrigger>
                <TabsTrigger value="gear">{t('marketplace.popularGear')}</TabsTrigger>
                <TabsTrigger value="vendors">{t('marketplace.topVendors')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="featured" className="mt-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  <Card className="p-6 shadow-soft">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{t('marketplace.trendingThisWeek')}</h3>
                      <p className="text-muted-foreground mb-4">{t('marketplace.trendingDesc')}</p>
                      <Button variant="outline" onClick={() => navigate("/services")}>
                        {t('marketplace.exploreTrend')}
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-6 shadow-soft">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="w-8 h-8 text-secondary-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{t('marketplace.newGearArrivals')}</h3>
                      <p className="text-muted-foreground mb-4">{t('marketplace.newGearDesc')}</p>
                      <Button variant="outline" onClick={() => navigate("/gear")}>
                        {t('marketplace.viewNewGear')}
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-6 shadow-soft">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-accent-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{t('marketplace.featuredVendors')}</h3>
                      <p className="text-muted-foreground mb-4">{t('marketplace.featuredVendorsDesc')}</p>
                      <Button variant="outline" onClick={() => navigate("/services")}>
                        {t('marketplace.meetExperts')}
                      </Button>
                    </div>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">450+</div>
                    <div className="text-sm text-muted-foreground">{t('marketplace.activePhotographers')}</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">2.8k</div>
                    <div className="text-sm text-muted-foreground">{t('marketplace.bookingsThisMonth')}</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">98%</div>
                    <div className="text-sm text-muted-foreground">{t('marketplace.satisfactionRate')}</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">₦12M</div>
                    <div className="text-sm text-muted-foreground">{t('marketplace.totalEarned')}</div>
                  </div>
                </div>

                {/* Featured Collections */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">{t('marketplace.featuredCollections')}</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                        <div className="aspect-video rounded-t-lg overflow-hidden">
                          <img 
                            src={weddingCollection} 
                            alt="Wedding Photography Collection"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold mb-2">Wedding Photography</h4>
                          <p className="text-sm text-muted-foreground mb-3">From ₦150,000 • 28 photographers</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => navigate("/collection/wedding")}
                          >
                            {t('marketplace.browseCollection')}
                          </Button>
                        </div>
                      </Card>
                      
                      <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                        <div className="aspect-video rounded-t-lg overflow-hidden">
                          <img 
                            src={corporateCollection} 
                            alt="Corporate Events Collection"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold mb-2">Corporate Events</h4>
                          <p className="text-sm text-muted-foreground mb-3">From ₦80,000 • 19 photographers</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => navigate("/collection/corporate")}
                          >
                            {t('marketplace.browseCollection')}
                          </Button>
                        </div>
                      </Card>
                      
                      <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                        <div className="aspect-video rounded-t-lg overflow-hidden">
                          <img 
                            src={portraitCollection} 
                            alt="Portrait Sessions Collection"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold mb-2">Portrait Sessions</h4>
                          <p className="text-sm text-muted-foreground mb-3">From ₦45,000 • 35 photographers</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => navigate("/collection/portrait")}
                          >
                            {t('marketplace.browseCollection')}
                          </Button>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="services" className="mt-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold">{t('marketplace.topServicesMonth')}</h3>
                    <Button variant="outline" onClick={() => navigate("/services")}>{t('marketplace.viewAll')}</Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {loading ? (
                      <div className="col-span-2 text-center py-12">
                        <p className="text-muted-foreground">{t('marketplace.loadingPhotographers')}</p>
                      </div>
                    ) : realPhotographers.length === 0 ? (
                      <div className="col-span-2 text-center py-12">
                        <p className="text-muted-foreground">{t('marketplace.noPhotographers')}</p>
                      </div>
                    ) : (
                      realPhotographers.map((photographer, index) => (
                        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start space-x-4">
                          <div 
                            className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold cursor-pointer hover:opacity-80"
                            onClick={() => navigate(`/vendor/${photographer.vendorId}`)}
                          >
                            {photographer.image}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 
                                className="font-semibold cursor-pointer hover:text-primary"
                                onClick={() => navigate(`/vendor/${photographer.vendorId}`)}
                              >
                                {photographer.name}
                              </h4>
                              <Badge variant="secondary">{t('marketplace.topRated')}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              <span 
                                className="cursor-pointer hover:underline"
                                onClick={() => navigate(`/services?category=${photographer.specialty}`)}
                              >
                                {photographer.specialty}
                              </span>
                              {" • "}
                              <span 
                                className="cursor-pointer hover:underline"
                                onClick={() => navigate(`/services?location=${photographer.location}`)}
                              >
                                {photographer.location}
                              </span>
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className="text-yellow-400">★</span>
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">{photographer.rating}</span>
                              </div>
                              <div className="text-lg font-semibold text-primary">{photographer.price}</div>
                            </div>
                            <div className="flex space-x-2 mt-3">
                              <Button 
                                className="flex-1" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/vendor/${photographer.vendorId}`);
                                }}
                              >
                                {t('marketplace.viewProfile')}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBookingDialog({ 
                                    isOpen: true, 
                                    service: { name: photographer.name, price: photographer.price } 
                                  });
                                }}
                              >
                                {t('common.bookNow')}
                              </Button>
                            </div>
                          </div>
                        </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="gear" className="mt-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold">{t('marketplace.popularGearRentals')}</h3>
                    <Button variant="outline" onClick={() => navigate("/gear")}>{t('marketplace.viewAll')}</Button>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { name: "Canon EOS R5", type: "Camera", price: "₦25,000/day", availability: "Available", rating: 4.8, slug: "canon-eos-r5" },
                      { name: "Sony A7 IV", type: "Camera", price: "₦22,000/day", availability: "2 left", rating: 4.9, slug: "sony-a7-iv" },
                      { name: "Godox AD600Pro", type: "Lighting", price: "₦12,000/day", availability: "Available", rating: 4.7, slug: "godox-ad600pro" },
                      { name: "DJI Ronin-S", type: "Gimbal", price: "₦15,000/day", availability: "Available", rating: 4.6, slug: "dji-ronin-s" },
                      { name: "85mm f/1.4 Lens", type: "Lens", price: "₦8,000/day", availability: "1 left", rating: 4.8, slug: "85mm-f1-4-lens" },
                      { name: "Profoto B10", type: "Lighting", price: "₦18,000/day", availability: "Available", rating: 4.9, slug: "profoto-b10" }
                    ].map((gear, index) => (
                      <Card 
                        key={index} 
                        className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => navigate(`/gear/${gear.slug}`)}
                      >
                        <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                          <Camera className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm hover:text-primary">{gear.name}</h4>
                            <Badge variant={gear.availability === "Available" ? "default" : "secondary"} className="text-xs">
                              {gear.availability === "Available" ? t('gear.available') : gear.availability}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{gear.type}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-primary">{gear.price}</span>
                            <div className="flex items-center">
                              <span className="text-yellow-400 text-sm">★</span>
                              <span className="text-xs text-muted-foreground ml-1">{gear.rating}</span>
                            </div>
                          </div>
                          <Button 
                            className="w-full" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setGearDialog({ isOpen: true, gear });
                            }}
                          >
                            {t('marketplace.viewDetails')}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="vendors" className="mt-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold">{t('marketplace.topRatedVendors')}</h3>
                    <Button variant="outline" onClick={() => navigate("/services")}>{t('marketplace.viewAll')}</Button>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { name: "PixelPerfect Studios", owner: "Chioma Nwachukwu", specialties: ["Wedding", "Portrait"], rating: 4.9, projects: 127, location: "Lagos" },
                      { name: "Urban Lens Co.", owner: "Ahmed Musa", specialties: ["Street", "Fashion"], rating: 4.8, projects: 89, location: "Abuja" },
                      { name: "Golden Hour Creative", owner: "Blessing Okoro", specialties: ["Event", "Corporate"], rating: 4.9, projects: 156, location: "Port Harcourt" },
                      { name: "Moment Makers", owner: "Yusuf Ibrahim", specialties: ["Wedding", "Event"], rating: 4.7, projects: 203, location: "Kano" },
                      { name: "Frame & Focus", owner: "Adunni Adebayo", specialties: ["Portrait", "Fashion"], rating: 4.8, projects: 94, location: "Ibadan" },
                      { name: "Shutter Stories", owner: "Emeka Okafor", specialties: ["Documentary", "Event"], rating: 4.9, projects: 178, location: "Lagos" }
                    ].map((vendor, index) => (
                      <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="text-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3 text-primary-foreground font-bold">
                            {vendor.name.split(' ').map(word => word[0]).join('')}
                          </div>
                          <h4 className="font-semibold text-lg">{vendor.name}</h4>
                          <p className="text-sm text-muted-foreground">{t('services.by')} {vendor.owner}</p>
                          <p className="text-xs text-muted-foreground">{vendor.location}</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {vendor.specialties.map((specialty, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">{specialty}</Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-400">★</span>
                              <span>{vendor.rating}</span>
                            </div>
                            <span className="text-muted-foreground">{vendor.projects} {t('marketplace.projects')}</span>
                          </div>
                          
                          <Button 
                            className="w-full" 
                            size="sm"
                            onClick={() => navigate(`/vendor/studio-${index + 1}`)}
                          >
                            {t('marketplace.viewStudio')}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
      
      <VendorSignupDialog 
        isOpen={vendorDialog} 
        onClose={() => setVendorDialog(false)} 
      />
      
      <CollectionDialog
        isOpen={collectionDialog.isOpen}
        onClose={() => setCollectionDialog({ isOpen: false, collection: null })}
        collection={collectionDialog.collection}
      />
      
      <StudioDetailsDialog
        isOpen={studioDialog.isOpen}
        onClose={() => setStudioDialog({ isOpen: false, studio: null })}
        studio={studioDialog.studio}
      />
      
      <ProfileDetailsDialog
        isOpen={profileDialog.isOpen}
        onClose={() => setProfileDialog({ isOpen: false, photographer: null })}
        photographer={profileDialog.photographer}
        onBookService={(service) => {
          setBookingDialog({ isOpen: true, service });
          setProfileDialog({ isOpen: false, photographer: null });
        }}
      />

      <BookingDialog
        isOpen={bookingDialog.isOpen}
        onClose={() => setBookingDialog({ isOpen: false, service: null })}
        service={bookingDialog.service}
      />

      <GearDetailsDialog
        isOpen={gearDialog.isOpen}
        onClose={() => setGearDialog({ isOpen: false, gear: null })}
        gear={gearDialog.gear}
      />
    </div>
  );
};

export default Marketplace;