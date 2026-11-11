USE LlegApp;


ALTER TABLE rutas
    ADD COLUMN salidas VARCHAR(100) NOT NULL DEFAULT '',
    ADD COLUMN frecuencia VARCHAR(30) NOT NULL DEFAULT '';

UPDATE rutas SET salidas = '4:20 PM, 4:35 PM, 4:50 PM', frecuencia = 'Cada 15 min' WHERE numero = '205';
UPDATE rutas SET salidas = '4:25 PM, 4:45 PM, 5:05 PM', frecuencia = 'Cada 20 min' WHERE numero = '132';
UPDATE rutas SET salidas = '4:30 PM, 5:00 PM, 5:30 PM', frecuencia = 'Cada 30 min' WHERE numero = '109';



ALTER TABLE rutas
    ADD COLUMN coordenadas TEXT NULL;


UPDATE rutas SET coordenadas = 'Plaza de Bolívar: 5.0681,-75.5174; Parque Caldas: 5.0676,-75.5127; Fundadores: 5.0694,-75.5097; Universidad de Caldas: 5.0556,-75.4939; Estadio Palogrande: 5.0570,-75.4907; Cable Plaza: 5.0563,-75.4855' WHERE numero = '205';
UPDATE rutas SET coordenadas = 'Monumento a los Colonizadores: 5.0769,-75.5278; Chipre: 5.0758,-75.5254; Parque del Agua: 5.0671,-75.5236; Catedral Basílica: 5.0674,-75.5173; Parque Caldas: 5.0676,-75.5127; Fundadores: 5.0694,-75.5097; Mall Plaza: 5.0658,-75.4903' WHERE numero = '132';
UPDATE rutas SET coordenadas = 'Terminal de Transportes: 5.0494,-75.5063; Sancancio: 5.0477,-75.4923; Milán: 5.0459,-75.4799; La Enea: 5.0318,-75.4631; Aeropuerto La Nubia: 5.0296,-75.4641' WHERE numero = '109';
