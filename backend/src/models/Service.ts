import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number; // en minutos
  categoria: string;
  activo: boolean;
}

const ServiceSchema: Schema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  duracion: {
    type: Number,
    required: true,
    min: 15 // mínimo 15 minutos
  },
  categoria: {
    type: String,
    required: true,
    enum: ['corte', 'tinte', 'peinado', 'tratamiento', 'manicura', 'otros']
  },
  activo: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model<IService>('Service', ServiceSchema);
