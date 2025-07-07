import express from 'express';
import { body } from 'express-validator';
import { register, login, verifyToken } from '../controllers/authController';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Registrar usuario
// @access  Public
router.post('/register', [
  body('nombre', 'El nombre es requerido').notEmpty(),
  body('email', 'Debe ser un email válido').isEmail(),
  body('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  body('telefono', 'El teléfono es requerido').notEmpty()
], register);

// @route   POST /api/auth/login
// @desc    Iniciar sesión
// @access  Public
router.post('/login', [
  body('email', 'Debe ser un email válido').isEmail(),
  body('password', 'La contraseña es requerida').exists()
], login);

// @route   GET /api/auth/verify
// @desc    Verificar token y obtener usuario
// @access  Private
router.get('/verify', verifyToken);

export default router;
