-- Esquema SQLite Local-First para Karpintero Studio

CREATE TABLE IF NOT EXISTS proyectos (
    id TEXT PRIMARY KEY,
    codigo TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    cliente_nombre TEXT,
    cliente_telefono TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado TEXT DEFAULT 'MEDICION'
);

CREATE TABLE IF NOT EXISTS lecturas_laser (
    id TEXT PRIMARY KEY,
    proyecto_id TEXT REFERENCES proyectos(id) ON DELETE CASCADE,
    etiqueta TEXT NOT NULL,
    valor_mm REAL NOT NULL,
    angulo_inclinometro REAL DEFAULT 90.0,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS piezas_despiece (
    id TEXT PRIMARY KEY,
    proyecto_id TEXT REFERENCES proyectos(id) ON DELETE CASCADE,
    modulo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    largo_mm REAL NOT NULL,
    ancho_mm REAL NOT NULL,
    espesor_mm REAL NOT NULL,
    material TEXT NOT NULL,
    veta_direccion TEXT DEFAULT 'LONGITUDINAL',
    canto_perimetral JSON,
    qr_impreso INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS retales (
    id TEXT PRIMARY KEY,
    codigo_qr TEXT UNIQUE NOT NULL,
    material TEXT NOT NULL,
    largo_mm REAL NOT NULL,
    ancho_mm REAL NOT NULL,
    espesor_mm REAL NOT NULL,
    ubicacion_estanteria TEXT,
    disponible INTEGER DEFAULT 1
);
