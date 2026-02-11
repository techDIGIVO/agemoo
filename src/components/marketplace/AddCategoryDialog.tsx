import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AddCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded: (category: string) => void;
  type: "service" | "gear";
}

export const AddCategoryDialog = ({ 
  isOpen, 
  onClose, 
  onCategoryAdded,
  type 
}: AddCategoryDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [categoryName, setCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to suggest categories",
      });
      return;
    }

    if (!categoryName.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter a category name",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create slug from name
      const slug = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      const { error } = await supabase
        .from('categories')
        .insert({
          name: categoryName.trim(),
          slug,
          type,
          is_default: false,
          created_by: user.id
        });

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({
            variant: "destructive",
            title: "Category Already Exists",
            description: "This category name is already in use",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Category Suggested!",
          description: "Your category has been added and is now available for selection",
        });
        
        onCategoryAdded(categoryName.trim());
        setCategoryName("");
        onClose();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add category",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-primary" />
            <span>Add Custom Category</span>
          </DialogTitle>
          <DialogDescription>
            Suggest a new category for {type === 'service' ? 'services' : 'gear'}. 
            It will be available immediately for filtering.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g., Drone Photography"
              required
            />
            <p className="text-xs text-muted-foreground">
              Choose a descriptive name that others can easily understand
            </p>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Adding..." : "Add Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
