import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  hospitalId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const AddDoctorForm = ({
  hospitalId,
  onSuccess,
  onClose,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
    qualification: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔒 HARD GUARD
    if (!hospitalId) {
      alert("Hospital ID missing. Please logout and login again.");
      return;
    }

    if (
      !form.name ||
      !form.specialty ||
      !form.email ||
      !form.phone ||
      !form.qualification
    ) {
      alert("All fields are required");
      return;
    }

    console.log("Submitting doctor:", { hospitalId, ...form });

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/doctors/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalId,
          ...form,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to add doctor");
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Add doctor failed:", err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input name="name" value={form.name} onChange={handleChange} required />
      </div>

      <div>
        <Label>Specialty</Label>
        <Input
          name="specialty"
          value={form.specialty}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Phone</Label>
        <Input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Qualification</Label>
        <Input
          name="qualification"
          value={form.qualification}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Adding..." : "Add Doctor"}
      </Button>
    </form>
  );
};
