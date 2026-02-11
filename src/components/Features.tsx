import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Camera, 
  Users, 
  Shield, 
  Zap, 
  Calendar, 
  DollarSign,
  MessageSquare,
  Award,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import creativeTeam from "@/assets/creative-team.jpg";
import gearCollection from "@/assets/gear-collection.jpg";

const Features = () => {
  const { t } = useLanguage();
  const features = [
    {
      icon: Users,
      title: t('features.serviceMarketplace'),
      description: t('features.marketplaceDesc'),
      badge: "Popular",
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      icon: Camera,
      title: t('features.gearRentalHub'),
      description: t('features.gearDesc'),
      badge: "New",
      color: "bg-green-500/10 text-green-600"
    },
    {
      icon: Shield,
      title: t('features.securePayments'),
      description: t('features.paymentsDesc'),
      badge: "Trusted",
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      icon: Calendar,
      title: t('features.smartBooking'),
      description: t('features.bookingDesc'),
      badge: "AI-Powered",
      color: "bg-orange-500/10 text-orange-600"
    },
    {
      icon: MessageSquare,
      title: t('features.messaging'),
      description: t('features.messagingDesc'),
      badge: "Real-time",
      color: "bg-pink-500/10 text-pink-600"
    },
    {
      icon: TrendingUp,
      title: t('features.analytics'),
      description: t('features.analyticsDesc'),
      badge: "Pro",
      color: "bg-indigo-500/10 text-indigo-600"
    }
  ];

  return (
    <section className="py-20 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('features.heading')}
            <span className="text-gradient"> {t('common.succeed')}</span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t('features.description')}
          </p>
        </div>

        {/* Service Marketplace Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-8">
            <div>
              <Badge className="mb-4">{t('services.sectionBadge')}</Badge>
              <h3 className="text-3xl font-bold mb-4">
                {t('services.sectionTitle')} <span className="text-gradient">Creative Professionals</span>
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {t('services.sectionDesc')}
              </p>
              <Link to="/services">
                <Button size="lg" className="font-semibold">
                  {t('services.browseServices')}
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {features.slice(0, 4).map((feature, index) => (
                <Card key={index} className="p-4 shadow-soft">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${feature.color} mb-3`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold mb-1">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <img
              src={creativeTeam}
              alt="Creative team collaborating"
              className="w-full h-[500px] object-cover rounded-2xl shadow-medium"
            />
            <div className="absolute top-6 left-6">
              <Card className="p-3 bg-background/95 backdrop-blur">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-sm">{t('services.professionals')}</span>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Gear Rental Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="lg:order-2 space-y-8">
            <div>
              <Badge className="mb-4">{t('gear.sectionBadge')}</Badge>
              <h3 className="text-3xl font-bold mb-4">
                Access <span className="text-gradient">Premium Equipment</span>
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {t('gear.sectionDesc')}
              </p>
              <Link to="/gear">
                <Button size="lg" className="font-semibold">
                  {t('gear.browseGear')}
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {features.slice(4, 6).concat([
                {
                  icon: Award,
                  title: t('features.trustAndSafety'),
                  description: t('features.trustDesc'),
                  badge: "Verified",
                  color: "bg-emerald-500/10 text-emerald-600"
                },
                {
                  icon: DollarSign,
                  title: t('features.flexiblePricing'),
                  description: t('features.pricingDesc'),
                  badge: "Flexible",
                  color: "bg-red-500/10 text-red-600"
                }
              ]).map((feature, index) => (
                <Card key={index} className="p-4 shadow-soft">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${feature.color} mb-3`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold mb-1">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="lg:order-1 relative">
            <img
              src={gearCollection}
              alt="Professional photography equipment"
              className="w-full h-[500px] object-cover rounded-2xl shadow-medium"
            />
            <div className="absolute bottom-6 right-6">
              <Card className="p-3 bg-background/95 backdrop-blur">
                <div className="flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-sm">{t('gear.itemsAvailable')}</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;