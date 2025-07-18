import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  rol: 'cliente' | 'admin' | 'peluquero';
  fechaRegistro: Date;
  profileImage?: string;
  activo: boolean;
  especialidades?: string[];
}

const UserSchema: Schema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  telefono: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['cliente', 'admin', 'peluquero'],
    default: 'cliente'
  },
  activo: {
    type: Boolean,
    default: true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  profileImage: {
    type: String,
    default: null
  },
  especialidades: {
    type: [String],
    default: []
  }
});

export default mongoose.model<IUser>('User', UserSchema);
