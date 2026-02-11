import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, ArrowLeft, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";

const DashboardBookings = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .or(`client_id.eq.${user.id},vendor_id.eq.${user.id}`)
      .order('booking_date', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      toast({
        variant: "destructive",
        title: t('action.error'),
        description: "Failed to fetch bookings"
      });
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming") return booking.status === "confirmed" || booking.status === "pending";
    if (activeTab === "past") return booking.status === "completed" || booking.status === "cancelled";
    return booking.status === activeTab;
  });

  if (!user) return null;

  return (
    <>
      <Header />
      <main className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-3xl font-bold">{t('bookings.myBookings')}</h1>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">{t('bookings.all')}</TabsTrigger>
              <TabsTrigger value="upcoming">{t('bookings.upcoming')}</TabsTrigger>
              <TabsTrigger value="past">{t('bookings.past')}</TabsTrigger>
              <TabsTrigger value="pending">{t('dashboard.status.pending')}</TabsTrigger>
              <TabsTrigger value="confirmed">{t('dashboard.status.confirmed')}</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{t('bookings.loadingBookings')}</p>
                </div>
              ) : filteredBookings.length === 0 ? (
                <Card className="p-12">
                  <div className="text-center">
                    <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{t('bookings.noBookingsFound')}</h3>
                    <p className="text-muted-foreground mb-6">
                      {activeTab === "all" 
                        ? t('bookings.noBookingsYet')
                        : t('bookings.noFilteredBookings').replace('{filter}', activeTab)
                      }
                    </p>
                    <Button onClick={() => navigate('/services')}>
                      {t('action.browseServices')}
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => (
                    <Card key={booking.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">{t('bookings.bookingId')}{booking.id.slice(0, 8)}</h3>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>{new Date(booking.booking_date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}</span>
                            </div>
                            
                            {booking.booking_time && (
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                <span>{booking.booking_time}</span>
                              </div>
                            )}
                            
                            {booking.duration && (
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                <span>{t('dashboard.duration')}: {booking.duration}</span>
                              </div>
                            )}
                            
                            {booking.notes && (
                              <div className="mt-3">
                                <p className="text-sm"><strong>{t('dashboard.notes')}:</strong> {booking.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary mb-4">
                            ₦{booking.total_price.toLocaleString()}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/messages')}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            {t('common.message')}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DashboardBookings;
