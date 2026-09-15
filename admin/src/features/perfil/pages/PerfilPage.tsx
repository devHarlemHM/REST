import { useAuth } from '../../../hooks/useAuth';
import { Header } from '../../../components/layout/Header';
import { Card } from '../../../components/ui';

export default function PerfilPage() {
  const { user } = useAuth();

  return (
    <div>
      <Header title="Mi perfil" subtitle="Informacion de tu cuenta" />

      <Card>
        <dl className="space-y-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-text-secondary">Nombre completo:</dt>
            <dd className="font-medium">{user?.nombres} {user?.apellidos}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-secondary">Correo:</dt>
            <dd className="font-medium">{user?.correo}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-secondary">Rol:</dt>
            <dd className="font-medium capitalize">{user?.rol}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
