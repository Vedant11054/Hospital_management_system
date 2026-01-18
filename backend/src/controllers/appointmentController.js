import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/google-sheets.js';

export const bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, hospitalId, date, time, reason } = req.body;

    if (!patientId || !doctorId || !hospitalId || !date || !time || !reason) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const appointmentData = {
      id: uuidv4(),
      patientId,
      doctorId,
      hospitalId,
      date,
      time,
      reason,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    await db.addAppointment(appointmentData);

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: appointmentData,
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ error: error.message || 'Failed to book appointment' });
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID required' });
    }

    const appointments = await db.getAppointmentsByPatient(patientId);

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error('Get patient appointments error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch appointments' });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res.status(400).json({ error: 'Doctor ID required' });
    }

    const appointments = await db.getAppointmentsByDoctor(doctorId);

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch appointments' });
  }
};
