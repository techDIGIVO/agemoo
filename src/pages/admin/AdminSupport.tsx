import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Eye, CheckCircle, Clock, AlertCircle, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type TicketStatus = "new" | "in_progress" | "resolved";

export default function AdminSupport() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<any>(null);
  const [adminReply, setAdminReply] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("contact_messages")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTickets(data || []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStatusChange = async (id: string, status: TicketStatus) => {
    const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
      if (selected?.id === id) setSelected((prev: any) => ({ ...prev, status }));
      toast({ title: `Ticket marked as ${status.replace("_", " ")}` });
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "new": return <AlertCircle className="w-3 h-3" />;
      case "in_progress": return <Clock className="w-3 h-3" />;
      case "resolved": return <CheckCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "new": return "destructive" as const;
      case "in_progress": return "secondary" as const;
      case "resolved": return "default" as const;
      default: return "outline" as const;
    }
  };

  const filtered = tickets.filter(t => {
    const matchesSearch = !search ||
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase()) ||
      t.subject?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const newCount = tickets.filter(t => t.status === "new").length;
  const inProgressCount = tickets.filter(t => t.status === "in_progress").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{tickets.length}</p>
            <p className="text-xs text-muted-foreground">Total Tickets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{newCount}</p>
            <p className="text-xs text-muted-foreground">New</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{inProgressCount}</p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{tickets.length - newCount - inProgressCount}</p>
            <p className="text-xs text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name, email, or subject..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{filtered.length} ticket{filtered.length !== 1 ? "s" : ""}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="hidden md:table-cell">From</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((t) => (
                    <TableRow key={t.id} className={t.status === "new" ? "bg-red-50/50 dark:bg-red-950/10" : ""}>
                      <TableCell className="font-medium text-sm max-w-[200px] truncate">{t.subject || "No subject"}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{t.name || "—"}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{t.email || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={statusColor(t.status)} className="text-[10px] gap-1">
                          {statusIcon(t.status)}
                          {(t.status || "new").replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {new Date(t.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelected(t); setAdminReply(""); }}>
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
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Support Ticket
            </DialogTitle>
            <DialogDescription>Review and respond to support ticket</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">From:</span> <p className="font-medium">{selected.name || "—"}</p></div>
                <div><span className="text-muted-foreground">Email:</span> <p className="font-medium">{selected.email || "—"}</p></div>
                <div><span className="text-muted-foreground">Subject:</span> <p className="font-medium">{selected.subject || "No subject"}</p></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant={statusColor(selected.status)} className="mt-1">{(selected.status || "new").replace("_", " ")}</Badge></div>
                <div><span className="text-muted-foreground">Date:</span> <p className="font-medium">{new Date(selected.created_at).toLocaleString()}</p></div>
              </div>

              <div className="border-t pt-3">
                <span className="text-sm text-muted-foreground">Message:</span>
                <p className="mt-1 text-sm bg-muted/50 rounded p-3">{selected.message}</p>
              </div>

              {/* Reply (mailto) */}
              {selected.email && (
                <div className="border-t pt-3 space-y-2">
                  <span className="text-sm text-muted-foreground">Quick reply via email:</span>
                  <Textarea
                    placeholder="Type your reply..."
                    value={adminReply}
                    onChange={(e) => setAdminReply(e.target.value)}
                    rows={3}
                  />
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || "Your support request")}&body=${encodeURIComponent(adminReply)}`}
                    className="inline-block"
                  >
                    <Button size="sm" disabled={!adminReply.trim()}>
                      <MessageSquare className="w-3 h-3 mr-1" /> Send Email Reply
                    </Button>
                  </a>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Button size="sm" variant="outline" onClick={() => handleStatusChange(selected.id, "in_progress")} disabled={selected.status === "in_progress"}>
                  <Clock className="w-3 h-3 mr-1" /> Mark In Progress
                </Button>
                <Button size="sm" variant="default" onClick={() => handleStatusChange(selected.id, "resolved")} disabled={selected.status === "resolved"}>
                  <CheckCircle className="w-3 h-3 mr-1" /> Mark Resolved
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleStatusChange(selected.id, "new")} disabled={selected.status === "new"}>
                  <AlertCircle className="w-3 h-3 mr-1" /> Reopen
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
