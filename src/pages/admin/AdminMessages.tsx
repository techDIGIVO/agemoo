import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Eye, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminMessages() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [msgs, setMsgs] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("conversations")
          .select("*")
          .order("updated_at", { ascending: false });

        if (error) throw error;

        const userIds = [...new Set((data || []).flatMap(c => [c.participant_1, c.participant_2]).filter(Boolean))];
        let profileMap: Record<string, any> = {};
        if (userIds.length > 0) {
          const { data: pData } = await supabase.from("profiles").select("id, name, avatar_url").in("id", userIds);
          profileMap = Object.fromEntries((pData || []).map(p => [p.id, p]));
        }

        setConversations(data || []);
        setProfiles(profileMap);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleViewConversation = async (conv: any) => {
    setSelected(conv);
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conv.id)
      .order("created_at", { ascending: true })
      .limit(50);
    setMsgs(data || []);
  };

  const filtered = conversations.filter(c => {
    if (!search) return true;
    const p1 = profiles[c.participant_1]?.name || "";
    const p2 = profiles[c.participant_2]?.name || "";
    return p1.toLowerCase().includes(search.toLowerCase()) || p2.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{conversations.length}</p>
            <p className="text-xs text-muted-foreground">Total Conversations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{new Set(conversations.flatMap(c => [c.participant_1, c.participant_2]).filter(Boolean)).size}</p>
            <p className="text-xs text-muted-foreground">Users in Conversations</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by participant name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{filtered.length} conversation{filtered.length !== 1 ? "s" : ""}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant 1</TableHead>
                    <TableHead>Participant 2</TableHead>
                    <TableHead className="hidden md:table-cell">Last Activity</TableHead>
                    <TableHead className="hidden md:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="text-sm font-medium">{profiles[c.participant_1]?.name || "Unknown"}</TableCell>
                      <TableCell className="text-sm font-medium">{profiles[c.participant_2]?.name || "Unknown"}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {c.updated_at ? new Date(c.updated_at).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewConversation(c)}>
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

      {/* Conversation Dialog */}
      <Dialog open={!!selected} onOpenChange={() => { setSelected(null); setMsgs([]); }}>
        <DialogContent className="max-w-lg max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Conversation
            </DialogTitle>
            <DialogDescription>
              {selected && `${profiles[selected.participant_1]?.name || "User"} ↔ ${profiles[selected.participant_2]?.name || "User"}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {msgs.length === 0 && <p className="text-center text-muted-foreground text-sm py-4">No messages in this conversation.</p>}
            {msgs.map((m) => (
              <div key={m.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-[10px]">
                    {profiles[m.sender_id]?.name || "Unknown"}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(m.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm">{m.content}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
