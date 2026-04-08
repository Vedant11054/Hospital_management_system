import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { useStatistics } from "@/hooks/use-statistics";
import { FormDialog } from "@/components/FormDialog";
import { AddHospitalForm } from "@/components/forms/AddHospitalForm";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  DollarSign,
  Activity,
  Settings,
  FileText,
  Shield,
  TrendingUp,
  UserPlus,
  AlertCircle,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Search,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/super-admin" },
  { icon: Building2, label: "Hospitals", href: "/super-admin/hospitals" },
  { icon: Users, label: "Users", href: "/super-admin/users" },
  { icon: DollarSign, label: "Billing", href: "/super-admin/billing" },
  { icon: Activity, label: "Analytics", href: "/super-admin/analytics" },
  { icon: Shield, label: "Audit Logs", href: "/super-admin/audit" },
  { icon: Settings, label: "Settings", href: "/super-admin/settings" },
];

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-600 border border-amber-500/30",
  inactive: "bg-red-500/15 text-red-600 border border-red-500/30",
};

const SuperAdminDashboard = () => {
  const { stats } = useStatistics();
  const { toast } = useToast();
  const location = useLocation();

  const [user, setUser] = useState<any>(null);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [showAddHospital, setShowAddHospital] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const activeSection = location.pathname.replace("/super-admin", "").replace("/", "") || "dashboard";

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    setLoadingHospitals(true);
    try {
      const res = await fetch("http://localhost:3001/api/hospitals/list");
      const data = await res.json();
      if (data.success) setHospitals(data.hospitals || []);
    } catch (err) {
      toast({ title: "Error", description: "Could not load hospitals.", variant: "destructive" });
    } finally {
      setLoadingHospitals(false);
    }
  };

  const filtered = hospitals.filter(
    (h) =>
      h.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.adminEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userName = user?.name || "Admin";

  const HospitalsTable = ({ showSearch = false }: { showSearch?: boolean }) => (
    <div className="bg-card rounded-xl border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Registered Hospitals</h2>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-muted-foreground">{hospitals.length} total</span>
          <Button variant="ghost" size="sm" onClick={fetchHospitals} disabled={loadingHospitals}>
            <RefreshCw className={`w-4 h-4 ${loadingHospitals ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>
      {showSearch && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Search hospitals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-3 font-medium text-muted-foreground">Hospital</th>
              <th className="text-left py-3 px-3 font-medium text-muted-foreground">Contact</th>
              <th className="text-left py-3 px-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-3 font-medium text-muted-foreground">Plan</th>
            </tr>
          </thead>
          <tbody>
            {loadingHospitals ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-muted-foreground">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-muted-foreground">
                  <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  {searchQuery ? "No hospitals match your search." : "No hospitals registered yet."}
                  {!searchQuery && (
                    <><br /><button className="text-primary underline mt-1 text-sm" onClick={() => setShowAddHospital(true)}>Add the first one</button></>
                  )}
                </td>
              </tr>
            ) : (
              filtered.map((hospital, index) => (
                <tr key={hospital.id || index} className="border-b hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-medium">{hospital.name}</p>
                    {hospital.address && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />{hospital.address}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {hospital.adminEmail && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />{hospital.adminEmail}
                      </p>
                    )}
                    {hospital.phone && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />{hospital.phone}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[hospital.status?.toLowerCase() || "active"]}`}>
                      {hospital.status || "active"}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {hospital.plan || "Basic"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "hospitals":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Hospitals</h1>
                <p className="text-muted-foreground">Manage all registered hospitals on the platform</p>
              </div>
              <Button variant="hero" onClick={() => setShowAddHospital(true)}>
                <Building2 className="w-4 h-4" />Add Hospital
              </Button>
            </div>
            <HospitalsTable showSearch />
          </div>
        );

      case "users":
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Users</h1>
              <p className="text-muted-foreground">All users registered on the platform</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatCard title="Total Users" value={stats?.totalUsers ?? "—"} change="All roles" changeType="neutral" icon={Users} />
              <StatCard title="Hospitals" value={hospitals.length} change="Registered" changeType="neutral" icon={Building2} />
              <StatCard title="Active Sessions" value="1,234" change="Real-time" changeType="neutral" icon={Activity} />
            </div>
            <div className="bg-card border rounded-xl p-6">
              <h2 className="font-semibold mb-4">Hospital Admins</h2>
              {hospitals.length === 0 ? (
                <p className="text-muted-foreground text-sm">No hospitals registered yet.</p>
              ) : (
                <div className="space-y-3">
                  {hospitals.map((h, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/40">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{h.adminEmail}</p>
                          <p className="text-xs text-muted-foreground">{h.name} · Hospital Admin</p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">hospital_admin</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "billing":
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Billing</h1>
              <p className="text-muted-foreground">Platform revenue and billing overview</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <StatCard title="Monthly Revenue" value="$284,500" change="+12.5% this month" changeType="positive" icon={DollarSign} />
              <StatCard title="Active Subscriptions" value={hospitals.length} change="Hospitals on plan" changeType="neutral" icon={CheckCircle2} iconColor="text-emerald-500" />
              <StatCard title="Pending Payments" value={hospitals.filter(h => h.status === "pending").length} change="Require action" changeType="neutral" icon={AlertCircle} iconColor="text-amber-500" />
            </div>
            <div className="bg-card border rounded-xl p-6">
              <h2 className="font-semibold mb-4">Subscription Plans</h2>
              <div className="space-y-3">
                {["Basic", "Pro", "Enterprise"].map((plan) => {
                  const count = hospitals.filter(h => (h.plan || "Basic") === plan).length;
                  return (
                    <div key={plan} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <span className="font-medium text-sm">{plan}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{count} hospital{count !== 1 ? "s" : ""}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{plan}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "analytics":
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Analytics</h1>
              <p className="text-muted-foreground">Platform-wide usage and growth trends</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard title="Total Hospitals" value={hospitals.length} change="All time" changeType="neutral" icon={Building2} />
              <StatCard title="Total Users" value={stats?.totalUsers ?? "—"} change="All roles" changeType="neutral" icon={Users} />
              <StatCard title="Active Hospitals" value={hospitals.filter(h => h.status === "active").length} change="Currently active" changeType="positive" icon={CheckCircle2} iconColor="text-emerald-500" />
              <StatCard title="Pending Hospitals" value={hospitals.filter(h => h.status === "pending").length} change="Need activation" changeType="neutral" icon={AlertCircle} iconColor="text-amber-500" />
            </div>
            <div className="bg-card border rounded-xl p-6">
              <h2 className="font-semibold mb-4">Hospital Status Breakdown</h2>
              <div className="space-y-3">
                {["active", "pending", "inactive"].map((status) => {
                  const count = hospitals.filter(h => (h.status || "active") === status).length;
                  const pct = hospitals.length ? Math.round((count / hospitals.length) * 100) : 0;
                  return (
                    <div key={status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize font-medium">{status}</span>
                        <span className="text-muted-foreground">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${status === "active" ? "bg-emerald-500" : status === "pending" ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "audit":
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Audit Logs</h1>
              <p className="text-muted-foreground">Track platform actions and changes</p>
            </div>
            <div className="bg-card border rounded-xl p-6">
              <h2 className="font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {hospitals.slice(0, 8).map((h, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Hospital registered: {h.name}</p>
                      <p className="text-xs text-muted-foreground">{h.adminEmail}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${statusColors[h.status || "active"]}`}>{h.status || "active"}</span>
                  </div>
                ))}
                {hospitals.length === 0 && <p className="text-muted-foreground text-sm text-center py-6">No audit entries yet.</p>}
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Platform configuration and preferences</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Account</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <input className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" defaultValue={userName} readOnly />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Role</label>
                    <input className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-muted text-sm" value="Super Admin" readOnly />
                  </div>
                </div>
              </div>
              <div className="bg-card border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Platform</h2>
                <div className="space-y-3">
                  {["Email Notifications", "System Alerts", "Billing Reminders"].map((setting) => (
                    <div key={setting} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm">{setting}</span>
                      <div className="w-10 h-5 rounded-full bg-primary flex items-center justify-end pr-0.5 cursor-pointer">
                        <div className="w-4 h-4 rounded-full bg-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      // Default: dashboard overview
      default:
        return (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
                <p className="text-muted-foreground">Platform-wide overview and management</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={fetchHospitals} disabled={loadingHospitals}>
                  <RefreshCw className={`w-4 h-4 ${loadingHospitals ? "animate-spin" : ""}`} />Refresh
                </Button>
                <Button variant="hero" onClick={() => setShowAddHospital(true)}>
                  <Building2 className="w-4 h-4" />Add Hospital
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard title="Total Hospitals" value={stats?.totalHospitals ?? hospitals.length} change="Live" changeType="neutral" icon={Building2} />
              <StatCard title="Total Users" value={stats?.totalUsers ?? "—"} change="Live" changeType="neutral" icon={Users} />
              <StatCard title="Monthly Revenue" value="$284,500" change="+12.5% this month" changeType="positive" icon={DollarSign} />
              <StatCard title="Active Sessions" value="1,234" change="Real-time" changeType="neutral" icon={Activity} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <HospitalsTable />
              </div>
              <div className="space-y-6">
                <div className="bg-card border rounded-xl p-6">
                  <h2 className="font-semibold mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={() => setShowAddHospital(true)}>
                      <UserPlus className="w-4 h-4" />Onboard Hospital
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Report Generated", description: `Platform report for ${hospitals.length} hospitals exported.` })}>
                      <FileText className="w-4 h-4" />Generate Reports
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Settings", description: "Navigate to Settings from the sidebar." })}>
                      <Settings className="w-4 h-4" />System Settings
                    </Button>
                  </div>
                </div>
                <div className="bg-card border rounded-xl p-6">
                  <h2 className="font-semibold mb-4">System Alerts</h2>
                  <div className="space-y-3">
                    {hospitals.filter(h => h.status === "pending").length > 0 && (
                      <div className="flex gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                        <div>
                          <p className="text-sm font-medium">Pending Hospitals</p>
                          <p className="text-xs text-muted-foreground">{hospitals.filter(h => h.status === "pending").length} hospitals awaiting activation</p>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Platform Running</p>
                        <p className="text-xs text-muted-foreground">{hospitals.length} hospital{hospitals.length !== 1 ? "s" : ""} registered</p>
                      </div>
                    </div>
                    <div className="flex gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <p className="text-sm font-medium">System Status</p>
                        <p className="text-xs text-muted-foreground">All services operational</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <DashboardLayout role="super_admin" userName={userName} navItems={navItems}>
      <FormDialog open={showAddHospital} onOpenChange={setShowAddHospital} title="Add New Hospital">
        <AddHospitalForm onSuccess={() => { fetchHospitals(); setShowAddHospital(false); }} onClose={() => setShowAddHospital(false)} />
      </FormDialog>
      {renderContent()}
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
