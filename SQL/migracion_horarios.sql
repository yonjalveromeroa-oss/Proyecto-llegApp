USE LlegApp;

-- Ejecutar una sola vez, DESPUÉS de migracion_datos.sql.
-- Agrega los horarios a cada ruta para que horario.html los lea de la base.
ALTER TABLE rutas
    ADD COLUMN salidas VARCHAR(100) NOT NULL DEFAULT '',
    ADD COLUMN frecuencia VARCHAR(30) NOT NULL DEFAULT '';

UPDATE rutas SET salidas = '4:20 PM, 4:35 PM, 4:50 PM', frecuencia = 'Cada 15 min' WHERE numero = '205';
UPDATE rutas SET salidas = '4:25 PM, 4:45 PM, 5:05 PM', frecuencia = 'Cada 20 min' WHERE numero = '132';
UPDATE rutas SET salidas = '4:30 PM, 5:00 PM, 5:30 PM', frecuencia = 'Cada 30 min' WHERE numero = '109';
