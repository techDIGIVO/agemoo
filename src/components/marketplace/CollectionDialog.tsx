import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CollectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  collection: {
    title: string;
    description: string;
    price: string;
    photographerCount: number;
    photographers: Array<{
      name: string;
      rating: number;
      location: string;
      experience: string;
      price: string;
      specialties: string[];
      image: string;
    }>;
  } | null;
}

export const CollectionDialog = ({ isOpen, onClose, collection }: CollectionDialogProps) => {
  const navigate = useNavigate();
  
  if (!collection) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-primary" />
            <span>{collection.title}</span>
          </DialogTitle>
          <p className="text-muted-foreground">{collection.description}</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Collection Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{collection.photographerCount}</div>
              <div className="text-sm text-muted-foreground">Photographers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{collection.price}</div>
              <div className="text-sm text-muted-foreground">Starting From</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">4.8</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
          </div>

          {/* Featured Photographers */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Featured Photographers</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {collection.photographers.map((photographer, index) => (
                <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                      {photographer.image}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{photographer.name}</h4>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{photographer.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{photographer.location}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{photographer.experience}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {photographer.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-primary">{photographer.price}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            navigate(`/vendor/photographer-${index + 1}`);
                            onClose();
                          }}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button 
              className="flex-1"
              onClick={() => {
                navigate(`/services?category=${collection.title}`);
                onClose();
              }}
            >
              Browse All {collection.title}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};