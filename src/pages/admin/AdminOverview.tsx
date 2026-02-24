import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users, Briefcase, Package, Calendar, Mail, MessageSquare,
  TrendingUp, DollarSign, UserPlus, AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Stats {
  totalUsers: number;
  totalServices: number;
  totalGear: number;
  totalBookings: number;
  totalRevenue: number;
  subscribers: number;
  contactMessages: number;
  pendingApplications: number;
  newUsersThisMonth: number;
  pendingBookings: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0, totalServices: 0, totalGear: 0, totalBookings: 0,
    totalRevenue: 0, subscribers: 0, contactMessages: 0,
    pendingApplications: 0, newUsersThisMonth: 0, pendingBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [
          { count: userCount },
          { count: serviceCount },
          { count: gearCount },
          { data: bookingsData },
          { count: subCount },
          { count: contactCount },
          { count: pendingAppCount },
          { data: recentBookingsData },
          { data: recentContactData }
        ] = await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("services").select("*", { count: "exact", head: true }),
          supabase.from("gear").select("*", { count: "exact", head: true }),
          supabase.from("bookings").select("total_price, status"),
          supabase.from("newsletter_subscriptions").select("*", { count: "exact", head: true }).eq("is_active", true),
          supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("applications").select("*", { count: "exact", head: true }).eq("status", "submitted"),
          supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(5),
          supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(5),
        ]);

        const totalRevenue = (bookingsData || []).reduce((s, b) => s + (b.total_price || 0), 0);
        const pendingBookings = (bookingsData || []).filter(b => b.status === "pending").length;

        setStats({
          totalUsers: userCount || 0,
          totalServices: serviceCount || 0,
          totalGear: gearCount || 0,
          totalBookings: (bookingsData || []).length,
          totalRevenue,
          subscribers: subCount || 0,
          contactMessages: contactCount || 0,
          pendingApplications: pendingAppCount || 0,
          newUsersThisMonth: 0, // Would need date filter on profiles
          pendingBookings,
        });
        setRecentBookings(recentBookingsData || []);
        setRecentMessages(recentContactData || []);
      } catch (err) {
        console.error("Error loading admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading dashboard...</div>;
  }

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Services", value: stats.totalServices, icon: Briefcase, color: "text-green-600", bg: "bg-green-50" },
    { label: "Gear Listings", value: stats.totalGear, icon: Package, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Total Bookings", value: stats.totalBookings, icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Revenue", value: `₦${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Subscribers", value: stats.subscribers, icon: Mail, color: "text-pink-600", bg: "bg-pink-50" },
    { label: "Support Tickets", value: stats.contactMessages, icon: MessageSquare, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Pending Apps", value: stats.pendingApplications, icon: UserPlus, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bg} ${stat.color} p-2.5 rounded-lg`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts row */}
      {(stats.pendingBookings > 0 || stats.contactMessages > 0 || stats.pendingApplications > 0) && (
        <div className="flex flex-wrap gap-3">
          {stats.pendingBookings > 0 && (
            <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 py-1.5 px-3">
              <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
              {stats.pendingBookings} pending bookings
            </Badge>
          )}
          {stats.contactMessages > 0 && (
            <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50 py-1.5 px-3">
              <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
              {stats.contactMessages} unread support messages
            </Badge>
          )}
          {stats.pendingApplications > 0 && (
            <Badge variant="outline" className="text-indigo-600 border-indigo-300 bg-indigo-50 py-1.5 px-3">
              <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
              {stats.pendingApplications} pending vendor applications
            </Badge>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Recent Bookings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentBookings.length > 0 ? recentBookings.map((b: any) => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm">
                <div>
                  <p className="font-medium">#{b.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">{new Date(b.booking_date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₦{(b.total_price || 0).toLocaleString()}</p>
                  <Badge variant={b.status === "confirmed" ? "default" : b.status === "pending" ? "outline" : "secondary"} className="text-[10px]">
                    {b.status}
                  </Badge>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-4">No bookings yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Support Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Recent Support Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMessages.length > 0 ? recentMessages.map((m: any) => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{m.subject}</p>
                  <p className="text-xs text-muted-foreground">{m.name} • {m.email}</p>
                </div>
                <Badge variant={m.status === "new" ? "destructive" : "secondary"} className="ml-2 text-[10px]">
                  {m.status}
                </Badge>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-4">No messages yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
