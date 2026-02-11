import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface MessageButtonProps {
  vendorId: string;
  vendorName?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost";
  className?: string;
}

export const MessageButton = ({ 
  vendorId, 
  vendorName,
  size = "default", 
  variant = "default",
  className = ""
}: MessageButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMessage = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Prevent card click
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Sign in required",
        description: "Please sign in to message vendors",
      });
      return;
    }

    try {
      // Check if conversation already exists
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .or(`participant_one_id.eq.${user.id},participant_two_id.eq.${user.id}`)
        .or(`participant_one_id.eq.${vendorId},participant_two_id.eq.${vendorId}`)
        .maybeSingle();

      if (existingConversation) {
        // Navigate to existing conversation
        navigate(`/messages?conversation=${existingConversation.id}`);
      } else {
        // Create new conversation
        const { data: newConversation, error } = await supabase
          .from('conversations')
          .insert({
            participant_one_id: user.id,
            participant_two_id: vendorId
          })
          .select()
          .single();

        if (error) throw error;

        // Navigate to new conversation
        navigate(`/messages?conversation=${newConversation.id}`);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to start conversation",
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleMessage}
      className={className}
    >
      <MessageCircle className={`w-4 h-4 ${size !== "icon" ? "mr-2" : ""}`} />
      {size !== "icon" && "Message"}
    </Button>
  );
};
