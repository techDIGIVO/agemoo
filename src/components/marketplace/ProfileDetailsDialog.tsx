import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, MapPin, Star, Clock, Mail, Phone, Instagram, Globe, 
  Calendar, Award, Users, Heart, MessageCircle, CheckCircle, Briefcase
} from "lucide-react";

interface ProfileDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBookService?: (service: any) => void;
  photographer: {
    vendorId?: string;
    name: string;
    specialty: string;
    rating: number;
    price: string;
    image: string;
    location: string;
    experience: string;
    bio: string;
    languages: string[];
    equipment: string[];
    achievements: string[];
    services: Array<{
      name: string;
      price: string;
      duration: string;
      description: string;
    }>;
    packages: Array<{
      name: string;
      price: string;
      features: string[];
      popular?: boolean;
    }>;
    portfolio: Array<{
      title: string;
      category: string;
      client: string;
    }>;
    reviews: Array<{
      client: string;
      rating: number;
      comment: string;
      date: string;
      verified: boolean;
    }>;
    stats: {
      totalProjects: number;
      responseTime: string;
      rebookingRate: string;
      completionRate: string;
    };
    contact: {
      email: string;
      phone: string;
      website?: string;
      instagram: string;
    };
    availability: string;
  } | null;
}

export const ProfileDetailsDialog = ({ isOpen, onClose, photographer, onBookService }: ProfileDetailsDialogProps) => {
  if (!photographer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${photographer.name}`} />
              <AvatarFallback className="text-lg font-bold">{photographer.image}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{photographer.name}</h2>
              <p className="text-lg text-primary font-semibold">{photographer.specialty}</p>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{photographer.rating}</span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{photographer.location}</span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{photographer.experience}</span>
                </div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Bio */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">About Me</h3>
                  <p className="text-muted-foreground leading-relaxed">{photographer.bio}</p>
                </div>

                {/* Languages */}
                <div>
                  <h4 className="font-semibold mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {photographer.languages.map((language, idx) => (
                      <Badge key={idx} variant="outline">{language}</Badge>
                    ))}
                  </div>
                </div>

                {/* Equipment */}
                <div>
                  <h4 className="font-semibold mb-3">Professional Equipment</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {photographer.equipment.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm">
                        <Camera className="w-4 h-4 text-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="font-semibold mb-3">Achievements & Certifications</h4>
                  <div className="space-y-2">
                    {photographer.achievements.map((achievement, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm">
                        <Award className="w-4 h-4 text-primary" />
                        <span>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="services" className="space-y-6 mt-6">
                {/* Individual Services */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Individual Services</h3>
                  <div className="space-y-4">
                    {photographer.services.map((service, idx) => (
                      <Card key={idx} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold">{service.name}</h4>
                              <Badge variant="outline">{service.duration}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                            <div className="text-xl font-bold text-primary">{service.price}</div>
                          </div>
                          <Button 
                            size="sm" 
                            className="ml-4"
                            onClick={() => onBookService?.({
                              id: idx + 1,
                              title: service.name,
                              vendor: photographer.name,
                              vendorId: photographer.vendorId,
                              price: service.price,
                              category: photographer.specialty
                            })}
                          >
                            Book Now
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Packages */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Photography Packages</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {photographer.packages.map((pkg, idx) => (
                      <Card key={idx} className={`p-6 relative ${pkg.popular ? 'border-primary' : ''}`}>
                        {pkg.popular && (
                          <Badge className="absolute -top-2 left-4 bg-primary">Most Popular</Badge>
                        )}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xl font-bold">{pkg.name}</h4>
                            <div className="text-2xl font-bold text-primary mt-2">{pkg.price}</div>
                          </div>
                          <div className="space-y-2">
                            {pkg.features.map((feature, fidx) => (
                              <div key={fidx} className="flex items-center space-x-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                          <Button 
                            className="w-full" 
                            variant={pkg.popular ? "default" : "outline"}
                            onClick={() => onBookService?.({
                              id: idx + 100,
                              title: pkg.name,
                              vendor: photographer.name,
                              vendorId: photographer.vendorId,
                              price: pkg.price,
                              category: `${photographer.specialty} Package`
                            })}
                          >
                            Choose Package
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="portfolio" className="space-y-4 mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {photographer.portfolio.map((item, idx) => (
                    <Card key={idx} className="overflow-hidden group cursor-pointer">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <Camera className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                        <p className="text-xs text-muted-foreground mt-1">Client: {item.client}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-4 mt-6">
                <div className="space-y-4">
                  {photographer.reviews.map((review, idx) => (
                    <Card key={idx} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{review.client.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="font-semibold text-sm">{review.client}</p>
                                {review.verified && (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="p-4">
              <h4 className="font-semibold mb-4">Professional Stats</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Projects Completed</span>
                    <span className="font-semibold">{photographer.stats.totalProjects}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Response Time</span>
                    <span className="font-semibold">{photographer.stats.responseTime}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Rebooking Rate</span>
                    <span className="font-semibold text-green-600">{photographer.stats.rebookingRate}</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completion Rate</span>
                    <span className="font-semibold text-green-600">{photographer.stats.completionRate}</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
              </div>
            </Card>

            {/* Pricing */}
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Starting Price</h4>
              <div className="text-3xl font-bold text-primary mb-2">{photographer.price}</div>
              <p className="text-sm text-muted-foreground mb-4">{photographer.availability}</p>
              
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => onBookService?.({
                    id: 999,
                    title: "General Consultation",
                    vendor: photographer.name,
                    vendorId: photographer.vendorId,
                    price: photographer.price,
                    category: photographer.specialty
                  })}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Session
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                </div>
              </div>
            </Card>

            {/* Contact */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{photographer.contact.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{photographer.contact.phone}</span>
                </div>
                {photographer.contact.website && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Globe className="w-4 h-4 text-primary" />
                    <span>{photographer.contact.website}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  <Instagram className="w-4 h-4 text-primary" />
                  <span>{photographer.contact.instagram}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};