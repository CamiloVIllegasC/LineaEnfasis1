# Sistema de Gestión de Citas Hospitalarias

## Instrucciones para conectar con MySQL

Este proyecto está preparado para conectarse a una base de datos MySQL. Actualmente usa datos mock para desarrollo, pero puedes conectarlo fácilmente a tu backend.

### Estructura de Base de Datos

```sql
-- Tabla usuarios
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  documento VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Tabla profesionales
CREATE TABLE profesionales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  especialidad ENUM('cardiologia', 'pediatria', 'ginecologia', 'medicina_general', 'traumatologia', 'dermatologia', 'oftalmologia', 'psiquiatria') NOT NULL,
  telefono VARCHAR(50) NOT NULL,
  estado ENUM('activo', 'inactivo', 'vacaciones') DEFAULT 'activo'
);

-- Tabla citas
CREATE TABLE citas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente',
  profesionalId INT NOT NULL,
  usuarioId INT NOT NULL,
  FOREIGN KEY (profesionalId) REFERENCES profesionales(id),
  FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
);
```

### Pasos para conectar con MySQL

1. **Crear tu backend API con Node.js/Express**

   Ejemplo de estructura:

   ```
   backend/
   ├── config/
   │   └── db.js          # Configuración MySQL
   ├── routes/
   │   ├── auth.js        # Rutas de autenticación
   │   ├── usuarios.js    # CRUD usuarios
   │   ├── profesionales.js
   │   └── citas.js
   └── server.js
   ```

2. **Configurar la conexión MySQL**

   ```javascript
   // backend/config/db.js
   const mysql = require('mysql2/promise');
   
   const pool = mysql.createPool({
     host: 'localhost',
     user: 'tu_usuario',
     password: 'tu_password',
     database: 'hospital_citas',
     waitForConnections: true,
     connectionLimit: 10
   });
   
   module.exports = pool;
   ```

3. **Actualizar `/src/services/api.ts`**

   Reemplaza las funciones mock con llamadas fetch a tu backend:

   ```typescript
   const API_URL = 'http://localhost:3000/api';
   
   export const login = async (email: string, password: string) => {
     const response = await fetch(`${API_URL}/auth/login`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email, password })
     });
     if (!response.ok) throw new Error('Error en login');
     return response.json();
   };
   
   export const getCitas = async (): Promise<Cita[]> => {
     const response = await fetch(`${API_URL}/citas`, {
       headers: {
         'Authorization': `Bearer ${localStorage.getItem('token')}`
       }
     });
     if (!response.ok) throw new Error('Error al obtener citas');
     return response.json();
   };
   
   // Repite para todas las funciones...
   ```

4. **Implementar autenticación JWT**

   En tu backend, genera tokens JWT al hacer login y valídalos en cada request protegido.

5. **Configurar CORS en el backend**

   ```javascript
   const cors = require('cors');
   app.use(cors({
     origin: 'http://localhost:5173', // URL de tu frontend
     credentials: true
   }));
   ```

### Credenciales de Prueba (Mock Data)

- **Admin**: <admin@hospital.com> / admin123
- **Usuario**: <juan@email.com> / user123

### Características Implementadas

- ✅ Sistema de autenticación (login/registro)
- ✅ Gestión de citas (CRUD completo)
- ✅ Gestión de usuarios/pacientes (solo admin)
- ✅ Gestión de profesionales (solo admin)
- ✅ Filtrado de citas por estado
- ✅ Vistas diferentes para admin y usuario
- ✅ Diseño responsive
- ✅ Notificaciones con toast

### Tecnologías Utilizadas

- React + TypeScript
- Tailwind CSS
- Radix UI Components
- Sonner (notificaciones)
- LocalStorage (autenticación temporal)
