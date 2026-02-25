import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Users, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { VendorSignupDialog } from "@/components/marketplace/VendorSignupDialog";
import heroImage from "@/assets/hero-african-photographers.jpg";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth()
  const { t } = useLanguage();
  const [vendorSignupOpen, setVendorSignupOpen] = useState(false);
  return <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-primary/20 via-background to-secondary/20">
          {/* Placeholder for video - using gradient background for now */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          <div className="w-full h-full bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: `url(${heroImage})`
        }} />
        </div>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-white">
            <div className="space-y-6">
              <Badge variant="secondary" className="px-4 py-2 mt-4 text-sm font-medium bg-white/10 text-white border-white/20">
                <Star className="w-4 h-4 mr-2 fill-current" />
                {t('hero.badge')}
              </Badge>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-gradient-light">{t('hero.title1')}

              </span>
                <br />
                <span className="text-white">{t('hero.title2')}</span>
                <br />
                <span className="text-gradient-light">{t('hero.title3')}</span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed max-w-lg">
                {t('hero.description')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <VendorSignupDialog isOpen={vendorSignupOpen} onClose={() => setVendorSignupOpen(false)} />
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 shadow-medium font-semibold bg-primary hover:bg-primary/90"
                onClick={() => navigate(user ? "/vendor-registration" : "/auth?mode=signin")}
              >
                {t('hero.startCreating')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 pt-8 pb-10">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{t('hero.stats.photographersValue')}</div>
                <div className="text-sm text-white/70">{t('hero.stats.photographers')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{t('hero.stats.projectsValue')}</div>
                <div className="text-sm text-white/70">{t('hero.stats.projects')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{t('hero.stats.countriesValue')}</div>
                <div className="text-sm text-white/70">{t('hero.stats.countries')}</div>
              </div>
            </div>
          </div>

          {/* Right Content - Floating Cards */}
          <div className="relative hidden lg:block">
            {/* Floating photographer cards */}
            <div className="absolute top-10 right-0 z-20">
              <Card className="p-4 shadow-elegant bg-background/95 backdrop-blur">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop" alt="Adaora from Lagos" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold">Adaora Nnamdi</p>
                    <p className="text-sm text-muted-foreground">Lagos, Nigeria</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Available</Badge>
                </div>
              </Card>
            </div>

            <div className="absolute top-40 left-10 z-20">
              <Card className="p-4 shadow-elegant bg-background/95 backdrop-blur">
                <div className="flex items-center space-x-2">
                  <Camera className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold text-sm">Wildlife Photography</p>
                    <p className="text-xs text-muted-foreground">₦85,000/day</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="absolute bottom-20 right-20 z-20">
              <Card className="p-4 shadow-elegant bg-background/95 backdrop-blur">
                <div className="flex items-center space-x-2">
                  <Users className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold text-sm">5.0 Rating</p>
                    <p className="text-xs text-muted-foreground">2,847 reviews</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="absolute bottom-40 left-0 z-20">
              <Card className="p-4 shadow-elegant bg-background/95 backdrop-blur">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Kwame from Accra" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold">Kwame Asante</p>
                    <p className="text-sm text-muted-foreground">Accra, Ghana</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Booked</Badge>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default Hero;