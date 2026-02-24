import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AdminBookings() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [services, setServices] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        const vendorIds = [...new Set((data || []).flatMap(b => [b.vendor_id, b.client_id]).filter(Boolean))];
        const serviceIds = [...new Set((data || []).map(b => b.service_id).filter(Boolean))];

        let profileMap: Record<string, any> = {};
        let serviceMap: Record<string, any> = {};

        if (vendorIds.length > 0) {
          const { data: pData } = await supabase.from("profiles").select("id, name").in("id", vendorIds);
          profileMap = Object.fromEntries((pData || []).map(p => [p.id, p]));
        }

        if (serviceIds.length > 0) {
          const { data: sData } = await supabase.from("services").select("id, title").in("id", serviceIds);
          serviceMap = Object.fromEntries((sData || []).map(s => [s.id, s]));
        }

        setBookings(data || []);
        setProfiles(profileMap);
        setServices(serviceMap);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      if (selected?.id === id) setSelected((prev: any) => ({ ...prev, status }));
      toast({ title: `Booking marked as ${status}` });
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "default";
      case "pending": return "secondary";
      case "completed": return "default";
      case "cancelled": return "destructive";
      default: return "outline";
    }
  };

  const filtered = bookings.filter(b => {
    const matchesSearch = !search ||
      (profiles[b.vendor_id]?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (profiles[b.client_id]?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (services[b.service_id]?.title || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = filtered.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{bookings.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{bookings.filter(b => b.status === "pending").length}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{bookings.filter(b => b.status === "confirmed").length}</p>
            <p className="text-xs text-muted-foreground">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">₦{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by client, vendor, or service..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{filtered.length} booking{filtered.length !== 1 ? "s" : ""}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead className="hidden md:table-cell">Client</TableHead>
                    <TableHead className="hidden md:table-cell">Vendor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium text-sm">{services[b.service_id]?.title || "—"}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{profiles[b.client_id]?.name || "—"}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{profiles[b.vendor_id]?.name || "—"}</TableCell>
                      <TableCell className="text-sm">{b.booking_date ? new Date(b.booking_date).toLocaleDateString() : "—"}</TableCell>
                      <TableCell className="font-medium text-sm">₦{Number(b.total_price || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={statusColor(b.status)} className="text-[10px]">{b.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelected(b)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Review and manage booking</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Service:</span> <p className="font-medium">{services[selected.service_id]?.title || "—"}</p></div>
                <div><span className="text-muted-foreground">Client:</span> <p className="font-medium">{profiles[selected.client_id]?.name || "—"}</p></div>
                <div><span className="text-muted-foreground">Vendor:</span> <p className="font-medium">{profiles[selected.vendor_id]?.name || "—"}</p></div>
                <div><span className="text-muted-foreground">Booking Date:</span> <p className="font-medium">{selected.booking_date ? new Date(selected.booking_date).toLocaleDateString() : "—"}</p></div>
                <div><span className="text-muted-foreground">Total Price:</span> <p className="font-medium">₦{Number(selected.total_price || 0).toLocaleString()}</p></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant={statusColor(selected.status)} className="mt-1">{selected.status}</Badge></div>
              </div>
              {selected.notes && <div className="text-sm border-t pt-3"><span className="text-muted-foreground">Notes:</span><p className="mt-1">{selected.notes}</p></div>}
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Button size="sm" variant="outline" onClick={() => handleStatusChange(selected.id, "confirmed")} disabled={selected.status === "confirmed"}>
                  <CheckCircle className="w-3 h-3 mr-1" /> Confirm
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleStatusChange(selected.id, "completed")} disabled={selected.status === "completed"}>
                  <Clock className="w-3 h-3 mr-1" /> Complete
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleStatusChange(selected.id, "cancelled")} disabled={selected.status === "cancelled"}>
                  <XCircle className="w-3 h-3 mr-1" /> Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
