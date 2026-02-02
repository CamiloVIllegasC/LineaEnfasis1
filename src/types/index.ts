// Tipos que coinciden con el esquema de base de datos MySQL

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  documento: string;
  password?: string; // Para autenticación
}

export enum EstadoCita {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  CANCELADA = 'cancelada',
  COMPLETADA = 'completada'
}

export enum Especialidad {
  CARDIOLOGIA = 'cardiologia',
  PEDIATRIA = 'pediatria',
  GINECOLOGIA = 'ginecologia',
  MEDICINA_GENERAL = 'medicina_general',
  TRAUMATOLOGIA = 'traumatologia',
  DERMATOLOGIA = 'dermatologia',
  OFTALMOLOGIA = 'oftalmologia',
  PSIQUIATRIA = 'psiquiatria'
}

export enum EstadoProfesional {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  VACACIONES = 'vacaciones'
}

export interface Cita {
  id: number;
  fecha: string; // formato YYYY-MM-DD
  hora: string; // formato HH:MM
  estado: EstadoCita;
  profesionalId: number;
  usuarioId: number;
  // Datos relacionados para mostrar
  profesionalNombre?: string;
  profesionalEspecialidad?: Especialidad;
  usuarioNombre?: string;
}

export interface Profesional {
  id: number;
  nombre: string;
  especialidad: Especialidad;
  telefono: string;
  estado: EstadoProfesional;
}

export interface AuthUser {
  id: number;
  nombre: string;
  email: string;
  role: 'admin' | 'usuario'; // Para distinguir permisos
}
