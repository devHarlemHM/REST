import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { Header } from '../../../components/layout/Header';
import { Card, Badge } from '../../../components/ui';
import { LoadingSpinner, ErrorState, EmptyState } from '../../../components/shared';
import { pacientesApi } from '../../../api';
import type { EstudianteResumen } from '../../../types';

const semaforoColors: Record<string, 'verde' | 'amarillo' | 'rojo'> = {
  verde: 'verde',
  amarillo: 'amarillo',
  rojo: 'rojo',
};

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<EstudianteResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { loadPacientes(); }, []);

  async function loadPacientes() {
    try {
      const data = await pacientesApi.getMisPacientes();
      setPacientes(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={loadPacientes} />;

  return (
    <div>
      <Header title="Pacientes" subtitle="Estudiantes asignados" />

      {pacientes.length === 0 ? (
        <EmptyState
          icon={<User size={48} />}
          title="No tienes pacientes asignados"
          description="Los pacientes apareceran aqui cuando aceptes una solicitud."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pacientes.map((p) => (
            <Card
              key={p.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/pacientes/${p.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center">
                  <User className="text-primary" size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-primary truncate">
                    {p.nombres} {p.apellidos}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {p.ultimo_semaforo && (
                      <Badge variant={semaforoColors[p.ultimo_semaforo] ?? 'gray'}>
                        {p.ultimo_semaforo}
                      </Badge>
                    )}
                  </div>
                  {p.fecha_ultima_actividad && (
                    <p className="text-xs text-text-muted mt-2">
                      Ultima actividad: {new Date(p.fecha_ultima_actividad).toLocaleDateString('es-CO')}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
