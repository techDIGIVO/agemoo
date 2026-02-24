import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Camera, Package, CalendarCheck, TrendingUp, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminAnalytics() {
  const [data, setData] = useState({
    totalUsers: 0,
    totalServices: 0,
    totalGear: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalSubscribers: 0,
    usersByMonth: [] as { month: string; count: number }[],
    bookingsByMonth: [] as { month: string; count: number; revenue: number }[],
    topVendors: [] as { name: string; bookings: number; revenue: number }[],
    topLocations: [] as { location: string; count: number }[],
    servicesByCategory: [] as { category: string; count: number }[],
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("12");

  useEffect(() => {
    const load = async () => {
      try {
        const [
          { count: totalUsers },
          { count: totalServices },
          { count: totalGear },
          { data: bookingsData },
          { count: totalSubscribers },
          { data: profiles },
          { data: servicesData },
        ] = await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("services").select("*", { count: "exact", head: true }),
          supabase.from("gear").select("*", { count: "exact", head: true }),
          supabase.from("bookings").select("id, total_price, status, created_at, vendor_id, booking_date"),
          supabase.from("newsletter_subscriptions").select("*", { count: "exact", head: true }),
          supabase.from("profiles").select("id, name, location, created_at"),
          supabase.from("services").select("id, category"),
        ]);

        const allBookings = bookingsData || [];
        const allProfiles = profiles || [];
        const allServices = servicesData || [];

        const totalRevenue = allBookings.reduce((s, b) => s + (Number(b.total_price) || 0), 0);

        // Users by month (last N months)
        const monthsBack = parseInt(period);
        const now = new Date();
        const usersByMonth: { month: string; count: number }[] = [];
        for (let i = monthsBack - 1; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const label = d.toLocaleDateString("en", { month: "short", year: "2-digit" });
          const count = allProfiles.filter(p => {
            const pd = new Date(p.created_at);
            return pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear();
          }).length;
          usersByMonth.push({ month: label, count });
        }

        // Bookings by month
        const bookingsByMonth: { month: string; count: number; revenue: number }[] = [];
        for (let i = monthsBack - 1; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const label = d.toLocaleDateString("en", { month: "short", year: "2-digit" });
          const monthBookings = allBookings.filter(b => {
            const bd = new Date(b.created_at);
            return bd.getMonth() === d.getMonth() && bd.getFullYear() === d.getFullYear();
          });
          bookingsByMonth.push({
            month: label,
            count: monthBookings.length,
            revenue: monthBookings.reduce((s, b) => s + (Number(b.total_price) || 0), 0),
          });
        }

        // Top vendors by booking count
        const vendorBookings: Record<string, { count: number; revenue: number }> = {};
        allBookings.forEach(b => {
          if (!b.vendor_id) return;
          if (!vendorBookings[b.vendor_id]) vendorBookings[b.vendor_id] = { count: 0, revenue: 0 };
          vendorBookings[b.vendor_id].count++;
          vendorBookings[b.vendor_id].revenue += Number(b.total_price) || 0;
        });
        const profileMap = Object.fromEntries(allProfiles.map(p => [p.id, p]));
        const topVendors = Object.entries(vendorBookings)
          .sort(([, a], [, b]) => b.count - a.count)
          .slice(0, 10)
          .map(([id, stats]) => ({
            name: profileMap[id]?.name || "Unknown",
            ...stats,
          }));

        // Top locations
        const locationCounts: Record<string, number> = {};
        allProfiles.forEach(p => {
          if (p.location) {
            locationCounts[p.location] = (locationCounts[p.location] || 0) + 1;
          }
        });
        const topLocations = Object.entries(locationCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([location, count]) => ({ location, count }));

        // Services by category
        const catCounts: Record<string, number> = {};
        allServices.forEach(s => {
          if (s.category) {
            catCounts[s.category] = (catCounts[s.category] || 0) + 1;
          }
        });
        const servicesByCategory = Object.entries(catCounts)
          .sort(([, a], [, b]) => b - a)
          .map(([category, count]) => ({ category, count }));

        setData({
          totalUsers: totalUsers || 0,
          totalServices: totalServices || 0,
          totalGear: totalGear || 0,
          totalBookings: allBookings.length,
          totalRevenue,
          totalSubscribers: totalSubscribers || 0,
          usersByMonth,
          bookingsByMonth,
          topVendors,
          topLocations,
          servicesByCategory,
        });
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [period]);

  const maxUserMonth = Math.max(...data.usersByMonth.map(m => m.count), 1);
  const maxBookingMonth = Math.max(...data.bookingsByMonth.map(m => m.count), 1);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex justify-end">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6">Last 6 months</SelectItem>
            <SelectItem value="12">Last 12 months</SelectItem>
            <SelectItem value="24">Last 24 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Users", value: data.totalUsers, icon: Users },
          { label: "Services", value: data.totalServices, icon: Camera },
          { label: "Gear", value: data.totalGear, icon: Package },
          { label: "Bookings", value: data.totalBookings, icon: CalendarCheck },
          { label: "Revenue", value: `₦${data.totalRevenue.toLocaleString()}`, icon: TrendingUp },
          { label: "Subscribers", value: data.totalSubscribers, icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <Icon className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xl font-bold">{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Growth Chart (simple bar) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">User Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-1" style={{ height: 160 }}>
            {data.usersByMonth.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-medium">{m.count}</span>
                <div
                  className="w-full bg-primary/80 rounded-t transition-all"
                  style={{ height: `${(m.count / maxUserMonth) * 120}px`, minHeight: m.count > 0 ? 4 : 0 }}
                />
                <span className="text-[9px] text-muted-foreground">{m.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Volume Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bookings per Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-1" style={{ height: 160 }}>
            {data.bookingsByMonth.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-medium">{m.count}</span>
                <div
                  className="w-full bg-green-500/80 rounded-t transition-all"
                  style={{ height: `${(m.count / maxBookingMonth) * 120}px`, minHeight: m.count > 0 ? 4 : 0 }}
                />
                <span className="text-[9px] text-muted-foreground">{m.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Top Vendors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Vendors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.topVendors.length === 0 && <p className="text-sm text-muted-foreground">No data</p>}
            {data.topVendors.map((v, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="truncate">{v.name}</span>
                <span className="text-muted-foreground ml-2">{v.bookings} bookings · ₦{v.revenue.toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-1"><MapPin className="w-4 h-4" /> Top Locations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.topLocations.length === 0 && <p className="text-sm text-muted-foreground">No data</p>}
            {data.topLocations.map((loc, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="truncate">{loc.location}</span>
                <span className="text-muted-foreground">{loc.count} users</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Service Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Service Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.servicesByCategory.length === 0 && <p className="text-sm text-muted-foreground">No data</p>}
            {data.servicesByCategory.map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="truncate">{cat.category}</span>
                <span className="text-muted-foreground">{cat.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
