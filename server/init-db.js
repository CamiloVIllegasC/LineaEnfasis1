import db from './config/db.js';

const createTables = async () => {
    try {
        console.log('Iniciando creación de tablas...');

        // Tabla usuarios
        await db.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                documento VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            );
        `);
        console.log('Tabla "usuarios" verificada/creada.');

        // Tabla profesionales
        await db.query(`
            CREATE TABLE IF NOT EXISTS profesionales (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                especialidad ENUM('cardiologia', 'pediatria', 'ginecologia', 'medicina_general', 'traumatologia', 'dermatologia', 'oftalmologia', 'psiquiatria') NOT NULL,
                telefono VARCHAR(50) NOT NULL,
                estado ENUM('activo', 'inactivo', 'vacaciones') DEFAULT 'activo'
            );
        `);
        console.log('Tabla "profesionales" verificada/creada.');

        // Tabla citas
        await db.query(`
            CREATE TABLE IF NOT EXISTS citas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fecha DATE NOT NULL,
                hora TIME NOT NULL,
                estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') DEFAULT 'pendiente',
                profesionalId INT NOT NULL,
                usuarioId INT NOT NULL,
                FOREIGN KEY (profesionalId) REFERENCES profesionales(id),
                FOREIGN KEY (usuarioId) REFERENCES usuarios(id)
            );
        `);
        console.log('Tabla "citas" verificada/creada.');

        console.log('Inicialización de base de datos completada exitosamente.');
        process.exit(0);

    } catch (error) {
        console.error('Error al crear las tablas:', error);
        process.exit(1);
    }
};

createTables();
