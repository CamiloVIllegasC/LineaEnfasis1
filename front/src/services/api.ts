/**
 * API Service - Mock para desarrollo
 * 
 * INSTRUCCIONES PARA CONECTAR CON MYSQL:
 * 1. Reemplaza las funciones mock con llamadas fetch/axios a tu backend
 * 2. Configura la URL base de tu API (ej: http://localhost:3000/api)
 * 3. Implementa el manejo de tokens JWT en las headers
 * 4. Actualiza los endpoints según tu estructura de rutas
 * 
 * Ejemplo de configuración con MySQL backend:
 * const API_URL = 'http://localhost:3000/api';
 * 
 * export const login = async (email: string, password: string) => {
 *   const response = await fetch(`${API_URL}/auth/login`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ email, password })
 *   });
 *   return response.json();
 * };
 */

import { Usuario, Cita, Profesional, EstadoCita, Especialidad, EstadoProfesional, AuthUser } from '@/types';

// Datos mock para desarrollo (simula la base de datos)
let mockUsuarios: Usuario[] = [
  { id: 1, nombre: 'Admin Sistema', email: 'admin@hospital.com', documento: '12345678', password: 'admin123' },
  { id: 2, nombre: 'Juan Pérez', email: 'juan@email.com', documento: '87654321', password: 'user123' },
  { id: 3, nombre: 'María González', email: 'maria@email.com', documento: '11223344', password: 'user123' }
];

let mockProfesionales: Profesional[] = [
  { id: 1, nombre: 'Dr. Carlos Rodríguez', especialidad: Especialidad.CARDIOLOGIA, telefono: '555-0001', estado: EstadoProfesional.ACTIVO },
  { id: 2, nombre: 'Dra. Ana Martínez', especialidad: Especialidad.PEDIATRIA, telefono: '555-0002', estado: EstadoProfesional.ACTIVO },
  { id: 3, nombre: 'Dr. Luis Fernández', especialidad: Especialidad.TRAUMATOLOGIA, telefono: '555-0003', estado: EstadoProfesional.ACTIVO },
  { id: 4, nombre: 'Dra. Carmen Silva', especialidad: Especialidad.GINECOLOGIA, telefono: '555-0004', estado: EstadoProfesional.ACTIVO }
];

let mockCitas: Cita[] = [
  { id: 1, fecha: '2026-02-05', hora: '09:00', estado: EstadoCita.CONFIRMADA, profesionalId: 1, usuarioId: 2 },
  { id: 2, fecha: '2026-02-05', hora: '10:00', estado: EstadoCita.PENDIENTE, profesionalId: 2, usuarioId: 3 },
  { id: 3, fecha: '2026-02-06', hora: '14:00', estado: EstadoCita.CONFIRMADA, profesionalId: 3, usuarioId: 2 }
];

// Simula delay de red
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== AUTENTICACIÓN ====================

export const login = async (email: string, password: string): Promise<{ success: boolean; user?: AuthUser; message?: string }> => {
  await delay();
  
  const usuario = mockUsuarios.find(u => u.email === email && u.password === password);
  
  if (usuario) {
    const authUser: AuthUser = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      role: usuario.email === 'admin@hospital.com' ? 'admin' : 'usuario'
    };
    
    // En producción, aquí guardarías el token JWT
    localStorage.setItem('authUser', JSON.stringify(authUser));
    
    return { success: true, user: authUser };
  }
  
  return { success: false, message: 'Credenciales inválidas' };
};

export const register = async (nombre: string, email: string, documento: string, password: string): Promise<{ success: boolean; user?: AuthUser; message?: string }> => {
  await delay();
  
  // Verificar si ya existe el email o documento
  if (mockUsuarios.find(u => u.email === email)) {
    return { success: false, message: 'El email ya está registrado' };
  }
  
  if (mockUsuarios.find(u => u.documento === documento)) {
    return { success: false, message: 'El documento ya está registrado' };
  }
  
  const newId = Math.max(...mockUsuarios.map(u => u.id)) + 1;
  const nuevoUsuario: Usuario = {
    id: newId,
    nombre,
    email,
    documento,
    password
  };
  
  mockUsuarios.push(nuevoUsuario);
  
  const authUser: AuthUser = {
    id: nuevoUsuario.id,
    nombre: nuevoUsuario.nombre,
    email: nuevoUsuario.email,
    role: 'usuario'
  };
  
  localStorage.setItem('authUser', JSON.stringify(authUser));
  
  return { success: true, user: authUser };
};

export const logout = () => {
  localStorage.removeItem('authUser');
};

export const getCurrentUser = (): AuthUser | null => {
  const userStr = localStorage.getItem('authUser');
  return userStr ? JSON.parse(userStr) : null;
};

// ==================== USUARIOS ====================

