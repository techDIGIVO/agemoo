import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, Key, Globe, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/hooks/useAdmin";

export default function AdminSettings() {
  const { toast } = useToast();
  const { user } = useAdmin();
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [promoting, setPromoting] = useState(false);

  const handlePromoteAdmin = async () => {
    if (!newAdminEmail.trim()) return;

    setPromoting(true);
    try {
      // Look up user by searching profiles — we don't have direct email access from profiles
      // so we'll search by email in auth (admin-only via service role) or let them use user ID
      // For now, search profiles by name or use direct ID approach
      const { data: profiles, error: searchErr } = await supabase
        .from("profiles")
        .select("id, name")
        .ilike("name", `%${newAdminEmail.trim()}%`)
        .limit(1);

      if (searchErr) throw searchErr;

      if (!profiles || profiles.length === 0) {
        toast({ variant: "destructive", title: "User not found", description: "No user found matching that name." });
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", profiles[0].id);

      if (error) throw error;

      toast({ title: "Admin promoted", description: `${profiles[0].name} is now an admin.` });
      setNewAdminEmail("");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setPromoting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Admin Account */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Shield className="w-4 h-4" /> Admin Account</CardTitle>
          <CardDescription>Your admin account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{user?.email || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">User ID</span>
            <span className="font-mono text-xs">{user?.id || "—"}</span>
          </div>
        </CardContent>
      </Card>

      {/* Promote Admin */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Key className="w-4 h-4" /> Promote Admin</CardTitle>
          <CardDescription>Grant admin access to another user by their display name</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="admin-name" className="sr-only">User name</Label>
              <Input
                id="admin-name"
                placeholder="Enter user's display name..."
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
              />
            </div>
            <Button onClick={handlePromoteAdmin} disabled={promoting || !newAdminEmail.trim()}>
              {promoting ? "Promoting..." : "Promote"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            This searches profiles by name and promotes the first match. For precise control, use the Users page to toggle admin status.
          </p>
        </CardContent>
      </Card>

      <Separator />

      {/* Platform Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Globe className="w-4 h-4" /> Platform</CardTitle>
          <CardDescription>Agemoo platform configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Platform</span>
            <span className="font-medium">Agemoo — Totuna</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Database</span>
            <span className="font-medium">Supabase (PostgreSQL)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Hosting</span>
            <span className="font-medium">Vercel</span>
          </div>
        </CardContent>
      </Card>

      {/* Notifications hint */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</CardTitle>
          <CardDescription>Email notification settings</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Email notifications for new bookings, support tickets, and user signups will be available
            once an email service (e.g., Resend, SendGrid) is configured.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
