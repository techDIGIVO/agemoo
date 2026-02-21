import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Camera, Plus, X, ArrowLeft, Save, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ProfileSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const loadData = async () => {
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
        setProfile(prev => ({
          ...prev,
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: user.email || "",
          bio: profileData.bio || "",
          phone: profileData.phone || appData?.phone || "",
          location: profileData.location || appData?.location || "",
          // Professional details mapping
          experience: appData?.experience || "3-5",
          specialties: profileData.profession || appData?.specialties?.join(", ") || "",
          equipment: appData?.equipment || "",
          verified: appData?.status === 'approved'
        }));
      }
    };

    loadData();
  }, [user, navigate]);

  const updateProfile = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Update basic profile
        const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: `${profile.firstName} ${profile.lastName}`.trim(),
          bio: profile.bio,
          phone: profile.phone,
          location: profile.location,
          profession: profile.specialties, // Sync profession with specialties
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // Update/Create professional application record
      const { error: appError } = await supabase
        .from('applications')
        .upsert({
          user_id: user.id,
          owner_name: `${profile.firstName} ${profile.lastName}`.trim(),
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
          description: profile.bio,
          experience: profile.experience,
          specialties: profile.specialties.split(',').map(s => s.trim()),
          equipment: profile.equipment,
          business_name: `${profile.firstName}'s Studio`,
          status: profile.verified ? 'approved' : 'pending'
        });

        if (appError) throw appError;
      
      toast({
        title: "Profile updated!",
        description: "Your profile information has been saved successfully.",
      });
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !user) return;

    setUploadingImage(true);
    setUploadProgress(0);
    
    try {
      const totalFiles = files.length;
      let completedFiles = 0;

      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error } = await supabase.storage
          .from('portfolios') // Changed to portfolios bucket as per migrations
          .upload(filePath, file);

        if (error) throw error;

        completedFiles++;
        setUploadProgress(Math.round((completedFiles / totalFiles) * 100));

        const { data: { publicUrl } } = supabase.storage
          .from('portfolios')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setPortfolioImages(prev => [...prev, ...uploadedUrls]);
      
      toast({
        title: "Photos uploaded!",
        description: `Successfully uploaded ${uploadedUrls.length} photo(s) to your portfolio.`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload photos. Please try again.",
      });
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    setPortfolioImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-12 bg-muted/20">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl sm:text-3xl font-bold">Edit Profile</h1>
            </div>
            <Button onClick={handleSave} disabled={isLoading} className="shadow-soft w-full sm:w-auto">
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <Card className="p-4 sm:p-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
                Basic Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={profile.firstName}
                      onChange={(e) => updateProfile('firstName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={profile.lastName}
                      onChange={(e) => updateProfile('lastName', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={profile.email}
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-[10px] text-muted-foreground">Email cannot be changed.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={profile.phone}
                    placeholder="+234..."
                    onChange={(e) => updateProfile('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={profile.location}
                    placeholder="Lagos, Nigeria"
                    onChange={(e) => updateProfile('location', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={profile.bio}
                    onChange={(e) => updateProfile('bio', e.target.value)}
                    placeholder="Tell clients about your work style..."
                    rows={5}
                  />
                </div>
              </div>
            </Card>

            {/* Professional Details */}
            <Card className="p-4 sm:p-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <Camera className="w-5 h-5 mr-2 text-primary" />
                Professional Details
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
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
                <div className="space-y-2">
                  <Label htmlFor="specialties">Specialties</Label>
                  <Input 
                    id="specialties" 
                    value={profile.specialties}
                    placeholder="Portraits, Weddings, etc."
                    onChange={(e) => updateProfile('specialties', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipment">Camera Equipment</Label>
                  <Textarea 
                    id="equipment" 
                    value={profile.equipment}
                    placeholder="List your primary gear..."
                    onChange={(e) => updateProfile('equipment', e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border bg-background/50">
                    <div className="space-y-0.5">
                      <Label htmlFor="verified" className="text-base">Verified Badge</Label>
                      <p className="text-xs text-muted-foreground">Display your verified status to clients.</p>
                    </div>
                    <Switch 
                      id="verified" 
                      checked={profile.verified}
                      onCheckedChange={(checked) => updateProfile('verified', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border bg-background/50">
                    <div className="space-y-0.5">
                      <Label htmlFor="available" className="text-base">Booking Availability</Label>
                      <p className="text-xs text-muted-foreground">Show as active and ready for hire.</p>
                    </div>
                    <Switch 
                      id="available" 
                      checked={profile.available}
                      onCheckedChange={(checked) => updateProfile('available', checked)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Portfolio Section */}
          <Card className="p-4 sm:p-8 mt-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-semibold">Portfolio Gallery</h3>
                <p className="text-sm text-muted-foreground">Upload high-quality images of your best work.</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
              >
                <Plus className="w-4 h-4 mr-2" />
                {uploadingImage ? "Uploading..." : "Add Photos"}
              </Button>
            </div>

            {uploadingImage && (
              <div className="mb-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="animate-pulse">Uploading photos...</span>
                  <span className="font-medium">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
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

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {portfolioImages.length > 0 ? (
                portfolioImages.map((imageUrl, index) => (
                  <div key={index} className="relative aspect-square bg-muted rounded-xl overflow-hidden group border shadow-sm">
                    <img 
                      src={imageUrl} 
                      alt={`Portfolio item ${index + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8 rounded-full"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-muted/50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 text-muted-foreground/40">
                    <Camera className="w-8 h-8 mb-2 opacity-20" />
                    <span className="text-[10px] font-medium">Empty Slot</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileSettings;