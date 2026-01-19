import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatsDisplay } from "@/components/dashboard/StatsDisplay";
import { FormDialog } from "@/components/FormDialog";
import { BookAppointmentForm } from "@/components/forms/BookAppointmentForm";
import { useEffect, useState } from "react";
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
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/patient" },
  { icon: Calendar, label: "Appointments", href: "/patient/appointments" },
  { icon: FileText, label: "Medical Records", href: "/patient/records" },
  { icon: Pill, label: "Prescriptions", href: "/patient/prescriptions" },
  { icon: CreditCard, label: "Payments", href: "/patient/payments" },
  { icon: Users, label: "Family", href: "/patient/family" },
  { icon: Settings, label: "Settings", href: "/patient/settings" },
];

const PatientDashboard = () => {
  const [user, setUser] = useState<any>(null);

  const [hospitals, setHospitals] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const [showBookAppointment, setShowBookAppointment] = useState(false);

  // ---------------- LOAD USER ----------------
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchAppointments(parsedUser.id);
    }
    fetchHospitals();
  }, []);

  // ---------------- FETCH HOSPITALS ----------------
  const fetchHospitals = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/hospitals/list");
      const data = await res.json();
      if (data.success) setHospitals(data.hospitals || []);
    } catch (err) {
      console.error("Failed to fetch hospitals", err);
    }
  };

  // ---------------- FETCH DOCTORS BY HOSPITAL ----------------
  const fetchDoctorsByHospital = async (hospitalId: string) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/doctors/hospital/${hospitalId}`
      );
      const data = await res.json();
      if (data.success) setDoctors(data.doctors || []);
    } catch (err) {
      console.error("Failed to fetch doctors", err);
    }
  };

  // ---------------- FETCH APPOINTMENTS ----------------
  const fetchAppointments = async (patientId: string) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/appointments/patient/${patientId}`
      );
      const data = await res.json();
      if (data.success) setAppointments(data.appointments || []);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    }
  };

  const userName = user?.name || "User";

  // ---------------- UI ----------------
  return (
    <DashboardLayout role="patient" userName={userName} navItems={navItems}>
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {userName}</h1>
          <p className="text-muted-foreground">
            Manage your health journey in one place
          </p>
        </div>
        <Button variant="hero" onClick={() => setShowBookAppointment(true)}>
          <Plus className="w-4 h-4" />
          Book Appointment
        </Button>
      </div>

      {/* BOOK APPOINTMENT DIALOG */}
      <FormDialog
        open={showBookAppointment}
        onOpenChange={(open) => {
          setShowBookAppointment(open);
          if (!open) {
            setSelectedHospital(null);
            setSelectedDoctor(null);
            setDoctors([]);
          }
        }}
        title="Book an Appointment"
      >
        {/* STEP 1: SELECT HOSPITAL */}
        {!selectedHospital && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Select Hospital</p>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {hospitals.map((hospital) => (
                <button
                  key={hospital.id}
                  onClick={() => {
                    setSelectedHospital(hospital);
                    fetchDoctorsByHospital(hospital.id);
                  }}
                  className="w-full text-left p-3 border rounded-lg hover:bg-muted"
                >
                  <p className="font-medium">{hospital.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {hospital.address}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: SELECT DOCTOR */}
        {selectedHospital && !selectedDoctor && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Doctors at {selectedHospital.name}
            </p>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {doctors.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No doctors available
                </p>
              ) : (
                doctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor)}
                    className="w-full text-left p-3 border rounded-lg hover:bg-muted"
                  >
                    <p className="font-medium">{doctor.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doctor.specialty}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* STEP 3: BOOK FORM */}
        {selectedDoctor && (
          <BookAppointmentForm
            patientId={user?.id}
            doctorId={selectedDoctor.id}
            hospitalId={selectedHospital.id}
            doctorName={selectedDoctor.name}
            onSuccess={() => {
              fetchAppointments(user?.id);
              setShowBookAppointment(false);
              setSelectedDoctor(null);
              setSelectedHospital(null);
            }}
            onClose={() => {
              setShowBookAppointment(false);
              setSelectedDoctor(null);
              setSelectedHospital(null);
            }}
          />
        )}
      </FormDialog>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Upcoming Appointments"
          value={appointments.length}
          change="Live"
          changeType="neutral"
          icon={Calendar}
        />
        <StatCard
          title="Prescriptions"
          value="—"
          change="Coming soon"
          changeType="neutral"
          icon={Pill}
        />
        <StatCard
          title="Medical Records"
          value="—"
          change="Coming soon"
          changeType="neutral"
          icon={FileText}
        />
        <StatCard
          title="Outstanding Balance"
          value="—"
          change="Coming soon"
          changeType="neutral"
          icon={CreditCard}
        />
      </div>

      {/* UPCOMING APPOINTMENTS */}
      <div className="bg-card border rounded-xl p-6">
        <h2 className="font-semibold mb-4">Your Appointments</h2>

        {appointments.length === 0 ? (
          <p className="text-muted-foreground">No appointments booked</p>
        ) : (
          appointments.map((apt) => (
            <div
              key={apt.id}
              className="flex justify-between items-center p-4 mb-2 rounded bg-muted/50"
            >
              <div>
                <p className="font-medium">Doctor ID: {apt.doctorId}</p>
                <p className="text-sm text-muted-foreground">
                  Hospital ID: {apt.hospitalId}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4" />
                <span>
                  {apt.date} {apt.time}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
