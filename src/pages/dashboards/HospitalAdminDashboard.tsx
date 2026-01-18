import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatsDisplay } from '@/components/dashboard/StatsDisplay';
import { useStatistics } from '@/hooks/use-statistics';
import { FormDialog } from '@/components/FormDialog';
import { AddDoctorForm } from '@/components/forms/AddDoctorForm';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  DollarSign, 
  Stethoscope,
  Settings,
  FileText,
  Activity,
  Clock,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/hospital-admin' },
  { icon: Stethoscope, label: 'Doctors', href: '/hospital-admin/doctors' },
  { icon: Users, label: 'Patients', href: '/hospital-admin/patients' },
  { icon: Calendar, label: 'Appointments', href: '/hospital-admin/appointments' },
  { icon: DollarSign, label: 'Billing', href: '/hospital-admin/billing' },
  { icon: FileText, label: 'Reports', href: '/hospital-admin/reports' },
  { icon: Settings, label: 'Settings', href: '/hospital-admin/settings' },
];

const todayAppointments = [
  { patient: 'John Smith', doctor: 'Dr. Sarah Wilson', time: '09:00 AM', status: 'completed' },
  { patient: 'Emily Johnson', doctor: 'Dr. Michael Chen', time: '10:30 AM', status: 'in-progress' },
  { patient: 'Robert Brown', doctor: 'Dr. Sarah Wilson', time: '11:00 AM', status: 'upcoming' },
  { patient: 'Lisa Davis', doctor: 'Dr. James Lee', time: '02:00 PM', status: 'upcoming' },
];

const HospitalAdminDashboard = () => {
  const { stats } = useStatistics();
  const [user, setUser] = useState<any>(null);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [hospitalId, setHospitalId] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      // Use user ID as hospital ID for now
      setHospitalId(parsedUser.id);
    }
  }, []);

  const fetchDoctors = async () => {
    if (!hospitalId) return;
    try {
      const response = await fetch(`http://localhost:3001/api/doctors/hospital/${hospitalId}`);
      const data = await response.json();
      if (data.success) {
        setDoctors(data.doctors || []);
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  const userName = user?.name || 'Admin';

  return (
    <DashboardLayout 
      role="hospital_admin" 
      userName={userName} 
      navItems={navItems}
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hospital Dashboard</h1>
          <p className="text-muted-foreground">City General Hospital Overview</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="w-4 h-4" />
            Reports
          </Button>
          <Button variant="hero" onClick={() => setShowAddDoctor(true)}>
            <UserPlus className="w-4 h-4" />
            Add Doctor
          </Button>
        </div>
      </div>

      {/* Add Doctor Dialog */}
      <FormDialog
        open={showAddDoctor}
        onOpenChange={setShowAddDoctor}
        title="Add New Doctor"
      >
        <AddDoctorForm
          hospitalId={hospitalId}
          onSuccess={fetchDoctors}
          onClose={() => setShowAddDoctor(false)}
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
          title="Active Doctors"
          value="32"
          change="4 on leave"
          changeType="neutral"
          icon={Stethoscope}
        />
        <StatCard
          title="Today's Appointments"
          value="148"
          change="+12 from yesterday"
          changeType="positive"
          icon={Calendar}
        />
        <StatCard
          title="Total Patients"
          value="2,847"
          change="+45 this week"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Today's Revenue"
          value="$12,450"
          change="+8.5% from average"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-success"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Today's Appointments</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {todayAppointments.map((apt, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">{apt.patient.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{apt.patient}</p>
                    <p className="text-sm text-muted-foreground">{apt.doctor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{apt.time}</span>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    apt.status === 'completed' 
                      ? 'bg-success/10 text-success' 
                      : apt.status === 'in-progress'
                        ? 'bg-info/10 text-info'
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Availability */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Doctor Availability</h2>
          <div className="space-y-4">
            {[
              { name: 'Dr. Sarah Wilson', specialty: 'Cardiology', status: 'available' },
              { name: 'Dr. Michael Chen', specialty: 'Neurology', status: 'busy' },
              { name: 'Dr. James Lee', specialty: 'Orthopedics', status: 'available' },
              { name: 'Dr. Emma Davis', specialty: 'Pediatrics', status: 'off-duty' },
            ].map((doctor, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{doctor.name}</p>
                    <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  doctor.status === 'available' 
                    ? 'bg-success' 
                    : doctor.status === 'busy' 
                      ? 'bg-warning' 
                      : 'bg-muted-foreground'
                }`} />
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View All Doctors
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HospitalAdminDashboard;
