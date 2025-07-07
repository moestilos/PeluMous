import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import path from 'path';
import fs from 'fs';

interface AuthRequest extends Request {
  user?: any;
}

export const getPeluqueros = async (req: Request, res: Response): Promise<void> => {
  try {
    const peluqueros = await User.find({ 
      rol: 'peluquero',
      activo: { $ne: false }
    }).select('nombre email telefono');

    res.json(peluqueros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Solo admin puede ver todos los usuarios
    if (req.user.rol !== 'admin') {
      res.status(403).json({ message: 'No tienes permisos para ver usuarios' });
      return;
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nombre, email, telefono } = req.body;
    const userId = req.user._id;

    // Obtener usuario actual
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    // Verificar si el email ya existe (si se está cambiando)
    if (email && email !== currentUser.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        res.status(400).json({ message: 'Ya existe un usuario con ese email' });
        return;
      }
    }

    // Preparar datos para actualizar
    const updateData: any = {};
    if (nombre) updateData.nombre = nombre;
    if (email) updateData.email = email;
    if (telefono) updateData.telefono = telefono;

    // Manejar imagen de perfil si se subió una nueva
    if (req.file) {
      // Eliminar imagen anterior si existe
      if (currentUser.profileImage) {
        const oldImagePath = path.join(__dirname, '../../uploads/profiles', path.basename(currentUser.profileImage));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      // Guardar nueva imagen
      updateData.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    res.json({
      message: 'Perfil actualizado correctamente',
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const createPeluquero = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Solo admin puede crear peluqueros
    if (req.user.rol !== 'admin') {
      res.status(403).json({ message: 'No tienes permisos para crear peluqueros' });
      return;
    }

    const { nombre, email, password, telefono } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Ya existe un usuario con ese email' });
      return;
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear peluquero
    const peluquero = new User({
      nombre,
      email,
      password: hashedPassword,
      telefono,
      rol: 'peluquero'
    });

    await peluquero.save();

    res.status(201).json({
      message: 'Peluquero creado correctamente',
      peluquero: {
        id: peluquero._id,
        nombre: peluquero.nombre,
        email: peluquero.email,
        telefono: peluquero.telefono,
        rol: peluquero.rol
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const updatePeluquero = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Solo admin puede actualizar peluqueros
    if (req.user.rol !== 'admin') {
      res.status(403).json({ message: 'No tienes permisos para actualizar peluqueros' });
      return;
    }

    const { id } = req.params;
    const { nombre, email, telefono, activo } = req.body;

    const peluquero = await User.findById(id);
    if (!peluquero || peluquero.rol !== 'peluquero') {
      res.status(404).json({ message: 'Peluquero no encontrado' });
      return;
    }

    // Verificar si el email ya existe en otro usuario
    if (email && email !== peluquero.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        res.status(400).json({ message: 'Ya existe un usuario con ese email' });
        return;
      }
    }

    const updatedPeluquero = await User.findByIdAndUpdate(
      id,
      { 
        ...(nombre && { nombre }),
        ...(email && { email }),
        ...(telefono && { telefono }),
        ...(activo !== undefined && { activo })
      },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Peluquero actualizado correctamente',
      peluquero: updatedPeluquero
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const deletePeluquero = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Solo admin puede eliminar peluqueros
    if (req.user.rol !== 'admin') {
      res.status(403).json({ message: 'No tienes permisos para eliminar peluqueros' });
      return;
    }

    const { id } = req.params;

    const peluquero = await User.findById(id);
    if (!peluquero || peluquero.rol !== 'peluquero') {
      res.status(404).json({ message: 'Peluquero no encontrado' });
      return;
    }

    // En lugar de eliminar, marcamos como inactivo
    await User.findByIdAndUpdate(id, { activo: false });

    res.json({ message: 'Peluquero desactivado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
