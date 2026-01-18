import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatsDisplay } from '@/components/dashboard/StatsDisplay';
import { useStatistics } from '@/hooks/use-statistics';
import { FormDialog } from '@/components/FormDialog';
import { AddHospitalForm } from '@/components/forms/AddHospitalForm';
import { useEffect, useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/super-admin' },
  { icon: Building2, label: 'Hospitals', href: '/super-admin/hospitals' },
  { icon: Users, label: 'Users', href: '/super-admin/users' },
  { icon: DollarSign, label: 'Billing', href: '/super-admin/billing' },
  { icon: Activity, label: 'Analytics', href: '/super-admin/analytics' },
  { icon: Shield, label: 'Audit Logs', href: '/super-admin/audit' },
  { icon: Settings, label: 'Settings', href: '/super-admin/settings' },
];

const recentHospitals = [
  { name: 'City General Hospital', status: 'active', users: 245, plan: 'Enterprise' },
  { name: 'Metro Health Center', status: 'active', users: 128, plan: 'Professional' },
  { name: 'Sunrise Medical', status: 'pending', users: 0, plan: 'Basic' },
  { name: 'Valley Care Hospital', status: 'active', users: 89, plan: 'Professional' },
];

const SuperAdminDashboard = () => {
  const { stats } = useStatistics();
  const [user, setUser] = useState<any>(null);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [showAddHospital, setShowAddHospital] = useState(false);
  const [loadingHospitals, setLoadingHospitals] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    setLoadingHospitals(true);
    try {
      const response = await fetch('http://localhost:3001/api/hospitals/list');
      const data = await response.json();
      if (data.success) {
        setHospitals(data.hospitals || []);
      }
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    } finally {
      setLoadingHospitals(false);
    }
  };

  const userName = user?.name || 'Admin';

  return (
    <DashboardLayout 
      role="super_admin" 
      userName={userName} 
      navItems={navItems}
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform-wide overview and management</p>
        </div>
        <Button variant="hero" onClick={() => setShowAddHospital(true)}>
          <Building2 className="w-4 h-4" />
          Add Hospital
        </Button>
      </div>

      {/* Add Hospital Dialog */}
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

      {/* System Statistics */}
      {stats && (
        <StatsDisplay 
          totalUsers={stats.totalUsers} 
          totalHospitals={stats.totalHospitals} 
        />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Hospitals"
          value="48"
          change="+3 this month"
          changeType="positive"
          icon={Building2}
        />
        <StatCard
          title="Total Users"
          value="12,847"
          change="+256 this week"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Monthly Revenue"
          value="$284,500"
          change="+12.5% from last month"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-success"
        />
        <StatCard
          title="Active Sessions"
          value="1,234"
          change="Real-time"
          changeType="neutral"
          icon={Activity}
          iconColor="text-info"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Hospitals */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Hospitals</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Hospital</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Users</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Plan</th>
                </tr>
              </thead>
              <tbody>
                {recentHospitals.map((hospital, index) => (
                  <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{hospital.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        hospital.status === 'active' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-warning/10 text-warning'
                      }`}>
                        {hospital.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{hospital.users}</td>
                    <td className="py-3 px-4 text-muted-foreground">{hospital.plan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <UserPlus className="w-4 h-4" />
                Onboard New Hospital
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4" />
                Generate Reports
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4" />
                System Configuration
              </Button>
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">System Alerts</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10">
                <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Payment Pending</p>
                  <p className="text-xs text-muted-foreground">3 hospitals have pending payments</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10">
                <TrendingUp className="w-5 h-5 text-success mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Usage Milestone</p>
                  <p className="text-xs text-muted-foreground">Platform crossed 10K active users</p>
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
