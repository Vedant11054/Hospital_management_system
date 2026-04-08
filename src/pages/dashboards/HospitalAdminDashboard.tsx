import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { FormDialog } from "@/components/FormDialog";
import { AddDoctorForm } from "@/components/forms/AddDoctorForm";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Calendar, DollarSign, Stethoscope, Building2,
  Settings, FileText, Clock, UserPlus, Trash2, RefreshCw,
  Mail, Phone, GraduationCap, CheckCircle2, XCircle, Search,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/hospital-admin" },
  { icon: Stethoscope, label: "Doctors", href: "/hospital-admin/doctors" },
  { icon: Users, label: "Patients", href: "/hospital-admin/patients" },
  { icon: Calendar, label: "Appointments", href: "/hospital-admin/appointments" },
  { icon: DollarSign, label: "Billing", href: "/hospital-admin/billing" },
  { icon: FileText, label: "Reports", href: "/hospital-admin/reports" },
  { icon: Settings, label: "Settings", href: "/hospital-admin/settings" },
];

const statusStyle: Record<string, string> = {
  scheduled: "bg-blue-500/15 text-blue-600 border border-blue-500/25",
  completed: "bg-emerald-500/15 text-emerald-600 border border-emerald-500/25",
  cancelled: "bg-red-500/15 text-red-600 border border-red-500/25",
};

