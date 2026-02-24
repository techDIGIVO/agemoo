import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye, Shield, ShieldOff, Mail, MapPin, Phone, Briefcase, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  name: string | null;
  profession: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  website: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  // Joined data
  email?: string;
  services_count?: number;
  gear_count?: number;
  bookings_count?: number;
}

export default function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userDetail, setUserDetail] = useState<any>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleAdmin = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Role updated", description: `User role set to ${newRole}` });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
  };

  const handleViewUser = async (user: UserProfile) => {
    setSelectedUser(user);
    // Fetch additional details
    const [
      { count: svcCount },
      { count: gearCount },
      { data: bookingsData },
      { data: appData }
    ] = await Promise.all([
      supabase.from("services").select("*", { count: "exact", head: true }).eq("vendor_id", user.id),
      supabase.from("gear").select("*", { count: "exact", head: true }).eq("vendor_id", user.id),
      supabase.from("bookings").select("total_price, status").or(`client_id.eq.${user.id},vendor_id.eq.${user.id}`),
      supabase.from("applications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    ]);

    const totalSpent = (bookingsData || []).reduce((s, b) => s + (b.total_price || 0), 0);

    setUserDetail({
      services: svcCount || 0,
      gear: gearCount || 0,
      bookings: (bookingsData || []).length,
      totalSpent,
      application: appData,
    });
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = !search ||
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.location || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.profession || "").toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, location, profession..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">Users</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden md:table-cell">Profession</TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden lg:table-cell">Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback className="text-xs">
                              {(user.name || "U")[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.name || "Unnamed"}</p>
                            <p className="text-xs text-muted-foreground">{user.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {user.profession || "—"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {user.location || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-[10px]">
                          {user.role || "user"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewUser(user)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleToggleAdmin(user.id, user.role || "user")}
                            title={user.role === "admin" ? "Remove admin" : "Make admin"}
                          >
                            {user.role === "admin" ? (
                              <ShieldOff className="w-4 h-4 text-destructive" />
                            ) : (
                              <Shield className="w-4 h-4 text-primary" />
                            )}
                          </Button>
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

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => { setSelectedUser(null); setUserDetail(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedUser.avatar_url || undefined} />
                  <AvatarFallback className="text-xl">
                    {(selectedUser.name || "U")[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">{selectedUser.name || "Unnamed"}</h3>
                  <Badge variant={selectedUser.role === "admin" ? "default" : "secondary"}>
                    {selectedUser.role || "user"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="w-4 h-4" />
                  {selectedUser.profession || "Not set"}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {selectedUser.location || "Not set"}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {selectedUser.phone || "Not set"}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(selectedUser.created_at).toLocaleDateString()}
                </div>
              </div>

              {selectedUser.bio && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Bio</p>
                  <p className="text-sm">{selectedUser.bio}</p>
                </div>
              )}

              {userDetail && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <Card className="p-3 text-center">
                    <p className="text-2xl font-bold">{userDetail.services}</p>
                    <p className="text-xs text-muted-foreground">Services</p>
                  </Card>
                  <Card className="p-3 text-center">
                    <p className="text-2xl font-bold">{userDetail.gear}</p>
                    <p className="text-xs text-muted-foreground">Gear</p>
                  </Card>
                  <Card className="p-3 text-center">
                    <p className="text-2xl font-bold">{userDetail.bookings}</p>
                    <p className="text-xs text-muted-foreground">Bookings</p>
                  </Card>
                  <Card className="p-3 text-center">
                    <p className="text-2xl font-bold">₦{userDetail.totalSpent.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Value</p>
                  </Card>
                </div>
              )}

              {userDetail?.application && (
                <div className="pt-2 border-t">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Vendor Application</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{userDetail.application.business_name}</span>
                    <Badge variant={
                      userDetail.application.status === "approved" ? "default" :
                      userDetail.application.status === "submitted" ? "outline" : "secondary"
                    }>
                      {userDetail.application.status}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant={selectedUser.role === "admin" ? "destructive" : "default"}
                  size="sm"
                  onClick={() => {
                    handleToggleAdmin(selectedUser.id, selectedUser.role || "user");
                    setSelectedUser(prev => prev ? { ...prev, role: prev.role === "admin" ? "user" : "admin" } : null);
                  }}
                >
                  {selectedUser.role === "admin" ? (
                    <><ShieldOff className="w-4 h-4 mr-1" /> Remove Admin</>
                  ) : (
                    <><Shield className="w-4 h-4 mr-1" /> Make Admin</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
