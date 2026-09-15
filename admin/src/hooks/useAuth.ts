import { useAuthStore } from '../features/auth/store/authStore';

export function useAuth() {
  const { token, user, isAuthenticated, login, logout } = useAuthStore();

  const isPsicologo = user?.rol === 'psicologo';
  const isAdmin = user?.rol === 'admin';
  const fullName = user ? `${user.nombres} ${user.apellidos}` : '';

  return { token, user, isAuthenticated, isPsicologo, isAdmin, fullName, login, logout };
}
