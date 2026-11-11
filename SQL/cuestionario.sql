
CREATE DATABASE LlegApp;
USE LlegApp;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    colegio VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL,
    estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO usuarios (nombre, correo, colegio, password, estado)
VALUES 
('Juan Pérez', 'juan.perez@ejemplo.com', 'Colegio Central', '$2y$10$zV5Bn4RfZaQ9Zgdd/MXLG.yrCCUio3Xd4OW10n1tJYwyBfcBRpvtu', 'Activo'),
('María Gómez', 'maria.gomez@ejemplo.com', 'Colegio San José', '$2y$10$S4NDFykWOyIRc3nA8Q09GuFdKyDfUpR268iU8WP6LfEisOIS1H9pq', 'Activo');


CREATE TABLE perfiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    colegio VARCHAR(150) NOT NULL,
    partida VARCHAR(150),
    notificaciones ENUM('Activadas', 'Desactivadas') DEFAULT 'Activadas',
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


INSERT INTO perfiles (nombre, email, colegio, partida, notificaciones)
VALUES ('Juan Romero', 'juan.romero@ejemplo.com', 'Colegio San José', 'Parque Principal', 'Activadas');





CREATE TABLE novedades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL,
    tipo ENUM('fuera-servicio', 'retraso') NOT NULL,
    comentarios TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_novedades_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);
