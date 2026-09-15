export type EstadoAsignacion = 'pendiente' | 'aprobado' | 'rechazado' | 'finalizado';

export interface Asignacion {
  id: number;
  estudiante_id: number;
  psicologo_id: number;
  estado: EstadoAsignacion;
  mensaje: string | null;
  solicitado_en: string;
  procesado_en: string | null;
  finalizado_en: string | null;
}

export interface SolicitudConEstudiante extends Asignacion {
  estudiante?: {
    id: number;
    nombres: string;
    apellidos: string;
    correo: string;
  };
}
