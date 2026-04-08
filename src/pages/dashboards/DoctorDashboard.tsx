import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Users, FileText, Clock,
  Settings, Pill, ClipboardList, Stethoscope, CheckCircle2,
  XCircle, RefreshCw, Search, GraduationCap, Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/doctor' },
  { icon: Calendar, label: 'Appointments', href: '/doctor/appointments' },
  { icon: Users, label: 'My Patients', href: '/doctor/patients' },
  { icon: Pill, label: 'Prescriptions', href: '/doctor/prescriptions' },
  { icon: FileText, label: 'Medical Records', href: '/doctor/records' },
  { icon: Clock, label: 'Availability', href: '/doctor/availability' },
  { icon: Settings, label: 'Settings', href: '/doctor/settings' },
];

const statusStyle: Record<string, string> = {
  scheduled: 'bg-blue-500/15 text-blue-600 border border-blue-500/25',
  completed: 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/25',
  cancelled: 'bg-red-500/15 text-red-600 border border-red-500/25',
};

const DoctorDashboard = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchApt, setSearchApt] = useState('');

  const activeSection = location.pathname.replace('/doctor', '').replace('/', '') || 'dashboard';

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      // Use doctorId if available (from Doctors sheet), else fallback to user id
      fetchAppointments(parsedUser.doctorId || parsedUser.id);
    }
  }, []);

  const fetchAppointments = async (doctorId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/appointments/doctor/${doctorId}`);
      const data = await response.json();
      if (data.success) setAppointments(data.appointments || []);
    } catch { } finally { setLoading(false); }
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: 'completed' | 'cancelled') => {
    try {
      const response = await fetch(`http://localhost:3001/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Status Updated',
          description: `Appointment marked as ${newStatus}.`,
        });
        fetchAppointments(user.doctorId || user.id);
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayApts = appointments.filter(a => a.date === todayStr || a.date?.startsWith(todayStr));
  const completedApts = appointments.filter(a => a.status === 'completed');
  const scheduledApts = appointments.filter(a => a.status === 'scheduled');
  const uniquePatients = new Set(appointments.map(a => a.patientId)).size;
  const filteredApts = appointments.filter(a =>
    (a.reason || '').toLowerCase().includes(searchApt.toLowerCase()) ||
    (a.status || '').toLowerCase().includes(searchApt.toLowerCase()) ||
    (a.date || '').includes(searchApt)
  );

  const userName = user?.name || 'Doctor';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const AptCard = ({ apt }: { apt: any }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 transition-colors gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-foreground text-sm">Patient ID: {apt.patientId?.substring(0, 8)}…</p>
          {apt.reason && <p className="text-xs text-muted-foreground truncate">Reason: {apt.reason}</p>}
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
             <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {apt.date}</span>
             <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.time}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[apt.status] || statusStyle.scheduled}`}>
          {apt.status || 'scheduled'}
        </span>

        {apt.status === 'scheduled' && (
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
              onClick={() => handleStatusUpdate(apt.id, 'completed')}
            >
              <CheckCircle2 className="w-4 h-4" />
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              className="h-8 w-8 text-destructive hover:bg-destructive/10 border-destructive/20"
              onClick={() => handleStatusUpdate(apt.id, 'cancelled')}
            >
              <XCircle className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'appointments':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">My Appointments</h1>
                <p className="text-muted-foreground">All appointments booked with you</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => user && fetchAppointments(user.doctorId || user.id)} disabled={loading}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />Refresh
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatCard title="Total" value={appointments.length} change="All appointments" changeType="neutral" icon={Calendar} />
              <StatCard title="Scheduled" value={scheduledApts.length} change="Upcoming" changeType="neutral" icon={Clock} iconColor="text-blue-500" />
              <StatCard title="Completed" value={completedApts.length} change="Done" changeType="positive" icon={CheckCircle2} iconColor="text-emerald-500" />
            </div>
            <div className="bg-card border rounded-xl p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <input className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Search by reason, status, date..." value={searchApt} onChange={e => setSearchApt(e.target.value)} />
              </div>
              {loading ? (
                <div className="text-center py-10"><RefreshCw className="w-6 h-6 animate-spin mx-auto text-muted-foreground" /></div>
              ) : filteredApts.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>{searchApt ? 'No appointments match.' : 'No appointments yet.'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredApts.map(apt => <AptCard key={apt.id} apt={apt} />)}
                </div>
              )}
            </div>
          </div>
        );

      case 'patients':
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold">My Patients</h1>
              <p className="text-muted-foreground">Patients you have treated or have appointments with</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <StatCard title="Unique Patients" value={uniquePatients} change="From your appointments" changeType="neutral" icon={Users} />
              <StatCard title="Total Appointments" value={appointments.length} change="All time" changeType="neutral" icon={Calendar} />
            </div>
            <div className="bg-card border rounded-xl p-6">
              <h2 className="font-semibold mb-4">Patient List</h2>
              {appointments.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No patients yet. They'll appear here once they book appointments with you.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...new Map(appointments.map(a => [a.patientId, a])).values()].map((apt: any, i) => {
                    const patApts = appointments.filter(a => a.patientId === apt.patientId);
                    const lastApt = patApts[patApts.length - 1];
                    return (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/40">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-teal-500" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Patient ID: {apt.patientId?.substring(0, 12)}…</p>
                            <p className="text-xs text-muted-foreground">Last appointment: {lastApt?.date || 'N/A'} · {lastApt?.reason || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium">{patApts.length} visit{patApts.length !== 1 ? 's' : ''}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle[lastApt?.status] || statusStyle.scheduled}`}>{lastApt?.status || 'scheduled'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );

      case 'prescriptions':
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Prescriptions</h1>
              <p className="text-muted-foreground">Manage prescriptions for your patients</p>
            </div>
            <div className="bg-card border rounded-xl p-12 text-center">
              <Pill className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
              <h2 className="text-lg font-semibold mb-2">Prescription Module</h2>
              <p className="text-muted-foreground text-sm mb-4">Prescription management is coming soon. You'll be able to create, edit, and send prescriptions directly.</p>
              <Button variant="outline" onClick={() => toast({ title: "Coming Soon", description: "Prescription module will be available in the next update." })}>
                <Pill className="w-4 h-4" />Get Notified
              </Button>
            </div>
          </div>
        );

      case 'records':
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Medical Records</h1>
              <p className="text-muted-foreground">Patient medical history and documents</p>
            </div>
            <div className="bg-card border rounded-xl p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
              <h2 className="text-lg font-semibold mb-2">Medical Records</h2>
              <p className="text-muted-foreground text-sm mb-4">Medical records management coming soon. Upload and manage patient documents and test results.</p>
              <Button variant="outline" onClick={() => toast({ title: "Coming Soon", description: "Medical records module coming soon." })}>
                <FileText className="w-4 h-4" />Get Notified
              </Button>
            </div>
          </div>
        );

      case 'availability':
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold">My Availability</h1>
              <p className="text-muted-foreground">Set your working hours and available slots</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Working Hours</h2>
                <div className="space-y-3">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                    <div key={day} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm font-medium w-24">{day}</span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>09:00 AM</span><span>—</span><span>05:00 PM</span>
                      </div>
                      <div className="w-8 h-4 rounded-full bg-primary flex items-center justify-end pr-0.5 cursor-pointer">
                        <div className="w-3 h-3 rounded-full bg-white" />
                      </div>
                    </div>
                  ))}
                  {['Saturday', 'Sunday'].map(day => (
                    <div key={day} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm font-medium w-24">{day}</span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground"><span>Off</span></div>
                      <div className="w-8 h-4 rounded-full bg-muted flex items-center pr-0.5 cursor-pointer">
                        <div className="w-3 h-3 rounded-full bg-white border border-border" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Appointment Stats</h2>
                <div className="space-y-3">
                  <StatCard title="Total Appointments" value={appointments.length} change="All time" changeType="neutral" icon={Calendar} />
                  <div className="mt-2">
                    <StatCard title="Today" value={todayApts.length} change={todayApts.length > 0 ? 'Appointments today' : 'Free today'} changeType={todayApts.length > 0 ? 'positive' : 'neutral'} icon={Clock} iconColor="text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Account preferences and configuration</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Profile</h2>
                <div className="space-y-4">
                  <div><label className="text-sm font-medium">Name</label><input className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none" defaultValue={user?.name || ''} readOnly /></div>
                  <div><label className="text-sm font-medium">Email</label><input className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none" defaultValue={user?.email || ''} readOnly /></div>
                  <div><label className="text-sm font-medium">Role</label><input className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-muted text-sm" value="Doctor" readOnly /></div>
                </div>
              </div>
              <div className="bg-card border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Notifications</h2>
                <div className="space-y-3">
                  {['New Appointment Alerts', 'Patient Messages', 'Reminder Notifications', 'Weekly Summary'].map(s => (
                    <div key={s} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm">{s}</span>
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

      default:
        return (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{greeting}, Dr. {userName}</h1>
                <p className="text-muted-foreground">{scheduledApts.length} appointment{scheduledApts.length !== 1 ? 's' : ''} scheduled</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => user && fetchAppointments(user.id)} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />Refresh
                </Button>
                <Button variant="hero" onClick={() => toast({ title: "Prescriptions", description: "Navigate to Prescriptions in the sidebar." })}>
                  <Pill className="w-4 h-4" />New Prescription
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard title="Total Appointments" value={appointments.length} change={`${scheduledApts.length} scheduled`} changeType="neutral" icon={Calendar} />
              <StatCard title="Completed" value={completedApts.length} change={appointments.length > 0 ? `${Math.round((completedApts.length / appointments.length) * 100)}% completion` : 'No data'} changeType="positive" icon={CheckCircle2} iconColor="text-emerald-500" />
              <StatCard title="Unique Patients" value={uniquePatients} change="From your appointments" changeType="neutral" icon={Users} />
              <StatCard title="Today's Schedule" value={todayApts.length || 'None'} change={todayApts.length > 0 ? `${todayApts.length} today` : 'Free today'} changeType={todayApts.length > 0 ? 'positive' : 'neutral'} icon={Clock} iconColor="text-blue-500" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Your Appointments</h2>
                  <span className="text-sm text-muted-foreground">{appointments.length} total</span>
                </div>
                {loading ? (
                  <div className="text-center py-12"><RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-muted-foreground" /></div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No appointments yet</p>
                    <p className="text-sm mt-1">Appointments booked by patients will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {appointments.map(apt => <AptCard key={apt.id} apt={apt} />)}
                  </div>
                )}
              </div>
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Summary</h2>
                  <div className="space-y-3">
                    {[{ label: 'Scheduled', count: scheduledApts.length, color: 'bg-blue-500' }, { label: 'Completed', count: completedApts.length, color: 'bg-emerald-500' }, { label: 'Cancelled', count: appointments.filter(a => a.status === 'cancelled').length, color: 'bg-red-500' }].map(s => (
                      <div key={s.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                        <div className="flex items-center gap-2 text-sm"><div className={`w-2 h-2 rounded-full ${s.color}`} />{s.label}</div>
                        <span className="font-semibold text-sm">{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Clinical Notes", description: "Navigate to Medical Records for notes." })}>
                      <ClipboardList className="w-4 h-4" />Add Clinical Notes
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Reports", description: "Navigate to Medical Records to upload." })}>
                      <FileText className="w-4 h-4" />Upload Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Availability", description: "Navigate to Availability in the sidebar." })}>
                      <Clock className="w-4 h-4" />Manage Availability
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Leave Request Submitted", description: "Your leave request has been submitted." })}>
                      <Stethoscope className="w-4 h-4" />Request Leave
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <DashboardLayout role="doctor" userName={userName} navItems={navItems}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default DoctorDashboard;
