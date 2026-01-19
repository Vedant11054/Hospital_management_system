import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatsDisplay } from "@/components/dashboard/StatsDisplay";
import { useStatistics } from "@/hooks/use-statistics";
import { FormDialog } from "@/components/FormDialog";
import { AddHospitalForm } from "@/components/forms/AddHospitalForm";
import { useEffect, useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/super-admin" },
  { icon: Building2, label: "Hospitals", href: "/super-admin/hospitals" },
  { icon: Users, label: "Users", href: "/super-admin/users" },
  { icon: DollarSign, label: "Billing", href: "/super-admin/billing" },
  { icon: Activity, label: "Analytics", href: "/super-admin/analytics" },
  { icon: Shield, label: "Audit Logs", href: "/super-admin/audit" },
  { icon: Settings, label: "Settings", href: "/super-admin/settings" },
];

const SuperAdminDashboard = () => {
  const { stats } = useStatistics();

  const [user, setUser] = useState<any>(null);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [showAddHospital, setShowAddHospital] = useState(false);

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

      console.log("Hospitals from API:", data.hospitals);

      if (data.success) {
        setHospitals(data.hospitals || []);
      }
    } catch (err) {
      console.error("Failed to fetch hospitals", err);
    } finally {
      setLoadingHospitals(false);
    }
  };

  const userName = user?.name || "Admin";

  return (
    <DashboardLayout role="super_admin" userName={userName} navItems={navItems}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Platform-wide overview and management
          </p>
        </div>

        <Button variant="hero" onClick={() => setShowAddHospital(true)}>
          <Building2 className="w-4 h-4" />
          Add Hospital
        </Button>
      </div>

      {/* ADD HOSPITAL DIALOG */}
      <FormDialog
        open={showAddHospital}
        onOpenChange={setShowAddHospital}
        title="Add New Hospital"
      >
        <AddHospitalForm
          onSuccess={fetchHospitals}
          onClose={() => setShowAddHospital(false)}
        />
      </FormDialog>

      {/* STATS */}
      {stats && (
        <StatsDisplay
          totalUsers={stats.totalUsers}
          totalHospitals={stats.totalHospitals}
        />
      )}

      {/* STAT CARDS (OPTIONAL: still static) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Hospitals"
          value={stats?.totalHospitals || 0}
          change="Live"
          changeType="neutral"
          icon={Building2}
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          change="Live"
          changeType="neutral"
          icon={Users}
        />
        <StatCard
          title="Monthly Revenue"
          value="$284,500"
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Active Sessions"
          value="1,234"
          change="Real-time"
          changeType="neutral"
          icon={Activity}
        />
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* HOSPITAL TABLE */}
        <div className="lg:col-span-2 bg-card rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Hospitals</h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Hospital</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Users</th>
                  <th className="text-left py-3 px-4">Plan</th>
                </tr>
              </thead>

              <tbody>
                {loadingHospitals ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6">
                      Loading...
                    </td>
                  </tr>
                ) : hospitals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6">
                      No hospitals found
                    </td>
                  </tr>
                ) : (
                  hospitals.map((hospital, index) => (
                    <tr
                      key={hospital.id || index}
                      className="border-b hover:bg-muted/50"
                    >
                      <td className="py-3 px-4 font-medium">
                        {hospital.name}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            hospital.status === "active"
                              ? "bg-success/10 text-success"
                              : "bg-warning/10 text-warning"
                          }`}
                        >
                          {hospital.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{hospital.users}</td>
                      <td className="py-3 px-4">{hospital.plan}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6">
            <h2 className="font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <UserPlus className="w-4 h-4" />
                Onboard Hospital
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4" />
                Generate Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4" />
                System Settings
              </Button>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6">
            <h2 className="font-semibold mb-4">System Alerts</h2>
            <div className="space-y-3">
              <div className="flex gap-3 p-3 bg-warning/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-warning" />
                <div>
                  <p className="text-sm font-medium">Payment Pending</p>
                  <p className="text-xs text-muted-foreground">
                    3 hospitals have pending payments
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-success/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-success" />
                <div>
                  <p className="text-sm font-medium">Usage Milestone</p>
                  <p className="text-xs text-muted-foreground">
                    Platform crossed 10K users
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
