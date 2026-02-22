import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Camera, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDialog = ({ isOpen, onClose }: ProfileDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    experience: "3-5",
    specialties: "",
    equipment: "",
    verified: false,
    available: true
  });

  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);

  // Load actual user profile when dialog opens
  useEffect(() => {
    if (!isOpen || !user) return;

    const loadProfile = async () => {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: appData } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (profileData) {
        const nameParts = (profileData.name || "").trim().split(/\s+/);
        setProfile({
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: user.email || "",
          phone: profileData.phone || appData?.phone || "",
          location: profileData.location || appData?.location || "",
          bio: profileData.bio || "",
          experience: appData?.experience || "3-5",
          specialties: profileData.profession || appData?.specialties?.join(", ") || "",
          equipment: appData?.equipment || "",
          verified: appData?.status === 'approved',
          available: true
        });
      } else {
        // No profile row yet — pre-fill from auth metadata
        const meta = user.user_metadata || {};
        const displayName = meta.name || meta.full_name || "";
        const nameParts = displayName.trim().split(/\s+/);
        setProfile(prev => ({
          ...prev,
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: user.email || ""
        }));
      }
    };

    loadProfile();
  }, [isOpen, user]);

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: `${profile.firstName} ${profile.lastName}`.trim(),
          bio: profile.bio,
          phone: profile.phone,
          location: profile.location,
          profession: profile.specialties,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      toast({
        title: "Profile updated!",
        description: "Your profile information has been saved successfully.",
      });
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setUploadProgress(0);
    
    try {
      if (!user) throw new Error('User not authenticated');

      const totalFiles = files.length;
      let completedFiles = 0;

      const uploadPromises = Array.from(files).map(async (file) => {
        // Create a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { data, error } = await supabase.storage
          .from('profiles')
          .upload(filePath, file);

        if (error) throw error;

        completedFiles++;
        setUploadProgress(Math.round((completedFiles / totalFiles) * 100));

        const { data: { publicUrl } } = supabase.storage
          .from('profiles')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setPortfolioImages(prev => [...prev, ...uploadedUrls]);
      
      toast({
        title: "Photos uploaded!",
        description: `Successfully uploaded ${uploadedUrls.length} photo(s) to your portfolio.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload photos. Please try again.",
      });
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    setPortfolioImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleAddPhotosClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={profile.firstName}
                    onChange={(e) => updateProfile('firstName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={profile.lastName}
                    onChange={(e) => updateProfile('lastName', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profile.email}
                  onChange={(e) => updateProfile('email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  value={profile.phone}
                  onChange={(e) => updateProfile('phone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={profile.location}
                  onChange={(e) => updateProfile('location', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  value={profile.bio}
                  onChange={(e) => updateProfile('bio', e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Professional Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Select value={profile.experience} onValueChange={(value) => updateProfile('experience', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="specialties">Specialties</Label>
                <Input 
                  id="specialties" 
                  value={profile.specialties}
                  onChange={(e) => updateProfile('specialties', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="equipment">Camera Equipment</Label>
                <Textarea 
                  id="equipment" 
                  value={profile.equipment}
                  onChange={(e) => updateProfile('equipment', e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="verified">Verified Photographer</Label>
                <Switch 
                  id="verified" 
                  checked={profile.verified}
                  onCheckedChange={(checked) => updateProfile('verified', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="available">Available for Bookings</Label>
                <Switch 
                  id="available" 
                  checked={profile.available}
                  onCheckedChange={(checked) => updateProfile('available', checked)}
                />
              </div>
            </div>
          </Card>
        </div>
        
        <Card className="p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Portfolio</h3>
            <Button 
              variant="outline" 
              onClick={handleAddPhotosClick}
              disabled={uploadingImage}
            >
              <Plus className="w-4 h-4 mr-2" />
              {uploadingImage ? "Uploading..." : "Add Photos"}
            </Button>
          </div>
          {uploadingImage && (
            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading photos...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {portfolioImages.length > 0 ? (
              portfolioImages.map((imageUrl, index) => (
                <div key={index} className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
                  <img 
                    src={imageUrl} 
                    alt={`Portfolio image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            ) : (
              Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};