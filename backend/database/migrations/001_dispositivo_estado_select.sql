USE servicio_tecnico;

UPDATE dispositivos
SET estado = 'operativo'
WHERE estado IS NULL OR estado = '' OR estado = 'pendiente';

ALTER TABLE dispositivos
  MODIFY estado ENUM('operativo', 'con fallas', 'en reparación', 'fuera de servicio', 'de baja') NOT NULL DEFAULT 'operativo';
