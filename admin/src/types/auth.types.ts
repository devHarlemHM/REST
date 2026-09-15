export interface User {
  id: number;
  correo: string;
  nombres: string;
  apellidos: string;
  rol: 'admin' | 'psicologo' | 'estudiante';
  is_active: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}
