import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Camera, DollarSign, Calendar, Settings, User, FileText,
  TrendingUp, Clock, MapPin, Phone, Mail, Edit, Plus,
  Star, BarChart3, Users, Package, X, Bookmark,
  Briefcase,
  CheckCircle2,
  Trash2,
  Link as LinkIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Lightbox } from "@/components/ui/lightbox";
import { AvailabilityDialog } from "@/components/calendar/AvailabilityDialog";

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Dashboard UI State
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [showManualBookingForm, setShowManualBookingForm] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  // Media State
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Data State
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");
  const [availabilityDialog, setAvailabilityDialog] = useState(false);

  // Form States
  const [newService, setNewService] = useState({
    name: "",
    price: "",
    duration: "",
    description: ""
  });

  const [manualBookingData, setManualBookingData] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    service_name: "",
    booking_date: "",
    booking_time: "",
    duration: "",
    total_price: "",
    notes: "",
    status: "confirmed"
  });

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    experience: "",
    specialties: "",
    equipment: "",
    verified: false,
    available: false
  });

  // Ensure a profile row exists for this user (defensive – prevents FK errors)
  const ensureProfile = async () => {
    if (!user) return;
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (!existing) {
      await supabase.from('profiles').insert({
        id: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
      });
    }
  };

  useEffect(() => {
    if (!isLoading && !user) navigate("/");
    if (user) {
      ensureProfile().then(() => {
        loadProfileData();
        fetchBookings();
        fetchServices();
      });
    }
  }, [user, isLoading]);

  const fetchBookings = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .or(`client_id.eq.${user.id},vendor_id.eq.${user.id}`)
      .order('booking_date', { ascending: false });

    if (!error) setBookings(data || []);
  };

  const fetchServices = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('vendor_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) setServices(data || []);
  };

  const loadProfileData = async () => {
    if (!user) return;
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    const { data: app } = await supabase.from('applications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle();

    if (profile) {
      setProfileData({
        firstName: profile.name?.split(' ')[0] || '',
        lastName: profile.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: profile.phone || app?.phone || '',
        location: profile.location || app?.location || '',
        bio: profile.bio || app?.description || '',
        experience: app?.experience || '3-5 years',
        specialties: profile.profession || app?.specialties?.join(', ') || 'Professional Creative',
        equipment: app?.equipment || 'Not specified',
        verified: app?.status === 'approved',
        available: true
      });
    };
  };

  const handleCopyProfileLink = () => {
    const link = `${window.location.origin}/vendor/${user?.id}`;
    navigator.clipboard.writeText(link);
    toast({ title: t('action.linkCopied'), description: t('action.linkCopiedDesc') });
  };

  const handleUpdatePayment = () => {
    toast({ title: t('action.success'), description: t('settings.paymentMethodsUpdated') });
  };

  const handleDeleteService = async (id: string) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (!error) {
      toast({ title: t('action.serviceDeleted') });
      // Update local state immediately
      setServices(prev => prev.filter(s => s.id !== id));
    } else {
      toast({ variant: "destructive", title: t('action.error'), description: error.message });
    }
  };

  const handleDeleteBooking = async (id: string) => {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (!error) {
      toast({ title: t('action.bookingDeleted') });
      // Update local state immediately so UI reflects change in Bookings AND Calendar tab
      setBookings(prev => prev.filter(b => b.id !== id));
    } else {
      toast({ variant: "destructive", title: t('action.error'), description: error.message });
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
    if (!error) {
      toast({ title: t('action.statusUpdated'), description: `${t('action.bookingMarkedAs')} ${newStatus}` });
      fetchBookings();
    }
  };

  const handleEditService = (service: any) => {
    setEditingService({
      id: service.id,
      name: service.title,
      price: service.price.toString(),
      duration: service.duration,
      description: service.description || ""
    });
    setShowAddServiceForm(false);
  };

  const handleManualBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data, error } = await supabase.from('bookings').insert({
        vendor_id: user.id,
        client_id: user.id,
        booking_date: manualBookingData.booking_date,
        booking_time: manualBookingData.booking_time,
        duration: manualBookingData.duration,
        total_price: parseFloat(manualBookingData.total_price),
        status: manualBookingData.status,
        notes: `Manual booking - Client: ${manualBookingData.client_name} (${manualBookingData.client_email}, ${manualBookingData.client_phone})\nService: ${manualBookingData.service_name}\n${manualBookingData.notes}`
      }).select().single();

      if (error) throw error;

      toast({ title: "Booking created!", description: "Manual booking has been added successfully." });
      
      // Update local state immediately
      if(data) setBookings(prev => [data, ...prev]);
      
      setShowManualBookingForm(false);
      setManualBookingData({
        client_name: "", client_email: "", client_phone: "", service_name: "",
        booking_date: "", booking_time: "", duration: "", total_price: "",
        notes: "", status: "confirmed"
      });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const priceValue = parseFloat(newService.price.replace(/[^0-9.-]+/g, ""));
      const { data, error } = await supabase.from('services').insert({
        vendor_id: user.id,
        title: newService.name,
        description: newService.description,
        price: priceValue,
        duration: newService.duration,
        category: 'Photography',
        location: profileData.location || 'Nigeria',
        slug: newService.name.toLowerCase().replace(/\s+/g, '-')
      }).select().single();

      if (error) throw error;

      // Update local state
      if(data) setServices(prev => [data, ...prev]);
      
      setShowAddServiceForm(false);
      setNewService({ name: "", price: "", duration: "", description: "" });
      toast({ title: "Service added!" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const priceValue = parseFloat(editingService.price.replace(/[^0-9.-]+/g, ""));
      const { error } = await supabase.from('services').update({
        title: editingService.name,
        price: priceValue,
        duration: editingService.duration,
        description: editingService.description
      }).eq('id', editingService.id);

      if (error) throw error;
      toast({ title: "Service updated!" });
      
      // Refresh list
      fetchServices();
      setEditingService(null);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update failed", description: error.message });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !user) return;

    setUploadingImage(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        const { error } = await supabase.storage.from('portfolios').upload(filePath, file);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('portfolios').getPublicUrl(filePath);
        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setPortfolioImages(prev => [...prev, ...uploadedUrls]);
      toast({ title: "Photos uploaded!" });
    } catch (error) {
      toast({ variant: "destructive", title: "Upload failed" });
    } finally {
      setUploadingImage(false);
    }
  };

  if (isLoading || !user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed');

  const stats = [
    { label: t('dashboard.stats.totalBookings'), value: bookings.length.toString(), icon: Calendar },
    { label: t('dashboard.stats.revenue'), value: `₦${totalRevenue.toLocaleString()}`, icon: DollarSign },
    { label: t('dashboard.stats.rating'), value: profileData.verified ? "Verified" : "Pending", icon: Star },
    { label: t('dashboard.stats.views'), value: `${services.length} services`, icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
              <p className="text-muted-foreground">{t('dashboard.welcome')} {profileData.firstName || 'Creative'}!</p>
            </div>
            <Button onClick={() => { setActiveTab("services"); setShowAddServiceForm(true); setEditingService(null); }}>
              <Plus className="w-4 h-4 mr-2" /> {t('dashboard.newService')}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
              </Card>
            ))}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex w-full overflow-x-auto mb-8">
              <TabsTrigger value="overview" className="flex-shrink-0">{t('dashboard.overview')}</TabsTrigger>
              <TabsTrigger value="bookings" className="flex-shrink-0">{t('dashboard.bookings')}</TabsTrigger>
              <TabsTrigger value="calendar" className="flex-shrink-0">{t('dashboard.calendar')}</TabsTrigger>
              <TabsTrigger value="services" className="flex-shrink-0">{t('dashboard.services')}</TabsTrigger>
              <TabsTrigger value="profile" className="flex-shrink-0">{t('dashboard.profile')}</TabsTrigger>
              <TabsTrigger value="settings" className="flex-shrink-0">{t('dashboard.settings')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{t('dashboard.recentBookings')}</h3>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab("bookings")}>{t('dashboard.viewAll')}</Button>
                  </div>
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">Booking #{booking.id.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">{new Date(booking.booking_date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₦{booking.total_price.toLocaleString()}</p>
                          <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>{booking.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">{t('dashboard.quickActions')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/dashboard/messages')}><Mail className="w-6 h-6 mb-2" />{t('dashboard.messages')}</Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab("bookings")}><Calendar className="w-6 h-6 mb-2" />{t('dashboard.bookings')}</Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/profile/settings')}><User className="w-6 h-6 mb-2" />{t('dashboard.profileSettings')}</Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/gear')}><Package className="w-6 h-6 mb-2" />{t('dashboard.myGear')}</Button>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h3 className="text-lg font-semibold">{t('dashboard.manageBookings')}</h3>
                  <div className="flex flex-wrap gap-2">
                    <Select value={bookingStatusFilter} onValueChange={setBookingStatusFilter}>
                      <SelectTrigger className="w-40"><SelectValue placeholder={t('common.filter')} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('dashboard.status.all')}</SelectItem>
                        <SelectItem value="pending">{t('dashboard.status.pending')}</SelectItem>
                        <SelectItem value="confirmed">{t('dashboard.status.confirmed')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => setShowManualBookingForm(true)}><Plus className="w-4 h-4 mr-2" />{t('dashboard.manualBooking')}</Button>
                  </div>
                </div>

                {showManualBookingForm && (
                  <Card className="mb-8 p-6 bg-muted/30 border-primary/20">
                    <h4 className="font-semibold mb-4">{t('dashboard.newBooking')}</h4>
                    <form onSubmit={handleManualBookingSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2"><Label>{t('dashboard.clientName')} *</Label><Input value={manualBookingData.client_name} onChange={e => setManualBookingData({ ...manualBookingData, client_name: e.target.value })} required /></div>
                        <div className="space-y-2"><Label>{t('dashboard.clientEmail')} *</Label><Input type="email" value={manualBookingData.client_email} onChange={e => setManualBookingData({ ...manualBookingData, client_email: e.target.value })} required /></div>
                        <div className="space-y-2"><Label>{t('dashboard.clientPhone')} *</Label><Input value={manualBookingData.client_phone} onChange={e => setManualBookingData({ ...manualBookingData, client_phone: e.target.value })} required /></div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>{t('dashboard.serviceName')} *</Label><Input value={manualBookingData.service_name} onChange={e => setManualBookingData({ ...manualBookingData, service_name: e.target.value })} required /></div>
                        <div className="space-y-2"><Label>{t('dashboard.totalPrice')} (₦) *</Label><Input type="number" value={manualBookingData.total_price} onChange={e => setManualBookingData({ ...manualBookingData, total_price: e.target.value })} required /></div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2"><Label>{t('dashboard.bookingDate')} *</Label><Input type="date" value={manualBookingData.booking_date} onChange={e => setManualBookingData({ ...manualBookingData, booking_date: e.target.value })} required /></div>
                        <div className="space-y-2"><Label>{t('dashboard.bookingTime')} *</Label><Input type="time" value={manualBookingData.booking_time} onChange={e => setManualBookingData({ ...manualBookingData, booking_time: e.target.value })} required /></div>
                        <div className="space-y-2">
                          <Label>{t('dashboard.duration')} *</Label>
                          <Select value={manualBookingData.duration} onValueChange={v => setManualBookingData({ ...manualBookingData, duration: v })}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1 hour">1 hour</SelectItem>
                              <SelectItem value="2 hours">2 hours</SelectItem>
                              <SelectItem value="4 hours">4 hours</SelectItem>
                              <SelectItem value="Full day">Full day</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2"><Label>{t('dashboard.notes')}</Label><Textarea value={manualBookingData.notes} onChange={e => setManualBookingData({ ...manualBookingData, notes: e.target.value })} placeholder="Location, specific requests, etc." /></div>
                      <div className="flex space-x-2 pt-2">
                        <Button type="submit">{t('dashboard.createBooking')}</Button>
                        <Button type="button" variant="outline" onClick={() => setShowManualBookingForm(false)}>{t('common.cancel')}</Button>
                      </div>
                    </form>
                  </Card>
                )}

                <div className="space-y-4">
                  {bookings.filter(b => bookingStatusFilter === "all" || b.status === bookingStatusFilter).map((booking) => (
                    <Card key={booking.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary"><Calendar className="w-5 h-5" /></div>
                        <div>
                          <p className="font-semibold">
                            {/* Display client name or readable ID */}
                            {booking.notes?.split('\n')[0] || `Booking #${booking.id.slice(0, 8)}`}
                          </p>
                          <p className="text-xs text-muted-foreground">{new Date(booking.booking_date).toDateString()} • {booking.booking_time || 'All Day'}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row items-end md:items-center gap-4 w-full md:w-auto">
                        <div className="text-right">
                          <p className="font-bold">₦{booking.total_price.toLocaleString()}</p>
                          <Badge variant={booking.status === "confirmed" ? "default" : "outline"}>{booking.status}</Badge>
                        </div>
                        
                        <div className="flex gap-2">
                          <Select onValueChange={(val) => handleStatusUpdate(booking.id, val)} defaultValue={booking.status}>
                            <SelectTrigger className="w-[110px] h-8 text-xs">
                              <SelectValue placeholder={t('dashboard.status')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">{t('dashboard.status.pending')}</SelectItem>
                              <SelectItem value="confirmed">{t('dashboard.status.confirmed')}</SelectItem>
                              <SelectItem value="completed">{t('dashboard.status.completed')}</SelectItem>
                              <SelectItem value="cancelled">{t('dashboard.status.cancelled')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteBooking(booking.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">{t('dashboard.serviceCatalog')}</h3>
                  <Button onClick={() => { setShowAddServiceForm(true); setEditingService(null); }}><Plus className="w-4 h-4 mr-2" />{t('dashboard.addService')}</Button>
                </div>

                {(showAddServiceForm || editingService) && (
                  <Card className="mb-8 p-6 bg-muted/30 border-primary/20">
                    <h4 className="font-semibold mb-4">{editingService ? t('dashboard.editService') : t('dashboard.newService')}</h4>
                    <form onSubmit={editingService ? handleUpdateService : handleAddService} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t('dashboard.serviceName')} *</Label>
                          <Input value={editingService ? editingService.name : newService.name} onChange={e => editingService ? setEditingService({ ...editingService, name: e.target.value }) : setNewService({ ...newService, name: e.target.value })} placeholder="e.g., Wedding Photography" required />
                        </div>
                        <div className="space-y-2">
                          <Label>{t('label.price')} *</Label>
                          <Input value={editingService ? editingService.price : newService.price} onChange={e => editingService ? setEditingService({ ...editingService, price: e.target.value }) : setNewService({ ...newService, price: e.target.value })} placeholder="e.g., ₦120,000" required />
                        </div>
                        <div className="space-y-2">
                          <Label>{t('dashboard.duration')} *</Label>
                          <Input value={editingService ? editingService.duration : newService.duration} onChange={e => editingService ? setEditingService({ ...editingService, duration: e.target.value }) : setNewService({ ...newService, duration: e.target.value })} placeholder="e.g., 8 hours" required />
                        </div>
                        {/* Validation Fix: Textarea no longer 'required' */}
                        <div className="space-y-2">
                          <Label>{t('dashboard.description')}</Label>
                          <Textarea 
                            value={editingService ? editingService.description : newService.description} 
                            onChange={e => editingService ? setEditingService({ ...editingService, description: e.target.value }) : setNewService({ ...newService, description: e.target.value })} 
                            placeholder="Brief description (optional)" 
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button type="submit">{editingService ? t('common.update') : t('common.save')}</Button>
                          <Button variant="outline" onClick={() => { setShowAddServiceForm(false); setEditingService(null); }}>{t('common.cancel')}</Button>
                        </div>
                      </div>
                    </form>
                  </Card>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <Card key={service.id} className="p-4 border-l-4 border-l-primary">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-bold">{service.title}</h4>
                          <Badge>₦{service.price.toLocaleString()}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{service.description}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{service.duration}</span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => handleEditService(service)}><Edit className="w-3 h-3 mr-1" />{t('common.edit')}</Button>
                          <Button variant="ghost" size="sm" className="text-destructive h-8 px-2" onClick={() => handleDeleteService(service.id)}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="calendar">
              <Card className="p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h3 className="text-xl font-bold">Schedule</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast({ title: "Coming Soon", description: "Google Calendar sync is coming soon!" })}>
                      Sync Calendar
                    </Button>
                    <Button size="sm" onClick={() => setAvailabilityDialog(true)}>Add Slot</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {[...bookings].sort((a,b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime()).map((b) => (
                    <div key={b.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded text-center min-w-[50px]">
                          <span className="block text-xs font-bold uppercase text-primary">{new Date(b.booking_date).toLocaleString('default', { month: 'short' })}</span>
                          <span className="block text-lg font-bold">{new Date(b.booking_date).getDate()}</span>
                        </div>
                        <div>
                          <p className="font-medium">{b.notes?.split('\n')[0] || 'Booking'}</p>
                          <p className="text-xs text-muted-foreground">{b.booking_time || 'All Day'}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive h-8" onClick={() => handleDeleteBooking(b.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {bookings.length === 0 && <p className="text-center text-muted-foreground py-8">No upcoming bookings.</p>}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 shadow-sm border-muted/40">
                  <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/5 pb-4">
                    <CardTitle className="text-xl font-bold flex items-center">
                      <User className="w-5 h-5 mr-2 text-primary" />
                      {t('profile.info')}
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => navigate('/profile/settings')}>
                      <Edit className="w-4 h-4 mr-2" /> {t('profile.edit')}
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-y-6 gap-x-8">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('profile.fullName')}</p>
                        <p className="font-medium text-lg">{profileData.firstName} {profileData.lastName || '(Not Set)'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('label.specialties')}</p>
                        <div className="flex items-center space-x-2">
                          <Briefcase className="w-4 h-4 text-primary" />
                          <p className="font-medium">{profileData.specialties}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('label.email')}</p>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-primary" />
                          <p className="font-medium">{profileData.email}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('label.phone')}</p>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <p className="font-medium">{profileData.phone || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('label.location')}</p>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <p className="font-medium">{profileData.location || 'Not set'}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('label.experience')}</p>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-primary fill-primary/20" />
                          <p className="font-medium">{profileData.experience}</p>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('label.equipment')}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground italic">
                        {profileData.equipment || "No equipment has been added yet. Add one to help potential clients get to know your gear!"}
                      </p>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('label.bio')}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground italic">
                        {profileData.bio || "No bio has been added yet. Add one to help potential clients get to know your style!"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="shadow-sm border-muted/40">
                    <CardHeader className="border-b bg-muted/5 pb-4">
                      <CardTitle className="text-lg font-bold">{t('profile.accountStatus')}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{t('profile.verified')}</span>
                        {profileData.verified ? (
                          <Badge variant="default" className="bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>
                        ) : (
                          <Badge variant="outline">Unverified</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{t('profile.publicProfile')}</span>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Marketplace Status</span>
                        {profileData.available ? (
                          <Badge className="bg-blue-600">Available for Hire</Badge>
                        ) : (
                          <Badge variant="destructive">Unavailable</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-primary/5 border-primary/10">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-2">
                        <Camera className="w-8 h-8 text-primary mx-auto mb-2" />
                        <h4 className="font-bold">Share Your Portfolio</h4>
                        <p className="text-xs text-muted-foreground mb-4">Sharing your custom URL with clients can increase bookings by 40%.</p>
                        <Button size="sm" className="w-full" variant="outline" onClick={handleCopyProfileLink}>
                          <LinkIcon className="w-4 h-4 mr-2" /> {t('action.copyLink')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4">{t('settings.account')}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('settings.emailNotifications')}</p>
                        <p className="text-sm text-muted-foreground">Receive booking updates via email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t('settings.smsNotifications')}</p>
                        <p className="text-sm text-muted-foreground">Receive urgent updates via SMS</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-Accept Bookings</p>
                        <p className="text-sm text-muted-foreground">Automatically accept matching requests</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Public Profile</p>
                        <p className="text-sm text-muted-foreground">Show profile in search results</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </Card>

                <Card className="p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4">{t('settings.payment')}</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bankAccount">Bank Account</Label>
                      <Input id="bankAccount" defaultValue="****1234" />
                    </div>
                    <div>
                      <Label htmlFor="taxId">Tax ID</Label>
                      <Input id="taxId" defaultValue="12345678" />
                    </div>
                    <div>
                      <Label htmlFor="currency">Default Currency</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ngn">Nigerian Naira (₦)</SelectItem>
                          <SelectItem value="usd">US Dollar ($)</SelectItem>
                          <SelectItem value="eur">Euro (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleUpdatePayment}>
                      {t('settings.updatePayment')}
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

      </main >

      <AvailabilityDialog
        isOpen={availabilityDialog}
        onClose={() => setAvailabilityDialog(false)}
        userId={user?.id}
        onSuccess={() => {
          fetchBookings();
          toast({ title: "Availability Updated" });
        }}
      />

      <Lightbox
        images={portfolioImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div >
  );
};

export default Dashboard;