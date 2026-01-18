import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatsDisplay } from '@/components/dashboard/StatsDisplay';
import { useStatistics } from '@/hooks/use-statistics';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  Clock,
  Settings,
  Pill,
  ClipboardList,
  UserCheck,
  Stethoscope
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/doctor' },
  { icon: Calendar, label: 'Appointments', href: '/doctor/appointments' },
  { icon: Users, label: 'My Patients', href: '/doctor/patients' },
  { icon: Pill, label: 'Prescriptions', href: '/doctor/prescriptions' },
  { icon: FileText, label: 'Medical Records', href: '/doctor/records' },
  { icon: Clock, label: 'Availability', href: '/doctor/availability' },
  { icon: Settings, label: 'Settings', href: '/doctor/settings' },
];

const upcomingAppointments = [
  { patient: 'John Smith', type: 'Follow-up', time: '10:30 AM', notes: 'Post-surgery review' },
  { patient: 'Emily Johnson', type: 'Consultation', time: '11:00 AM', notes: 'First visit' },
  { patient: 'Robert Brown', type: 'Check-up', time: '11:30 AM', notes: 'Annual physical' },
  { patient: 'Lisa Davis', type: 'Follow-up', time: '02:00 PM', notes: 'Lab results review' },
];

const recentPatients = [
  { name: 'Michael Chen', lastVisit: '2 days ago', condition: 'Hypertension' },
  { name: 'Sarah Williams', lastVisit: '3 days ago', condition: 'Diabetes Type 2' },
  { name: 'James Wilson', lastVisit: '1 week ago', condition: 'Arthritis' },
];

const DoctorDashboard = () => {
  const { stats } = useStatistics();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchAppointments(parsedUser.id);
    }
  }, []);

  const fetchAppointments = async (doctorId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/appointments/doctor/${doctorId}`);
      const data = await response.json();
      if (data.success) {
        setAppointments(data.appointments || []);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  const userName = user?.name || 'Doctor';

  return (
    <DashboardLayout 
      role="doctor" 
      userName={userName} 
      navItems={navItems}
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Good Morning, {userName}</h1>
          <p className="text-muted-foreground">You have {appointments.length} appointments scheduled</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Clock className="w-4 h-4" />
            Manage Availability
          </Button>
          <Button variant="hero">
            <Pill className="w-4 h-4" />
            New Prescription
          </Button>
        </div>
      </div>

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
          title="Today's Appointments"
          value={appointments.length.toString()}
          change={`${appointments.filter(a => a.status === 'completed').length} completed`}
          changeType="positive"
          icon={Calendar}
        />
        <StatCard
          title="Active Patients"
          value="156"
          change="+5 this week"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Pending Reports"
          value="12"
          change="3 urgent"
          changeType="neutral"
          icon={FileText}
          iconColor="text-warning"
        />
        <StatCard
          title="Avg. Consultation"
          value="24 min"
          change="On target"
          changeType="positive"
          icon={Clock}
          iconColor="text-info"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Upcoming Appointments</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {upcomingAppointments.map((apt, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">{apt.patient.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{apt.patient}</p>
                    <p className="text-sm text-muted-foreground">{apt.type} • {apt.notes}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium text-foreground">{apt.time}</p>
                    <p className="text-xs text-muted-foreground">Today</p>
                  </div>
                  <Button size="sm">Start</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Patients */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Patients</h2>
            <div className="space-y-4">
              {recentPatients.map((patient, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">{patient.condition}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{patient.lastVisit}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Patients
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <ClipboardList className="w-4 h-4" />
                Add Clinical Notes
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4" />
                Upload Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Stethoscope className="w-4 h-4" />
                Request Leave
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
