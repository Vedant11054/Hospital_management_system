import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { FormDialog } from "@/components/FormDialog";
import { AddDoctorForm } from "@/components/forms/AddDoctorForm";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  Stethoscope,
  Settings,
  FileText,
  Clock,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/hospital-admin" },
  { icon: Stethoscope, label: "Doctors", href: "/hospital-admin/doctors" },
  { icon: Users, label: "Patients", href: "/hospital-admin/patients" },
  { icon: Calendar, label: "Appointments", href: "/hospital-admin/appointments" },
  { icon: DollarSign, label: "Billing", href: "/hospital-admin/billing" },
  { icon: FileText, label: "Reports", href: "/hospital-admin/reports" },
  { icon: Settings, label: "Settings", href: "/hospital-admin/settings" },
];

const HospitalAdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [hospitalId, setHospitalId] = useState<string>("");

  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showAddDoctor, setShowAddDoctor] = useState(false);

  // ---------------- LOAD USER ----------------
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return;

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // ✅ CRITICAL: use hospitalId, NOT user.id
    setHospitalId(parsedUser.hospitalId);
  }, []);

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    if (!hospitalId) return;
    fetchDoctors();
    fetchAppointments();
  }, [hospitalId]);

  const fetchDoctors = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/doctors/hospital/${hospitalId}`
      );
      const data = await res.json();
      if (data.success) setDoctors(data.doctors || []);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/appointments/hospital/${hospitalId}`
      );
      const data = await res.json();
      if (data.success) setAppointments(data.appointments || []);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
  };

  return (
    <DashboardLayout
      role="hospital_admin"
      userName={user?.name || "Admin"}
      navItems={navItems}
    >
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hospital Dashboard</h1>
          <p className="text-muted-foreground">Hospital Overview</p>
        </div>

        <Button variant="hero" onClick={() => setShowAddDoctor(true)}>
          <UserPlus className="w-4 h-4" />
          Add Doctor
        </Button>
      </div>

      {/* ADD DOCTOR */}
      <FormDialog
        open={showAddDoctor}
        onOpenChange={setShowAddDoctor}
        title="Add Doctor"
      >
        <AddDoctorForm
          hospitalId={hospitalId} // ✅ correct hospital id
          onSuccess={() => {
            fetchDoctors();
            setShowAddDoctor(false);
          }}
          onClose={() => setShowAddDoctor(false)}
        />
      </FormDialog>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Active Doctors"
          value={doctors.length}
          change="Live"
          changeType="neutral"
          icon={Stethoscope}
        />
        <StatCard
          title="Appointments"
          value={appointments.length}
          change="Live"
          changeType="neutral"
          icon={Calendar}
        />
        <StatCard
          title="Total Patients"
          value="—"
          change="Coming soon"
          changeType="neutral"
          icon={Users}
        />
        <StatCard
          title="Revenue"
          value="—"
          change="Coming son"
          changeType="neutral"
          icon={DollarSign}
        />
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* APPOINTMENTS */}
        <div className="lg:col-span-2 bg-card border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Appointments</h2>

          {appointments.length === 0 ? (
            <p className="text-muted-foreground">No appointments found</p>
          ) : (
            appointments.map((apt) => (
              <div
                key={apt.id}
                className="flex justify-between items-center p-4 mb-2 rounded bg-muted/50"
              >
                <div>
                  <p className="font-medium">Doctor ID: {apt.doctorId}</p>
                  <p className="text-sm text-muted-foreground">
                    Patient ID: {apt.patientId}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {apt.date} {apt.time}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* DOCTORS */}
        <div className="bg-card border rounded-xl p-6">
          <h2 className="font-semibold mb-4">Doctors</h2>

          {doctors.length === 0 ? (
            <p className="text-muted-foreground">No doctors added</p>
          ) : (
            doctors.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.specialty}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HospitalAdminDashboard;
