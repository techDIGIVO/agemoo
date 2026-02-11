import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Camera, MapPin, Star, Clock, Mail, Phone, Instagram, Globe, 
  Calendar, Award, Users, Heart, MessageCircle 
} from "lucide-react";

interface StudioDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  studio: {
    name: string;
    owner: string;
    specialties: string[];
    rating: number;
    projects: number;
    location: string;
    image: string;
    description: string;
    experience: string;
    startingPrice: string;
    equipment: string[];
    services: Array<{
      name: string;
      price: string;
      duration: string;
      description: string;
    }>;
    portfolio: Array<{
      title: string;
      category: string;
      image: string;
    }>;
    reviews: Array<{
      client: string;
      rating: number;
      comment: string;
      date: string;
    }>;
    contact: {
      email: string;
      phone: string;
      website: string;
      instagram: string;
    };
    availability: string;
  } | null;
}

export const StudioDetailsDialog = ({ isOpen, onClose, studio }: StudioDetailsDialogProps) => {
  if (!studio) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${studio.owner}`} />
              <AvatarFallback>{studio.image}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{studio.name}</h2>
              <p className="text-muted-foreground">by {studio.owner}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Studio Hero Section */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                <Camera className="w-16 h-16 text-primary" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{studio.rating}</span>
                    <span className="text-muted-foreground">({studio.projects} projects)</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{studio.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{studio.experience} experience</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{studio.availability}</span>
                  </div>
                </div>
              </Card>

              {/* Specialties */}
              <div>
                <h4 className="font-semibold mb-2">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {studio.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="secondary">{specialty}</Badge>
                  ))}
                </div>
              </div>

              {/* Starting Price */}
              <div>
                <h4 className="font-semibold mb-2">Starting Price</h4>
                <div className="text-2xl font-bold text-primary">{studio.startingPrice}</div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <Button className="w-full" size="lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now
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
            </div>
          </div>

          {/* Detailed Information Tabs */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">About the Studio</h3>
                <p className="text-muted-foreground leading-relaxed">{studio.description}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Equipment & Gear</h4>
                <div className="grid grid-cols-2 gap-2">
                  {studio.equipment.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm">
                      <Camera className="w-4 h-4 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="services" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {studio.services.map((service, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{service.name}</h4>
                        <Badge variant="outline">{service.duration}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">{service.price}</span>
                        <Button size="sm">Book Service</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="portfolio" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                {studio.portfolio.map((item, idx) => (
                  <Card key={idx} className="overflow-hidden group cursor-pointer">
                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <Camera className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-4">
              <div className="space-y-4">
                {studio.reviews.map((review, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{review.client.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm">{review.client}</p>
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
            
            <TabsContent value="contact" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h4 className="font-semibold mb-4">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="text-sm">{studio.contact.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="text-sm">{studio.contact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-primary" />
                      <span className="text-sm">{studio.contact.website}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Instagram className="w-4 h-4 text-primary" />
                      <span className="text-sm">{studio.contact.instagram}</span>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-semibold mb-4">Quick Message</h4>
                  <div className="space-y-3">
                    <textarea 
                      className="w-full p-3 border rounded-md resize-none" 
                      rows={4}
                      placeholder="Send a quick message to the studio..."
                    />
                    <Button className="w-full">Send Message</Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};