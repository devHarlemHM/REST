export interface Evaluacion {
  id: number;
  usuario_id: number;
  puntaje_total: number;
  estado_semaforo: 'verde' | 'amarillo' | 'rojo';
  subcategoria_principal: string | null;
  observaciones: string | null;
  fecha: string;
}

export interface RegistroEmocional {
  id: number;
  usuario_id: number;
  pregunta_id: number;
  opcion_id: number;
  fecha: string;
  observaciones: string | null;
  pregunta?: { texto: string; categoria: string };
  opcion?: { nombre: string; puntaje: number };
}

export interface EstadisticasEmocionales {
  promedio_general: number;
  por_dimension: Record<string, number>;
}
