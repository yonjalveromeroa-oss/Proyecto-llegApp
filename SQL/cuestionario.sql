
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
('Juan Pérez', 'juan.perez@ejemplo.com', 'Colegio Central', '1234seguro', 'Activo'),
('María Gómez', 'maria.gomez@ejemplo.com', 'Colegio San José', 'claveSegura', 'Activo');


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


CREATE TABLE editar_perfil (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    colegio VARCHAR(150),
    partida VARCHAR(150),
    notificaciones ENUM('Activadas', 'Desactivadas') DEFAULT 'Activadas',
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
                         ON UPDATE CURRENT_TIMESTAMP
);


INSERT INTO perfiles (nombre, email, colegio, partida, notificaciones)
VALUES ('Juan Romero', 'juan.romero@ejemplo.com', 'Colegio San José', 'Parque Principal', 'Activadas');


UPDATE perfiles
SET nombre = 'Juan R. Romero',
    colegio = 'Colegio Central',
    partida = 'Plaza Mayor',
    notificaciones = 'Desactivadas'
WHERE email = 'juan.romero@ejemplo.com';



