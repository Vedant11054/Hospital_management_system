import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope, Mail, Phone, GraduationCap, User, AlertCircle, CheckCircle2 } from "lucide-react";

interface Props {
  hospitalId: string;
  onSuccess: () => void;
  onClose: () => void;
}

const SPECIALTIES = [
  "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology",
  "Radiology", "Oncology", "Psychiatry", "General Surgery", "Internal Medicine",
  "Gynecology", "Ophthalmology", "ENT", "Anesthesiology", "Emergency Medicine",
];

export const AddDoctorForm = ({ hospitalId, onSuccess, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
    qualification: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!hospitalId) {
      setError("Hospital ID not found. Please log out and log back in as Hospital Admin.");
      return;
    }

    if (!form.name || !form.specialty || !form.email || !form.phone || !form.qualification) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/doctors/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hospitalId, ...form }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add doctor. Please try again.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 800);
    } catch (err) {
      setError("Network error. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mb-3">
          <CheckCircle2 className="w-7 h-7 text-emerald-500" />
        </div>
        <h3 className="font-semibold text-lg">Doctor Added!</h3>
        <p className="text-sm text-muted-foreground mt-1">{form.name} has been added successfully.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Hospital ID debug info */}
      {!hospitalId && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Hospital ID not found. Log out and log in again as Hospital Admin.</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-1">
        <Label htmlFor="name" className="flex items-center gap-1.5 text-sm font-medium">
          <User className="w-3.5 h-3.5" />Doctor's Full Name
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g. Dr. Sarah Johnson"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="specialty" className="flex items-center gap-1.5 text-sm font-medium">
          <Stethoscope className="w-3.5 h-3.5" />Specialty
        </Label>
        <select
          id="specialty"
          name="specialty"
          value={form.specialty}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 appearance-none"
        >
          <option value="">Select a specialty...</option>
          {SPECIALTIES.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="qualification" className="flex items-center gap-1.5 text-sm font-medium">
          <GraduationCap className="w-3.5 h-3.5" />Qualification
        </Label>
        <Input
          id="qualification"
          name="qualification"
          placeholder="e.g. MBBS, MD, PhD"
          value={form.qualification}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="email" className="flex items-center gap-1.5 text-sm font-medium">
            <Mail className="w-3.5 h-3.5" />Email
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="doctor@hospital.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="phone" className="flex items-center gap-1.5 text-sm font-medium">
            <Phone className="w-3.5 h-3.5" />Phone
          </Label>
          <Input
            id="phone"
            name="phone"
            placeholder="555-0100"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={loading || !hospitalId}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Adding...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />Add Doctor
            </span>
          )}
        </Button>
      </div>
    </form>
  );
};
