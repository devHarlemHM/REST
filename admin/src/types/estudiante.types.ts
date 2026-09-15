export interface Estudiante {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  ciudad: string | null;
  semestre_actual: string | null;
  edad: number | null;
  sexo: string | null;
  fecha_nacimiento: string | null;
  idioma: string | null;
}

export interface EstudianteResumen {
  id: number;
  nombres: string;
  apellidos: string;
  ultimo_semaforo: string | null;
  fecha_ultima_actividad: string | null;
}
