import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { FormDialog } from "@/components/FormDialog";
import { BookAppointmentForm } from "@/components/forms/BookAppointmentForm";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard, Calendar, FileText, Pill, CreditCard,
  Heart, Settings, Clock, Plus, Users, Stethoscope,
  Building2, CheckCircle2, XCircle, RefreshCw, ArrowLeft, MapPin, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/patient" },
  { icon: Calendar, label: "Appointments", href: "/patient/appointments" },
  { icon: FileText, label: "Medical Records", href: "/patient/records" },
  { icon: Pill, label: "Prescriptions", href: "/patient/prescriptions" },
  { icon: CreditCard, label: "Payments", href: "/patient/payments" },
  { icon: Users, label: "Family", href: "/patient/family" },
  { icon: Settings, label: "Settings", href: "/patient/settings" },
];

const statusStyle: Record<string, string> = {
  scheduled: "bg-blue-500/15 text-blue-600 border border-blue-500/25",
  completed: "bg-emerald-500/15 text-emerald-600 border border-emerald-500/25",
  cancelled: "bg-red-500/15 text-red-600 border border-red-500/25",
};

type BookingStep = 1 | 2 | 3;

const PatientDashboard = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [bookingStep, setBookingStep] = useState<BookingStep>(1);
  const [showBookAppointment, setShowBookAppointment] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingApts, setLoadingApts] = useState(false);
  const [searchApt, setSearchApt] = useState("");

  const activeSection = location.pathname.replace("/patient", "").replace("/", "") || "dashboard";

  // Build lookup maps
  const hospitalMap = hospitals.reduce((acc: Record<string, string>, h) => { acc[h.id] = h.name; return acc; }, {});
  const doctorMap = allDoctors.reduce((acc: Record<string, any>, d) => { acc[d.id] = d; return acc; }, {});

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchAppointments(parsedUser.id);
    }
    fetchHospitals();
    fetchAllDoctors();
  }, []);

  const fetchAllDoctors = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/doctors/list");
      const data = await res.json();
      if (data.success) setAllDoctors(data.doctors || []);
    } catch { }
  };

  const fetchHospitals = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/hospitals/list");
      const data = await res.json();
      if (data.success) setHospitals(data.hospitals || []);
    } catch { }
  };

  const fetchDoctorsByHospital = async (hospitalId: string) => {
    setLoadingDoctors(true);
    try {
      const res = await fetch(`http://localhost:3001/api/doctors/hospital/${hospitalId}`);
      const data = await res.json();
      if (data.success) setDoctors(data.doctors || []);
    } catch { } finally { setLoadingDoctors(false); }
  };

  const fetchAppointments = async (patientId: string) => {
    setLoadingApts(true);
    try {
      const res = await fetch(`http://localhost:3001/api/appointments/patient/${patientId}`);
      const data = await res.json();
      if (data.success) setAppointments(data.appointments || []);
    } catch { } finally { setLoadingApts(false); }
  };

  const resetBooking = () => {
    setSelectedHospital(null);
    setSelectedDoctor(null);
    setBookingStep(1);
    setDoctors([]);
    fetchAllDoctors();
  };

  const closeBooking = () => { setShowBookAppointment(false); resetBooking(); };

  const upcomingApts = appointments.filter(a => a.status === "scheduled");
  const completedApts = appointments.filter(a => a.status === "completed");
  const filteredApts = appointments.filter(a =>
    (doctorMap[a.doctorId]?.name || "").toLowerCase().includes(searchApt.toLowerCase()) ||
    (hospitalMap[a.hospitalId] || "").toLowerCase().includes(searchApt.toLowerCase()) ||
    (a.reason || "").toLowerCase().includes(searchApt.toLowerCase()) ||
    (a.status || "").toLowerCase().includes(searchApt.toLowerCase())
  );

  const userName = user?.name || "User";

  const BookingDialog = () => (
    <FormDialog open={showBookAppointment} onOpenChange={open => { if (!open) closeBooking(); else setShowBookAppointment(true); }} title="Book an Appointment">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-5">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border-2 transition-all ${bookingStep >= step ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border"}`}>{step}</div>
            <span className={`text-xs ${bookingStep >= step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{step === 1 ? "Hospital" : step === 2 ? "Doctor" : "Details"}</span>
            {step < 3 && <div className={`flex-1 h-0.5 rounded transition-all ${bookingStep > step ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {bookingStep === 1 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground font-medium">Select a hospital</p>
          {hospitals.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No hospitals available</p> : (
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {hospitals.map(hospital => (
                <button key={hospital.id} onClick={() => { setSelectedHospital(hospital); fetchDoctorsByHospital(hospital.id); setBookingStep(2); }} className="w-full text-left p-3 border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Building2 className="w-4 h-4 text-primary" /></div>
                    <div><p className="font-medium text-sm group-hover:text-primary transition-colors">{hospital.name}</p>{hospital.address && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{hospital.address}</p>}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {bookingStep === 2 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => { setSelectedHospital(null); setBookingStep(1); }}><ArrowLeft className="w-4 h-4" />Back</Button>
            <p className="text-sm text-muted-foreground">Doctors at <span className="font-medium text-foreground">{selectedHospital?.name}</span></p>
          </div>
          {loadingDoctors ? <div className="text-center py-6"><RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-muted-foreground" /></div> : doctors.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">No doctors available at this hospital</p> : (
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {doctors.map(doctor => (
                <button key={doctor.id} onClick={() => { setSelectedDoctor(doctor); setBookingStep(3); }} className="w-full text-left p-3 border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Stethoscope className="w-4 h-4 text-primary" /></div>
                    <div><p className="font-medium text-sm group-hover:text-primary">{doctor.name}</p><p className="text-xs text-muted-foreground">{doctor.specialty}{doctor.qualification ? ` · ${doctor.qualification}` : ""}</p></div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {bookingStep === 3 && selectedDoctor && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => { setSelectedDoctor(null); setBookingStep(2); }}><ArrowLeft className="w-4 h-4" />Back</Button>
            <div><p className="text-sm font-medium">{selectedDoctor.name}</p><p className="text-xs text-muted-foreground">{selectedDoctor.specialty} · {selectedHospital?.name}</p></div>
          </div>
          <BookAppointmentForm patientId={user?.id} doctorId={selectedDoctor.id} hospitalId={selectedHospital.id} doctorName={selectedDoctor.name}
            onSuccess={() => { fetchAppointments(user?.id); closeBooking(); toast({ title: "Appointment Booked! ✓", description: `Your appointment with ${selectedDoctor.name} has been confirmed.` }); }}
            onClose={closeBooking} />
        </div>
      )}
    </FormDialog>
  );

  const AptCard = ({ apt }: { apt: any }) => {
    const doc = doctorMap[apt.doctorId];
    const hospitalName = hospitalMap[apt.hospitalId];
    return (
      <div className="flex items-start justify-between p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><Stethoscope className="w-5 h-5 text-primary" /></div>
          <div className="min-w-0">
            <p className="font-medium text-foreground text-sm">{doc ? doc.name : "Doctor"}</p>
            {doc?.specialty && <p className="text-xs text-muted-foreground">{doc.specialty}</p>}
            {hospitalName && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Building2 className="w-3 h-3" />{hospitalName}</p>}
            {apt.reason && <p className="text-xs text-muted-foreground mt-1 italic truncate">"{apt.reason}"</p>}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 ml-3 shrink-0">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[apt.status] || statusStyle.scheduled}`}>{apt.status || "scheduled"}</span>
          <p className="text-xs font-medium">{apt.date}</p>
          <p className="text-xs text-muted-foreground">{apt.time}</p>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "appointments":
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">My Appointments</h1>
                <p className="text-muted-foreground">All your scheduled and past appointments</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => user && fetchAppointments(user.id)} disabled={loadingApts}><RefreshCw className={`w-4 h-4 ${loadingApts ? "animate-spin" : ""}`} /></Button>
                <Button variant="hero" onClick={() => setShowBookAppointment(true)}><Plus className="w-4 h-4" />Book New</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatCard title="Upcoming" value={upcomingApts.length} change="Scheduled" changeType={upcomingApts.length > 0 ? "positive" : "neutral"} icon={Calendar} />
              <StatCard title="Completed" value={completedApts.length} change="Visits done" changeType="positive" icon={CheckCircle2} iconColor="text-emerald-500" />
              <StatCard title="Total" value={appointments.length} change="All time" changeType="neutral" icon={Clock} iconColor="text-blue-500" />
            </div>
            <div className="bg-card border rounded-xl p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <input className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Search by doctor, hospital, reason, status..." value={searchApt} onChange={e => setSearchApt(e.target.value)} />
              </div>
              {loadingApts ? <div className="text-center py-10"><RefreshCw className="w-6 h-6 animate-spin mx-auto text-muted-foreground" /></div>
                : filteredApts.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">{searchApt ? "No appointments match." : "No appointments yet."}</p>
                    {!searchApt && <Button variant="outline" className="mt-4" onClick={() => setShowBookAppointment(true)}><Plus className="w-4 h-4" />Book Appointment</Button>}
                  </div>
                ) : <div className="space-y-3">{filteredApts.map(apt => <AptCard key={apt.id} apt={apt} />)}</div>}
            </div>
          </div>
        );

      case "records":
        return (
          <div>
            <div className="mb-6"><h1 className="text-2xl font-bold">Medical Records</h1><p className="text-muted-foreground">Your health documents and history</p></div>
            <div className="bg-card border rounded-xl p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
              <h2 className="text-lg font-semibold mb-2">Medical Records</h2>
              <p className="text-muted-foreground text-sm mb-4">Your medical history, lab results, and health documents will appear here once available.</p>
              <Button variant="outline" onClick={() => toast({ title: "Coming Soon", description: "Medical records module coming soon." })}><FileText className="w-4 h-4" />Get Notified</Button>
            </div>
          </div>
        );

      case "prescriptions":
        return (
          <div>
            <div className="mb-6"><h1 className="text-2xl font-bold">Prescriptions</h1><p className="text-muted-foreground">Your medication history and active prescriptions</p></div>
            <div className="bg-card border rounded-xl p-12 text-center">
              <Pill className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
              <h2 className="text-lg font-semibold mb-2">Prescriptions</h2>
              <p className="text-muted-foreground text-sm mb-4">Prescriptions issued by your doctors will appear here. Contact your doctor to request a prescription.</p>
              <Button variant="outline" onClick={() => toast({ title: "Coming Soon", description: "Prescription module coming soon." })}><Pill className="w-4 h-4" />Get Notified</Button>
            </div>
          </div>
        );

      case "payments":
        return (
          <div>
            <div className="mb-6"><h1 className="text-2xl font-bold">Payments</h1><p className="text-muted-foreground">Your billing history and outstanding payments</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <StatCard title="Total Visits" value={completedApts.length} change="Billable visits" changeType="neutral" icon={CheckCircle2} iconColor="text-emerald-500" />
              <StatCard title="Outstanding" value="$0" change="No pending bills" changeType="positive" icon={CreditCard} />
            </div>
            <div className="bg-card border rounded-xl p-6">
              <h2 className="font-semibold mb-4">Payment History</h2>
              {completedApts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground"><CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30" /><p className="text-sm">No payment records yet.</p></div>
              ) : (
                <div className="space-y-3">
                  {completedApts.map(apt => {
                    const doc = doctorMap[apt.doctorId];
                    return (
                      <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div><p className="font-medium text-sm">{doc?.name || "Doctor"}</p><p className="text-xs text-muted-foreground">{apt.date} · {apt.reason}</p></div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/25">Paid</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );

      case "family":
        return (
          <div>
            <div className="mb-6"><h1 className="text-2xl font-bold">Family Members</h1><p className="text-muted-foreground">Manage health records for your family</p></div>
            <div className="bg-card border rounded-xl p-12 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
              <h2 className="text-lg font-semibold mb-2">Family Health Management</h2>
              <p className="text-muted-foreground text-sm mb-4">Add family members to manage their appointments and health records from a single account.</p>
              <Button variant="outline" onClick={() => toast({ title: "Coming Soon", description: "Family management coming soon." })}><Users className="w-4 h-4" />Add Family Member</Button>
            </div>
          </div>
        );

      case "settings":
        return (
          <div>
            <div className="mb-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Your account and notification preferences</p></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Profile</h2>
                <div className="space-y-4">
                  <div><label className="text-sm font-medium">Name</label><input className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none" defaultValue={user?.name || ""} readOnly /></div>
                  <div><label className="text-sm font-medium">Email</label><input className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none" defaultValue={user?.email || ""} readOnly /></div>
                  <div><label className="text-sm font-medium">Role</label><input className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-muted text-sm" value="Patient" readOnly /></div>
                </div>
              </div>
              <div className="bg-card border rounded-xl p-6">
                <h2 className="font-semibold mb-4">Notifications</h2>
                <div className="space-y-3">
                  {["Appointment Reminders", "Doctor Messages", "Health Tips", "Prescription Alerts"].map(s => (
                    <div key={s} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm">{s}</span>
                      <div className="w-10 h-5 rounded-full bg-primary flex items-center justify-end pr-0.5 cursor-pointer"><div className="w-4 h-4 rounded-full bg-white" /></div>
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
              <div><h1 className="text-2xl font-bold">Welcome back, {userName} 👋</h1><p className="text-muted-foreground">Manage your health journey in one place</p></div>
              <Button variant="hero" onClick={() => setShowBookAppointment(true)}><Plus className="w-4 h-4" />Book Appointment</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard title="Upcoming Appointments" value={upcomingApts.length} change="Scheduled" changeType={upcomingApts.length > 0 ? "positive" : "neutral"} icon={Calendar} />
              <StatCard title="Completed Visits" value={completedApts.length} change="Total completed" changeType="positive" icon={CheckCircle2} iconColor="text-emerald-500" />
              <StatCard title="Prescriptions" value="—" change="Coming soon" changeType="neutral" icon={Pill} />
              <StatCard title="Medical Records" value="—" change="Coming soon" changeType="neutral" icon={FileText} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-card border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-lg">Your Appointments</h2>
                  <Button variant="ghost" size="sm" onClick={() => user && fetchAppointments(user.id)} disabled={loadingApts}><RefreshCw className={`w-4 h-4 ${loadingApts ? "animate-spin" : ""}`} /></Button>
                </div>
                {loadingApts ? <div className="text-center py-12"><RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-muted-foreground" /></div>
                  : appointments.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No appointments yet</p>
                      <p className="text-sm mt-1">Book your first appointment to get started.</p>
                      <Button variant="outline" className="mt-4" onClick={() => setShowBookAppointment(true)}><Plus className="w-4 h-4" />Book Appointment</Button>
                    </div>
                  ) : <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">{appointments.map(apt => <AptCard key={apt.id} apt={apt} />)}</div>}
              </div>
              <div className="space-y-6">
                <div className="bg-card border rounded-xl p-6">
                  <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={() => setShowBookAppointment(true)}><Plus className="w-4 h-4" />Book Appointment</Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Records", description: "Navigate to Medical Records from the sidebar." })}><FileText className="w-4 h-4" />View Medical Records</Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast({ title: "Prescriptions", description: "Navigate to Prescriptions from the sidebar." })}><Pill className="w-4 h-4" />My Prescriptions</Button>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-3"><Heart className="w-5 h-5 text-primary" /><h2 className="font-semibold">Health Tip</h2></div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Regular health check-ups help detect potential issues early. Aim for at least one annual physical examination.</p>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <DashboardLayout role="patient" userName={userName} navItems={navItems}>
      <BookingDialog />
      {renderContent()}
    </DashboardLayout>
  );
};

export default PatientDashboard;
