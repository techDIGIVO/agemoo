import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, EyeOff, Trash2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AdminServices() {
  const { toast } = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        const vendorIds = [...new Set((data || []).map(s => s.vendor_id).filter(Boolean))];
        let profileMap: Record<string, any> = {};
        if (vendorIds.length > 0) {
          const { data: pData } = await supabase.from("profiles").select("id, name").in("id", vendorIds);
          profileMap = Object.fromEntries((pData || []).map(p => [p.id, p]));
        }

        setServices(data || []);
        setProfiles(profileMap);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = ["all", ...new Set(services.map(s => s.category).filter(Boolean))];

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const { error } = await supabase.from("services").update({ is_active: !currentActive }).eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setServices(prev => prev.map(s => s.id === id ? { ...s, is_active: !currentActive } : s));
      toast({ title: currentActive ? "Service deactivated" : "Service activated" });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setServices(prev => prev.filter(s => s.id !== id));
      toast({ title: "Service deleted" });
    }
  };

  const filtered = services.filter(s => {
    const matchesSearch = !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (profiles[s.vendor_id]?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "all" || s.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by title or vendor..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>{c === "all" ? "All Categories" : c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{filtered.length} service{filtered.length !== 1 ? "s" : ""}</CardTitle>
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
                    <TableHead className="hidden md:table-cell">Vendor</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{s.title}</p>
                          {s.duration && <p className="text-xs text-muted-foreground">{s.duration}</p>}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {profiles[s.vendor_id]?.name || "Unknown"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary" className="text-[10px]">{s.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium text-sm">₦{Number(s.price).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={s.is_active ? "default" : "destructive"} className="text-[10px]">
                          {s.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {new Date(s.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleActive(s.id, s.is_active)} title={s.is_active ? "Deactivate" : "Activate"}>
                            {s.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(s.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <a href={`/service/${s.slug}`} target="_blank" rel="noreferrer">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </a>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
