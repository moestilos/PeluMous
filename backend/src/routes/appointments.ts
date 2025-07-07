import express from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  createAppointment,
  getAppointments,
  getHairdresserAppointments,
  updateAppointmentStatus,
  deleteAppointment
} from '../controllers/appointmentController';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// @route   POST /api/appointments
// @desc    Crear nueva cita
// @access  Private
router.post('/', createAppointment);

// @route   GET /api/appointments
// @desc    Obtener citas
// @access  Private
router.get('/', getAppointments);

// @route   GET /api/appointments/hairdresser/my-appointments
// @desc    Obtener citas del peluquero actual
// @access  Private (solo peluqueros)
router.get('/hairdresser/my-appointments', getHairdresserAppointments);

// @route   PUT /api/appointments/:id/status
// @desc    Actualizar estado de cita
// @access  Private
router.put('/:id/status', updateAppointmentStatus);

// @route   DELETE /api/appointments/:id
// @desc    Eliminar cita
// @access  Private
router.delete('/:id', deleteAppointment);

export default router;
