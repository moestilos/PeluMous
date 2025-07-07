import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
  getPeluqueros,
  getUsers,
  getUserProfile,
  updateUserProfile,
  createPeluquero,
  updatePeluquero,
  deletePeluquero
} from '../controllers/userController';

const router = express.Router();

// @route   GET /api/users/peluqueros
// @desc    Obtener lista de peluqueros
// @access  Public
router.get('/peluqueros', getPeluqueros);

// Todas las demás rutas requieren autenticación
router.use(authMiddleware);

// @route   GET /api/users/profile
// @desc    Obtener perfil del usuario
// @access  Private
router.get('/profile', getUserProfile);

// @route   PUT /api/users/profile
// @desc    Actualizar perfil del usuario
// @access  Private
router.put('/profile', updateUserProfile);

// Rutas de administración (requieren permisos de admin)
router.use(adminMiddleware);

// @route   POST /api/users/peluqueros
// @desc    Crear nuevo peluquero
// @access  Private (Admin)
router.post('/peluqueros', createPeluquero);

// @route   PUT /api/users/peluqueros/:id
// @desc    Actualizar peluquero
// @access  Private (Admin)
router.put('/peluqueros/:id', updatePeluquero);

// @route   DELETE /api/users/peluqueros/:id
// @desc    Desactivar peluquero
// @access  Private (Admin)
router.delete('/peluqueros/:id', deletePeluquero);

// @route   GET /api/users
// @desc    Obtener todos los usuarios (solo admin)
// @access  Private (Admin)
router.get('/', getUsers);

export default router;
