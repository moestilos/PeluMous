import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  cliente: mongoose.Types.ObjectId;
  peluquero: mongoose.Types.ObjectId;
  servicio: mongoose.Types.ObjectId;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  notas?: string;
  precio: number;
  fechaCreacion: Date;
}

const AppointmentSchema: Schema = new Schema({
  cliente: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  peluquero: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  servicio: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  horaInicio: {
    type: String,
    required: true
  },
  horaFin: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'completada', 'cancelada'],
    default: 'pendiente'
  },
  notas: {
    type: String,
    trim: true
  },
  precio: {
    type: Number,
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
