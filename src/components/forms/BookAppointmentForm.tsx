import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface BookAppointmentFormProps {
  patientId: string;
  doctorId: string;
  hospitalId: string;
  doctorName?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const BookAppointmentForm = ({
  patientId,
  doctorId,
  hospitalId,
  doctorName,
  onSuccess,
  onClose,
}: BookAppointmentFormProps) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId,
          doctorId,
          hospitalId,
          date,
          time,
          reason,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to book appointment');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setDate('');
      setTime('');
      setReason('');

      setTimeout(() => {
        onSuccess?.();
        onClose?.();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">Appointment booked successfully!</span>
        </div>
      )}

      {doctorName && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Doctor:</strong> {doctorName}
          </p>
        </div>
      )}

      <div>
        <Label htmlFor="appointment-date" className="text-sm font-medium">Date</Label>
        <Input
          id="appointment-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={isLoading}
          required
          min={today}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="appointment-time" className="text-sm font-medium">Time</Label>
        <Input
          id="appointment-time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          disabled={isLoading}
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="appointment-reason" className="text-sm font-medium">Reason for Visit</Label>
        <textarea
          id="appointment-reason"
          placeholder="Describe your reason for the visit"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={isLoading}
          required
          rows={3}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Booking...' : 'Book Appointment'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
