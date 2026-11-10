USE LlegApp;

-- Ejecutar una sola vez, DESPUÉS de migracion_datos.sql.
-- Agrega los horarios a cada ruta para que horario.html los lea de la base.
ALTER TABLE rutas
    ADD COLUMN salidas VARCHAR(100) NOT NULL DEFAULT '',
    ADD COLUMN frecuencia VARCHAR(30) NOT NULL DEFAULT '';

UPDATE rutas SET salidas = '4:20 PM, 4:35 PM, 4:50 PM', frecuencia = 'Cada 15 min' WHERE numero = '205';
UPDATE rutas SET salidas = '4:25 PM, 4:45 PM, 5:05 PM', frecuencia = 'Cada 20 min' WHERE numero = '132';
UPDATE rutas SET salidas = '4:30 PM, 5:00 PM, 5:30 PM', frecuencia = 'Cada 30 min' WHERE numero = '109';


-- Coordenadas de los paraderos para dibujar cada ruta en mapa.html (antes estaban quemadas en el HTML).
-- Formato: "lat,lng; lat,lng; ...". Si ya ejecutaste lo anterior, ejecuta solo desde aquí.
ALTER TABLE rutas
    ADD COLUMN coordenadas TEXT NULL;

UPDATE rutas SET coordenadas = '5.0703,-75.5138; 5.0720,-75.5145; 5.0740,-75.5160; 5.0760,-75.5175' WHERE numero = '205';
UPDATE rutas SET coordenadas = '5.0680,-75.5170; 5.0695,-75.5150; 5.0715,-75.5130; 5.0738,-75.5112; 5.0760,-75.5100' WHERE numero = '132';
UPDATE rutas SET coordenadas = '5.0650,-75.5200; 5.0672,-75.5185; 5.0690,-75.5165; 5.0712,-75.5150; 5.0735,-75.5140' WHERE numero = '109';
