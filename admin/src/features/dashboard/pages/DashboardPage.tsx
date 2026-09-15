import { useEffect, useState } from 'react';
import { Users, Mail, MessageCircle } from 'lucide-react';
import { Header } from '../../../components/layout/Header';
import { Card } from '../../../components/ui';
import { LoadingSpinner, ErrorState } from '../../../components/shared';
import { pacientesApi, asignacionesApi } from '../../../api';

export default function DashboardPage() {
  const [stats, setStats] = useState({ pacientes: 0, solicitudes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [pacientes, solicitudes] = await Promise.all([
        pacientesApi.getMisPacientes(),
        asignacionesApi.getSolicitudesPendientes(),
      ]);
      setStats({ pacientes: pacientes.length, solicitudes: solicitudes.length });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div>
      <Header title="Dashboard" subtitle="Vista general de tu actividad" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center">
              <Users className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-text-primary">{stats.pacientes}</p>
              <p className="text-sm text-text-secondary">Pacientes activos</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
              <Mail className="text-semaforo-amarillo" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-text-primary">{stats.solicitudes}</p>
              <p className="text-sm text-text-secondary">Solicitudes pendientes</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-secondary-light flex items-center justify-center">
              <MessageCircle className="text-secondary" size={24} />
            </div>
            <div>
              <p className="text-3xl font-bold text-text-primary">--</p>
              <p className="text-sm text-text-secondary">Chats activos</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
