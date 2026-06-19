CREATE DATABASE IF NOT EXISTS servicio_tecnico
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE servicio_tecnico;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS servicios;
DROP TABLE IF EXISTS dispositivos;
DROP TABLE IF EXISTS oficinas;
DROP TABLE IF EXISTS clientes;
DROP TABLE IF EXISTS usuarios;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE usuarios (
  id_usuario INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  `contraseña` VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'tecnico', 'cliente') NOT NULL DEFAULT 'tecnico',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY uq_usuarios_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE clientes (
  id_cliente INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  cuit VARCHAR(20) NOT NULL,
  contacto VARCHAR(120) NULL,
  email VARCHAR(150) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_cliente),
  UNIQUE KEY uq_clientes_cuit (cuit)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE oficinas (
  id_oficina INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_cliente INT UNSIGNED NOT NULL,
  direccion VARCHAR(180) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_oficina),
  KEY idx_oficinas_cliente (id_cliente),
  CONSTRAINT fk_oficinas_clientes
    FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE dispositivos (
  id_dispositivo INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_oficina INT UNSIGNED NOT NULL,
  tipo VARCHAR(80) NOT NULL,
  marca VARCHAR(80) NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  estado ENUM('operativo', 'con fallas', 'en reparación', 'fuera de servicio', 'de baja') NOT NULL DEFAULT 'operativo',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_dispositivo),
  KEY idx_dispositivos_oficina (id_oficina),
  CONSTRAINT fk_dispositivos_oficinas
    FOREIGN KEY (id_oficina) REFERENCES oficinas (id_oficina)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE servicios (
  id_servicio INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_dispositivo INT UNSIGNED NOT NULL,
  id_usuario INT UNSIGNED NOT NULL,
  fecha DATE NOT NULL,
  tipo ENUM('mantenimiento', 'reparación') NOT NULL,
  descripcion TEXT NOT NULL,
  estado ENUM('pendiente', 'en proceso', 'finalizado') NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_servicio),
  KEY idx_servicios_dispositivo (id_dispositivo),
  KEY idx_servicios_usuario (id_usuario),
  CONSTRAINT fk_servicios_dispositivos
    FOREIGN KEY (id_dispositivo) REFERENCES dispositivos (id_dispositivo)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_servicios_usuarios
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO usuarios (nombre, email, `contraseña`, rol) VALUES
  ('Administrador', 'admin@local.test', '$2b$10$dNfhy2RFx1J8V9GReP9qXemxBOb6i0zZttj8B/hHN2z/K2H8UmBiW', 'admin'),
  ('Tecnico Demo', 'tecnico@local.test', '$2b$10$dNfhy2RFx1J8V9GReP9qXemxBOb6i0zZttj8B/hHN2z/K2H8UmBiW', 'tecnico');

INSERT INTO clientes (nombre, cuit, contacto, email) VALUES
  ('Cliente Demo SA', '30-00000000-1', 'Mesa de ayuda', 'cliente@local.test');

INSERT INTO oficinas (id_cliente, direccion, ciudad) VALUES
  (1, 'Av. Siempre Viva 742', 'Buenos Aires');

INSERT INTO dispositivos (id_oficina, tipo, marca, modelo, estado) VALUES
  (1, 'Notebook', 'Lenovo', 'ThinkPad Demo', 'operativo');

INSERT INTO servicios (id_dispositivo, id_usuario, fecha, tipo, descripcion, estado) VALUES
  (1, 2, CURDATE(), 'mantenimiento', 'Servicio de prueba para validar el entorno local.', 'pendiente');