export const getUsuarios = async (): Promise<Usuario[]> => {
  await delay();
  return mockUsuarios.map(({ password, ...usuario }) => usuario);
};

export const createUsuario = async (usuario: Omit<Usuario, 'id'>): Promise<Usuario> => {
  await delay();
  const newId = Math.max(...mockUsuarios.map(u => u.id)) + 1;
  const nuevoUsuario = { ...usuario, id: newId };
  mockUsuarios.push(nuevoUsuario);
  const { password, ...usuarioSinPassword } = nuevoUsuario;
  return usuarioSinPassword;
};

export const updateUsuario = async (id: number, usuario: Partial<Usuario>): Promise<Usuario> => {
  await delay();
  const index = mockUsuarios.findIndex(u => u.id === id);
  if (index !== -1) {
    mockUsuarios[index] = { ...mockUsuarios[index], ...usuario };
    const { password, ...usuarioSinPassword } = mockUsuarios[index];
    return usuarioSinPassword;
  }
  throw new Error('Usuario no encontrado');
};

export const deleteUsuario = async (id: number): Promise<void> => {
  await delay();
  mockUsuarios = mockUsuarios.filter(u => u.id !== id);
};

// ==================== PROFESIONALES ====================

export const getProfesionales = async (): Promise<Profesional[]> => {
  await delay();
  return [...mockProfesionales];
};

export const createProfesional = async (profesional: Omit<Profesional, 'id'>): Promise<Profesional> => {
  await delay();
  const newId = Math.max(...mockProfesionales.map(p => p.id)) + 1;
  const nuevoProfesional = { ...profesional, id: newId };
  mockProfesionales.push(nuevoProfesional);
  return nuevoProfesional;
};

export const updateProfesional = async (id: number, profesional: Partial<Profesional>): Promise<Profesional> => {
  await delay();
  const index = mockProfesionales.findIndex(p => p.id === id);
  if (index !== -1) {
    mockProfesionales[index] = { ...mockProfesionales[index], ...profesional };
    return mockProfesionales[index];
  }
  throw new Error('Profesional no encontrado');
};

export const deleteProfesional = async (id: number): Promise<void> => {
  await delay();
  mockProfesionales = mockProfesionales.filter(p => p.id !== id);
};

// ==================== CITAS ====================

export const getCitas = async (): Promise<Cita[]> => {
  await delay();
  
  // Enriquecer citas con información del profesional y usuario
  return mockCitas.map(cita => {
    const profesional = mockProfesionales.find(p => p.id === cita.profesionalId);
    const usuario = mockUsuarios.find(u => u.id === cita.usuarioId);
    
    return {
      ...cita,
      profesionalNombre: profesional?.nombre,
      profesionalEspecialidad: profesional?.especialidad,
      usuarioNombre: usuario?.nombre
    };
  });
};

export const getCitasByUsuario = async (usuarioId: number): Promise<Cita[]> => {
  await delay();
  const citas = mockCitas.filter(c => c.usuarioId === usuarioId);
  
  return citas.map(cita => {
    const profesional = mockProfesionales.find(p => p.id === cita.profesionalId);
    return {
      ...cita,
      profesionalNombre: profesional?.nombre,
      profesionalEspecialidad: profesional?.especialidad
    };
  });
};

export const createCita = async (cita: Omit<Cita, 'id'>): Promise<Cita> => {
  await delay();
  const newId = Math.max(...mockCitas.map(c => c.id), 0) + 1;
  const nuevaCita = { ...cita, id: newId };
  mockCitas.push(nuevaCita);
  
  const profesional = mockProfesionales.find(p => p.id === nuevaCita.profesionalId);
  const usuario = mockUsuarios.find(u => u.id === nuevaCita.usuarioId);
  
  return {
    ...nuevaCita,
    profesionalNombre: profesional?.nombre,
    profesionalEspecialidad: profesional?.especialidad,
    usuarioNombre: usuario?.nombre
  };
};

export const updateCita = async (id: number, cita: Partial<Cita>): Promise<Cita> => {
  await delay();
  const index = mockCitas.findIndex(c => c.id === id);
  if (index !== -1) {
    mockCitas[index] = { ...mockCitas[index], ...cita };
    
    const profesional = mockProfesionales.find(p => p.id === mockCitas[index].profesionalId);
    const usuario = mockUsuarios.find(u => u.id === mockCitas[index].usuarioId);
    
    return {
      ...mockCitas[index],
      profesionalNombre: profesional?.nombre,
      profesionalEspecialidad: profesional?.especialidad,
      usuarioNombre: usuario?.nombre
    };
  }
  throw new Error('Cita no encontrada');
};

export const deleteCita = async (id: number): Promise<void> => {
  await delay();
  mockCitas = mockCitas.filter(c => c.id !== id);
};