const HospitalAdminDashboard = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [hospitalId, setHospitalId] = useState<string>("");
  const [hospitalName, setHospitalName] = useState<string>("");
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingApts, setLoadingApts] = useState(false);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchDoc, setSearchDoc] = useState("");
  const [searchApt, setSearchApt] = useState("");
  const [noHospitalLinked, setNoHospitalLinked] = useState(false);

  const activeSection = location.pathname.replace("/hospital-admin", "").replace("/", "") || "dashboard";

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return;
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    if (parsedUser.hospitalId) {
      setHospitalId(parsedUser.hospitalId);
    } else {
      // hospitalId missing — admin was created before the fix, or email doesn't match any hospital
      setNoHospitalLinked(true);
    }
  }, []);

  useEffect(() => {
    if (!hospitalId) return;
    fetchDoctors();
    fetchAppointments();
    fetchHospitalName();
  }, [hospitalId]);

  const fetchHospitalName = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/hospitals/list");
      const data = await res.json();
      if (data.success) {
        const myHospital = (data.hospitals || []).find((h: any) => h.id === hospitalId);
        if (myHospital) setHospitalName(myHospital.name);
      }
    } catch {}
  };

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const res = await fetch(`http://localhost:3001/api/doctors/hospital/${hospitalId}`);
      const data = await res.json();
      if (data.success) setDoctors(data.doctors || []);
    } catch { } finally { setLoadingDoctors(false); }
  };

  const fetchAppointments = async () => {
    setLoadingApts(true);
    try {
      const res = await fetch(`http://localhost:3001/api/appointments/hospital/${hospitalId}`);
      const data = await res.json();
      if (data.success) setAppointments(data.appointments || []);
    } catch { } finally { setLoadingApts(false); }
  };

  const handleDeleteDoctor = async (doctorId: string, doctorName: string) => {
    if (!confirm(`Remove Dr. ${doctorName}?`)) return;
    setDeletingId(doctorId);
    try {
      const res = await fetch(`http://localhost:3001/api/doctors/${doctorId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { toast({ title: "Doctor Removed", description: `${doctorName} removed.` }); fetchDoctors(); }
      else toast({ title: "Error", description: data.error, variant: "destructive" });
    } catch { toast({ title: "Error", description: "Network error.", variant: "destructive" }); }
    finally { setDeletingId(null); }
  };

  const doctorMap = doctors.reduce((acc: Record<string, string>, d) => { acc[d.id] = d.name; return acc; }, {});
  const uniquePatients = new Set(appointments.map((a) => a.patientId)).size;
  const filteredDoctors = doctors.filter(d => d.name?.toLowerCase().includes(searchDoc.toLowerCase()) || d.specialty?.toLowerCase().includes(searchDoc.toLowerCase()));
  const filteredApts = appointments.filter(a =>
    (doctorMap[a.doctorId] || "").toLowerCase().includes(searchApt.toLowerCase()) ||
    (a.reason || "").toLowerCase().includes(searchApt.toLowerCase()) ||
    (a.status || "").toLowerCase().includes(searchApt.toLowerCase())
  );

  const DoctorCard = ({ doc }: { doc: any }) => (
    <div className="p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Stethoscope className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{doc.name}</p>
            <p className="text-xs text-muted-foreground">{doc.specialty}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10 shrink-0" disabled={deletingId === doc.id} onClick={() => handleDeleteDoctor(doc.id, doc.name)}>
          {deletingId === doc.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
        </Button>
      </div>
      <div className="mt-2 ml-12 space-y-0.5">
        {doc.email && <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" />{doc.email}</p>}
        {doc.phone && <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" />{doc.phone}</p>}
        {doc.qualification && <p className="text-xs text-muted-foreground flex items-center gap-1"><GraduationCap className="w-3 h-3" />{doc.qualification}</p>}
      </div>
    </div>
  );

  const AptRow = ({ apt }: { apt: any }) => (
    <div className="flex justify-between items-center p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">Dr. {doctorMap[apt.doctorId] || apt.doctorId?.substring(0, 8)}</p>
        {apt.reason && <p className="text-xs text-muted-foreground mt-0.5 truncate">Reason: {apt.reason}</p>}
        <p className="text-xs text-muted-foreground">Patient: {apt.patientId?.substring(0, 8)}…</p>
      </div>
      <div className="flex items-center gap-3 ml-4 shrink-0">
        <div className="text-right">
          <p className="text-xs font-medium">{apt.date}</p>
          <p className="text-xs text-muted-foreground">{apt.time}</p>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[apt.status] || statusStyle.scheduled}`}>
          {apt.status || "scheduled"}
        </span>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "doctors":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Doctors</h1>
                <p className="text-muted-foreground">Manage your hospital's medical staff</p>
              </div>
              <Button variant="hero" onClick={() => setShowAddDoctor(true)}>
                <UserPlus className="w-4 h-4" />Add Doctor
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatCard title="Total Doctors" value={doctors.length} change="In your hospital" changeType="neutral" icon={Stethoscope} />
              <StatCard title="Appointments Served" value={appointments.length} change="Via these doctors" changeType="neutral" icon={Calendar} />
              <StatCard title="Unique Patients" value={uniquePatients} change="From appointments" changeType="neutral" icon={Users} />
            </div>
            <div className="bg-card border rounded-xl p-6">
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Search doctors..." value={searchDoc} onChange={e => setSearchDoc(e.target.value)} />
                </div>
                <Button variant="ghost" size="sm" onClick={fetchDoctors} disabled={loadingDoctors}>
                  <RefreshCw className={`w-4 h-4 ${loadingDoctors ? "animate-spin" : ""}`} />
                </Button>
              </div>
              {loadingDoctors ? (
                <div className="text-center py-10"><RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-muted-foreground" /></div>
              ) : filteredDoctors.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Stethoscope className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">{searchDoc ? "No doctors match your search." : "No doctors added yet."}</p>
                  {!searchDoc && <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowAddDoctor(true)}><UserPlus className="w-3 h-3" />Add First Doctor</Button>}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredDoctors.map(doc => <DoctorCard key={doc.id} doc={doc} />)}
                </div>
              )}
            </div>
          </div>
        );

      case "patients":
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Patients</h1>
              <p className="text-muted-foreground">Patients who have visited your hospital</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <StatCard title="Unique Patients" value={uniquePatients} change="From appointments" changeType="neutral" icon={Users} />
              <StatCard title="Total Appointments" value={appointments.length} change="All time" changeType="neutral" icon={Calendar} />
            </div>
            <div className="bg-card border rounded-xl p-6">
              <h2 className="font-semibold mb-4">Patient Records</h2>
              {appointments.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>No patient data yet. Patients appear once they book appointments.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...new Map(appointments.map(a => [a.patientId, a])).values()].map((apt: any, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-pink-500/10 flex items-center justify-center">
                          <Users className="w-4 h-4 text-pink-500" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Patient ID: {apt.patientId?.substring(0, 12)}…</p>
                          <p className="text-xs text-muted-foreground">Last seen: {apt.date}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{appointments.filter(a => a.patientId === apt.patientId).length} appointment{appointments.filter(a => a.patientId === apt.patientId).length !== 1 ? "s" : ""}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "appointments":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Appointments</h1>
                <p className="text-muted-foreground">All appointments at your hospital</p>
              </div>
              <Button variant="ghost" size="sm" onClick={fetchAppointments} disabled={loadingApts}>
                <RefreshCw className={`w-4 h-4 ${loadingApts ? "animate-spin" : ""}`} />Refresh
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatCard title="Total" value={appointments.length} change="All appointments" changeType="neutral" icon={Calendar} />
              <StatCard title="Scheduled" value={appointments.filter(a => a.status === "scheduled").length} change="Upcoming" changeType="neutral" icon={Clock} iconColor="text-blue-500" />
              <StatCard title="Completed" value={appointments.filter(a => a.status === "completed").length} change="Done" changeType="positive" icon={CheckCircle2} iconColor="text-emerald-500" />
            </div>
            <div className="bg-card border rounded-xl p-6">
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <input className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Search by doctor, reason, status..." value={searchApt} onChange={e => setSearchApt(e.target.value)} />
                </div>
              </div>
              {loadingApts ? (
                <div className="text-center py-10"><RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-muted-foreground" /></div>
              ) : filteredApts.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">{searchApt ? "No appointments match." : "No appointments yet."}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredApts.map(apt => <AptRow key={apt.id} apt={apt} />)}
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
              <p className="text-muted-foreground">Financial overview for your hospital</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatCard title="Total Appointments" value={appointments.length} change="Billable events" changeType="neutral" icon={Calendar} />
              <StatCard title="Completed" value={appointments.filter(a => a.status === "completed").length} change="Revenue generating" changeType="positive" icon={CheckCircle2} iconColor="text-emerald-500" />
              <StatCard title="Pending" value={appointments.filter(a => a.status === "scheduled").length} change="Upcoming" changeType="neutral" icon={Clock} iconColor="text-blue-500" />
            </div>
            <div className="bg-card border rounded-xl p-6">
              <h2 className="font-semibold mb-4">Billing Summary</h2>
              <p className="text-sm text-muted-foreground">Detailed billing integration coming soon. Appointment data is tracked above.</p>
            </div>
          </div>
        );

      case "reports":
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Reports</h1>
              <p className="text-muted-foreground">Hospital performance and statistics</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard title="Doctors" value={doctors.length} change="Active staff" changeType="neutral" icon={Stethoscope} />
              <StatCard title="Appointments" value={appointments.length} change="Total" changeType="neutral" icon={Calendar} />
              <StatCard title="Patients" value={uniquePatients} change="Unique" changeType="neutral" icon={Users} />
              <StatCard title="Completed" value={appointments.filter(a => a.status === "completed").length} change="Visits done" changeType="positive" icon={CheckCircle2} iconColor="text-emerald-500" />
            </div>
            <div className="bg-card border rounded-xl p-6">
              <h2 className="font-semibold mb-4">Appointment Status Report</h2>
              {["scheduled", "completed", "cancelled"].map(status => {
                const count = appointments.filter(a => a.status === status).length;
                const pct = appointments.length ? Math.round((count / appointments.length) * 100) : 0;
                return (
                  <div key={status} className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize font-medium">{status}</span>
                      <span className="text-muted-foreground">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${status === "completed" ? "bg-emerald-500" : status === "scheduled" ? "bg-blue-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "settings":
        return (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-muted-foreground">Hospital account and preferences</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Account</h2>
                <div className="space-y-4">
                  <div><label className="text-sm font-medium">Name</label><input className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none" defaultValue={user?.name || ""} readOnly /></div>
                  <div><label className="text-sm font-medium">Email</label><input className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none" defaultValue={user?.email || ""} readOnly /></div>
                  <div><label className="text-sm font-medium">Role</label><input className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-muted text-sm" value="Hospital Admin" readOnly /></div>
                </div>
              </div>
              <div className="bg-card border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Notifications</h2>
                <div className="space-y-3">
                  {["New Appointment Alerts", "Doctor Activity", "Daily Reports"].map(s => (
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
                <h1 className="text-2xl font-bold">Hospital Dashboard</h1>
                <p className="text-muted-foreground">Manage doctors, appointments and operations</p>
              </div>
              <Button variant="hero" onClick={() => setShowAddDoctor(true)}>
                <UserPlus className="w-4 h-4" />Add Doctor
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard title="Active Doctors" value={doctors.length} change="Live" changeType="neutral" icon={Stethoscope} />
              <StatCard title="Total Appointments" value={appointments.length} change="Live" changeType="neutral" icon={Calendar} />
              <StatCard title="Unique Patients" value={uniquePatients} change="From appointments" changeType="neutral" icon={Users} />
              <StatCard title="Completed" value={appointments.filter(a => a.status === "completed").length} change={`of ${appointments.length} appointments`} changeType="positive" icon={CheckCircle2} iconColor="text-emerald-500" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-card border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg">Appointments</h2>
                  <Button variant="ghost" size="sm" onClick={fetchAppointments} disabled={loadingApts}>
                    <RefreshCw className={`w-4 h-4 ${loadingApts ? "animate-spin" : ""}`} />
                  </Button>
                </div>
                {loadingApts ? (
                  <div className="text-center py-10"><RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-muted-foreground" /></div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground"><Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" /><p>No appointments yet</p></div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {appointments.map(apt => <AptRow key={apt.id} apt={apt} />)}
                  </div>
                )}
              </div>
              <div className="bg-card border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg">Doctors ({doctors.length})</h2>
                  <Button variant="ghost" size="sm" onClick={fetchDoctors} disabled={loadingDoctors}>
                    <RefreshCw className={`w-4 h-4 ${loadingDoctors ? "animate-spin" : ""}`} />
                  </Button>
                </div>
                {loadingDoctors ? (
                  <div className="text-center py-6"><RefreshCw className="w-5 h-5 animate-spin mx-auto mb-1 text-muted-foreground" /></div>
                ) : doctors.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Stethoscope className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No doctors added</p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowAddDoctor(true)}><UserPlus className="w-3 h-3" />Add First Doctor</Button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {doctors.map(doc => <DoctorCard key={doc.id} doc={doc} />)}
                  </div>
                )}
                <Button variant="outline" className="w-full mt-4" onClick={() => setShowAddDoctor(true)}>
                  <UserPlus className="w-4 h-4" />Add Doctor
                </Button>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <DashboardLayout role="hospital_admin" userName={user?.name || "Admin"} navItems={navItems}>
      <FormDialog open={showAddDoctor} onOpenChange={setShowAddDoctor} title="Add Doctor">
        <AddDoctorForm hospitalId={hospitalId} onSuccess={() => { fetchDoctors(); setShowAddDoctor(false); }} onClose={() => setShowAddDoctor(false)} />
      </FormDialog>

      {/* Warning: hospital not linked */}
      {noHospitalLinked && (
        <div className="mb-4 flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-amber-800">Hospital Not Linked to Your Account</p>
            <p className="text-xs text-amber-700 mt-1">
              Your account email doesn't match any hospital's admin email. Please ask the Super Admin to re-add your hospital with your correct email, or log out and back in after the hospital is set up.
            </p>
          </div>
        </div>
      )}

      {/* Hospital name banner */}
      {hospitalName && (
        <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg text-sm">
          <Building2 className="w-4 h-4 text-primary shrink-0" />
          <span className="font-medium text-primary">Managing:</span>
          <span className="text-foreground font-semibold">{hospitalName}</span>
        </div>
      )}

      {renderContent()}
    </DashboardLayout>
  );
};

export default HospitalAdminDashboard;
