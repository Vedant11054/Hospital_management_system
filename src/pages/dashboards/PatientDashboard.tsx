import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatsDisplay } from '@/components/dashboard/StatsDisplay';
import { useStatistics } from '@/hooks/use-statistics';
import { FormDialog } from '@/components/FormDialog';
import { BookAppointmentForm } from '@/components/forms/BookAppointmentForm';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Pill, 
  CreditCard,
  Heart,
  Settings,
  Clock,
  Download,
  Plus,
  Users,
  Stethoscope
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/patient' },
  { icon: Calendar, label: 'Appointments', href: '/patient/appointments' },
  { icon: FileText, label: 'Medical Records', href: '/patient/records' },
  { icon: Pill, label: 'Prescriptions', href: '/patient/prescriptions' },
  { icon: CreditCard, label: 'Payments', href: '/patient/payments' },
  { icon: Users, label: 'Family', href: '/patient/family' },
  { icon: Settings, label: 'Settings', href: '/patient/settings' },
];

const upcomingAppointments = [
  { doctor: 'Dr. Sarah Wilson', specialty: 'Cardiology', date: 'Tomorrow', time: '10:00 AM' },
  { doctor: 'Dr. Michael Chen', specialty: 'General Medicine', date: 'Jan 25', time: '02:30 PM' },
];

const recentPrescriptions = [
  { medication: 'Lisinopril 10mg', doctor: 'Dr. Wilson', date: 'Jan 15', refills: 2 },
  { medication: 'Metformin 500mg', doctor: 'Dr. Chen', date: 'Jan 10', refills: 5 },
  { medication: 'Atorvastatin 20mg', doctor: 'Dr. Wilson', date: 'Jan 5', refills: 3 },
];

const PatientDashboard = () => {
  const { stats } = useStatistics();
  const [user, setUser] = useState<any>(null);
  const [showBookAppointment, setShowBookAppointment] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchAppointments(parsedUser.id);
    }
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/doctors/list');
      const data = await response.json();
      if (data.success) {
        setDoctors(data.doctors || []);
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  const fetchAppointments = async (patientId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/appointments/patient/${patientId}`);
      const data = await response.json();
      if (data.success) {
        setAppointments(data.appointments || []);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  const userName = user?.name || 'User';

  const handleBookAppointment = (doctor: any) => {
    setSelectedDoctor(doctor);
    setShowBookAppointment(true);
  };

  return (
    <DashboardLayout 
      role="patient" 
      userName={userName} 
      navItems={navItems}
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {userName}</h1>
          <p className="text-muted-foreground">Manage your health journey in one place</p>
        </div>
        <Button variant="hero" onClick={() => setShowBookAppointment(true)}>
          <Plus className="w-4 h-4" />
          Book Appointment
        </Button>
      </div>

      {/* Book Appointment Dialog */}
      <FormDialog
        open={showBookAppointment}
        onOpenChange={setShowBookAppointment}
        title="Book an Appointment"
      >
        {selectedDoctor ? (
          <BookAppointmentForm
            patientId={user?.id || ''}
            doctorId={selectedDoctor.id}
            hospitalId={selectedDoctor.hospitalId}
            doctorName={selectedDoctor.name}
            onSuccess={() => {
              fetchAppointments(user?.id);
            }}
            onClose={() => {
              setShowBookAppointment(false);
              setSelectedDoctor(null);
            }}
          />
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Select a doctor to book appointment:</p>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => handleBookAppointment(doctor)}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 transition"
                  >
                    <p className="font-medium">{doctor.name}</p>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500">No doctors available</p>
              )}
            </div>
          </div>
        )}
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
          title="Upcoming Appointments"
          value="2"
          change="Next: Tomorrow"
          changeType="neutral"
          icon={Calendar}
        />
        <StatCard
          title="Active Prescriptions"
          value="5"
          change="1 needs refill"
          changeType="neutral"
          icon={Pill}
          iconColor="text-accent"
        />
        <StatCard
          title="Medical Records"
          value="24"
          change="3 new this month"
          changeType="positive"
          icon={FileText}
        />
        <StatCard
          title="Outstanding Balance"
          value="$245.00"
          change="Due in 15 days"
          changeType="neutral"
          icon={CreditCard}
          iconColor="text-warning"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Upcoming Appointments</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {upcomingAppointments.map((apt, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 transition-all hover:shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-white">
                      <Heart className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{apt.doctor}</p>
                      <p className="text-sm text-muted-foreground">{apt.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-foreground">{apt.date}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {apt.time}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Reschedule</Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Plus className="w-4 h-4" />
              Book New Appointment
            </Button>
          </div>

          {/* Recent Prescriptions */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Prescriptions</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-3">
              {recentPrescriptions.map((rx, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Pill className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{rx.medication}</p>
                      <p className="text-xs text-muted-foreground">{rx.doctor} • {rx.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{rx.refills} refills left</span>
                    <Button variant="ghost" size="icon">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Health Summary */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Health Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Blood Pressure</span>
                <span className="font-medium text-foreground">120/80 mmHg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Heart Rate</span>
                <span className="font-medium text-foreground">72 bpm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Blood Sugar</span>
                <span className="font-medium text-foreground">95 mg/dL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">BMI</span>
                <span className="font-medium text-foreground">24.5</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
              Last updated: January 15, 2025
            </p>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4" />
                Download Records
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="w-4 h-4" />
                Pay Outstanding Bill
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4" />
                Add Family Member
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
