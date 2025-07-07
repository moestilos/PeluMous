import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
  getServices,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController';

const router = express.Router();

// @route   GET /api/services
// @desc    Obtener todos los servicios activos
// @access  Public
router.get('/', getServices);

// Las siguientes rutas requieren autenticación de admin
router.use(authMiddleware);
router.use(adminMiddleware);

// @route   POST /api/services
// @desc    Crear nuevo servicio
// @access  Private (Admin)
router.post('/', createService);

// @route   PUT /api/services/:id
// @desc    Actualizar servicio
// @access  Private (Admin)
router.put('/:id', updateService);

// @route   DELETE /api/services/:id
// @desc    Desactivar servicio
// @access  Private (Admin)
router.delete('/:id', deleteService);

export default router;
