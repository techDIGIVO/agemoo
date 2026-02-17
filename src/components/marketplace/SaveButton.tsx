import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface SaveButtonProps {
  itemType: "service" | "gear" | "vendor";
  itemId: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost";
  className?: string;
}

export const SaveButton = ({ 
  itemType, 
  itemId, 
  size = "default", 
  variant = "outline",
  className = ""
}: SaveButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if the item is already saved when component mounts or user/item changes
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!user || !itemId) return;

      try {
        const { data, error } = await supabase
          .from('user_saves')
          .select('id')
          .eq('user_id', user.id)
          .eq('item_type', itemType)
          .eq('item_id', itemId)
          .maybeSingle();

        if (!error && data) {
          setIsSaved(true);
        }
      } catch (error) {
        // Silently fail — default to unsaved
      }
    };

    checkSavedStatus();
  }, [user, itemType, itemId]);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Sign in required",
        description: "Please sign in to save items",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isSaved) {
        // Remove from saves
        const { error } = await supabase
          .from('user_saves')
          .delete()
          .eq('user_id', user.id)
          .eq('item_type', itemType)
          .eq('item_id', itemId);

        if (error) throw error;

        setIsSaved(false);
        toast({
          title: "Removed from saves",
          description: "Item has been removed from your saved items",
        });
      } else {
        // Add to saves
        const { error } = await supabase
          .from('user_saves')
          .insert({
            user_id: user.id,
            item_type: itemType,
            item_id: itemId
          });

        if (error) throw error;

        setIsSaved(true);
        toast({
          title: "Saved!",
          description: "Item has been added to your saved items",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save item",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleSave}
      disabled={isLoading}
      className={className}
    >
      <Bookmark className={`w-4 h-4 ${size !== "icon" ? "mr-2" : ""} ${isSaved ? "fill-current" : ""}`} />
      {size !== "icon" && (isSaved ? "Saved" : "Save")}
    </Button>
  );
};
