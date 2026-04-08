import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2, Calendar, Clock, FileText, Stethoscope } from 'lucide-react';

interface BookAppointmentFormProps {
  patientId: string;
  doctorId: string;
  hospitalId: string;
  doctorName?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM",
];

const REASONS = [
  "General Checkup", "Follow-up Visit", "Consultation", "Vaccination",
  "Lab Results Review", "Prescription Renewal", "Emergency", "Other",
];

export const BookAppointmentForm = ({
  patientId, doctorId, hospitalId, doctorName, onSuccess, onClose,
}: BookAppointmentFormProps) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const finalReason = reason === 'Other' ? customReason : reason;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!date || !time || !reason) {
      setError('Please fill in all required fields.');
      return;
    }
    if (reason === 'Other' && !customReason.trim()) {
      setError('Please describe your reason for the visit.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, doctorId, hospitalId, date, time, reason: finalReason }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to book appointment.');
        return;
      }

      setSuccess(true);
      setTimeout(() => { onSuccess?.(); onClose?.(); }, 900);
    } catch {
      setError('Network error. Make sure the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mb-3">
          <CheckCircle2 className="w-7 h-7 text-emerald-500" />
        </div>
        <h3 className="font-semibold text-lg">Appointment Confirmed!</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {date} at {time}
          {doctorName && <> with <strong>{doctorName}</strong></>}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{error}</span>
        </div>
      )}

      {doctorName && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <Stethoscope className="w-4 h-4 text-primary shrink-0" />
          <p className="text-sm font-medium">Booking with <span className="text-primary">{doctorName}</span></p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="apt-date" className="flex items-center gap-1.5 text-sm font-medium">
            <Calendar className="w-3.5 h-3.5" />Date
          </Label>
          <Input
            id="apt-date"
            type="date"
            value={date}
            min={today}
            onChange={(e) => { setDate(e.target.value); setError(''); }}
            disabled={isLoading}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="apt-time" className="flex items-center gap-1.5 text-sm font-medium">
            <Clock className="w-3.5 h-3.5" />Time Slot
          </Label>
          <select
            id="apt-time"
            value={time}
            onChange={(e) => { setTime(e.target.value); setError(''); }}
            disabled={isLoading}
            required
            className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 appearance-none"
          >
            <option value="">Select time...</option>
            {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <Label className="flex items-center gap-1.5 text-sm font-medium">
          <FileText className="w-3.5 h-3.5" />Reason for Visit
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {REASONS.map(r => (
            <button
              key={r}
              type="button"
              onClick={() => { setReason(r); setError(''); }}
              className={`text-left px-3 py-2 text-sm rounded-lg border transition-all ${
                reason === r
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:border-primary/50 hover:bg-primary/5'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {reason === 'Other' && (
        <div className="space-y-1">
          <Label htmlFor="custom-reason" className="text-sm font-medium">Describe your reason</Label>
          <textarea
            id="custom-reason"
            placeholder="Please briefly describe your concern..."
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            disabled={isLoading}
            rows={2}
            className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
          />
        </div>
      )}

      <div className="flex gap-3 pt-1">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button type="submit" className="flex-1" disabled={isLoading || !date || !time || !reason}>
          {isLoading ? (
            <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Booking...</span>
          ) : (
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />Confirm Booking</span>
          )}
        </Button>
      </div>
    </form>
  );
};
