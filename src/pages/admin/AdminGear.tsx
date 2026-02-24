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

export default function AdminGear() {
  const { toast } = useToast();
  const [gear, setGear] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("gear")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        const vendorIds = [...new Set((data || []).map(g => g.vendor_id).filter(Boolean))];
        let profileMap: Record<string, any> = {};
        if (vendorIds.length > 0) {
          const { data: pData } = await supabase.from("profiles").select("id, name").in("id", vendorIds);
          profileMap = Object.fromEntries((pData || []).map(p => [p.id, p]));
        }

        setGear(data || []);
        setProfiles(profileMap);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = ["all", ...new Set(gear.map(g => g.category).filter(Boolean))];

  const handleToggleAvailable = async (id: string, current: boolean) => {
    const { error } = await supabase.from("gear").update({ is_available: !current }).eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setGear(prev => prev.map(g => g.id === id ? { ...g, is_available: !current } : g));
      toast({ title: current ? "Gear marked unavailable" : "Gear marked available" });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("gear").delete().eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setGear(prev => prev.filter(g => g.id !== id));
      toast({ title: "Gear deleted" });
    }
  };

  const filtered = gear.filter(g => {
    const matchesSearch = !search ||
      g.title.toLowerCase().includes(search.toLowerCase()) ||
      (profiles[g.vendor_id]?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "all" || g.category === categoryFilter;
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
          <CardTitle className="text-base">{filtered.length} gear item{filtered.length !== 1 ? "s" : ""}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gear</TableHead>
                    <TableHead className="hidden md:table-cell">Owner</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead>Price/Day</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((g) => (
                    <TableRow key={g.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {g.image_url && (
                            <img src={g.image_url} alt="" className="w-8 h-8 rounded object-cover" />
                          )}
                          <p className="font-medium text-sm">{g.title}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {profiles[g.vendor_id]?.name || "Unknown"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary" className="text-[10px]">{g.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium text-sm">₦{Number(g.price_per_day).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={g.is_available ? "default" : "destructive"} className="text-[10px]">
                          {g.is_available ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{g.location}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleAvailable(g.id, g.is_available)} title={g.is_available ? "Mark unavailable" : "Mark available"}>
                            {g.is_available ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(g.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <a href={`/gear/${g.slug}`} target="_blank" rel="noreferrer">
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
