import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../../api';
import { useAuthStore } from '../store/authStore';
import { Button, Input, Card } from '../../../components/ui';

export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authApi.login(correo, contrasena);
      const user = (data as any).user ?? data;
      const token = (data as any).token;
      login(token, user);

      if (user.rol !== 'psicologo') {
        setError('Este panel es exclusivo para psicologos');
        return;
      }

      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-secondary p-4">
      <Card className="w-full max-w-md" padding="lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">REST Panel</h1>
          <p className="text-sm text-text-secondary mt-2">Psicologo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Correo electronico"
            type="email"
            placeholder="correo@ejemplo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <Input
            label="Contrasena"
            type="password"
            placeholder="Tu contrasena"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-coral bg-coral-light px-3 py-2 rounded-lg">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
