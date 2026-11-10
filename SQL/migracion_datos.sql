USE LlegApp;

-- Ejecutar una sola vez sobre la base existente.
ALTER TABLE usuarios
    ADD COLUMN rol ENUM('usuario', 'admin') NOT NULL DEFAULT 'usuario';

-- Después de registrar la cuenta administradora, asignarle el rol con:
-- UPDATE usuarios SET rol = 'admin' WHERE correo = 'correo-administrador@ejemplo.com';

CREATE TABLE IF NOT EXISTS novedades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL,
    tipo ENUM('fuera-servicio', 'retraso') NOT NULL,
    comentarios TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_novedades_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS rutas (
    numero VARCHAR(10) PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    duracion VARCHAR(30) NOT NULL,
    costo VARCHAR(30) NOT NULL,
    paraderos INT NOT NULL,
    estado VARCHAR(40) NOT NULL,
    link VARCHAR(100) NOT NULL
);

-- Rutas de EJEMPLO para probar la app. Las rutas reales se crean, editan y eliminan
-- desde la aplicación (administrador.html y rutas_guardadas.html), no aquí.
INSERT INTO rutas (numero, descripcion, duracion, costo, paraderos, estado, link) VALUES
('205', 'Parque Principal → Centro → Av. Bolívar → Colegio', '28 min', '$2.400', 6, 'Retraso', 'mapa.html'),
('132', 'Parque Principal → Centro → Av. Bolívar → Colegio', '35 min', '$2.400', 8, 'En servicio', 'mapa.html'),
('109', 'Parque Principal → Centro → Av. Bolívar → Colegio', '40 min', '$2.600', 10, 'Fuera de servicio', 'mapa.html')
ON DUPLICATE KEY UPDATE
    descripcion = VALUES(descripcion), duracion = VALUES(duracion), costo = VALUES(costo),
    paraderos = VALUES(paraderos), estado = VALUES(estado), link = VALUES(link);

CREATE TABLE IF NOT EXISTS rutas_guardadas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    numero VARCHAR(10) NOT NULL,
    fecha_guardado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_usuario_ruta (usuario_id, numero),
    CONSTRAINT fk_rutas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_ruta_guardada FOREIGN KEY (numero) REFERENCES rutas(numero) ON DELETE CASCADE
);