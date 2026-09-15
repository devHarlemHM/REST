import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Activity, ClipboardList, BarChart3 } from 'lucide-react';
import { Header } from '../../../components/layout/Header';
import { Card, Badge, Button } from '../../../components/ui';
import { LoadingSpinner, ErrorState } from '../../../components/shared';
import { pacientesApi, chatApi } from '../../../api';
import type { Estudiante, Evaluacion } from '../../../types';

export default function PacienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const estudianteId = Number(id);

  const [perfil, setPerfil] = useState<Estudiante | null>(null);
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [estudianteId]);

  async function loadData() {
    try {
      const [perfilData, evalsData] = await Promise.all([
        pacientesApi.getPerfil(estudianteId),
        pacientesApi.getEvaluaciones(estudianteId),
      ]);
      setPerfil(perfilData);
      setEvaluaciones(evalsData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar datos del paciente');
    } finally {
      setLoading(false);
    }
  }

  async function handleAbrirChat() {
    try {
      const chats = await chatApi.getChats(true);
      const chatExistente = chats.find(
        (c: any) => c.estudiante_id === estudianteId && !c.isSendByAi
      );
      if (chatExistente) {
        navigate(`/chat/${estudianteId}?chatId=${chatExistente.id}`);
      } else {
        const nuevoChat = await chatApi.createChat(estudianteId);
        navigate(`/chat/${estudianteId}?chatId=${nuevoChat.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al abrir chat');
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;
  if (!perfil) return <ErrorState message="Paciente no encontrado" />;

  const ultimoEvaluacion = evaluaciones[0];

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/pacientes')} className="text-text-secondary hover:text-text-primary cursor-pointer">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <Header
            title={`${perfil.nombres} ${perfil.apellidos}`}
            subtitle={perfil.correo}
            actions={
              <Button onClick={handleAbrirChat}>
                <MessageCircle size={18} />
                Abrir chat
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="font-semibold text-text-primary mb-4">Informacion personal</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-secondary">Ciudad:</dt>
              <dd className="font-medium">{perfil.ciudad ?? '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Semestre:</dt>
              <dd className="font-medium">{perfil.semestre_actual ?? '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Edad:</dt>
              <dd className="font-medium">{perfil.edad ?? '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Sexo:</dt>
              <dd className="font-medium">{perfil.sexo ?? '-'}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h3 className="font-semibold text-text-primary mb-4">Ultima evaluacion</h3>
          {ultimoEvaluacion ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">Estado:</span>
                <Badge variant={ultimoEvaluacion.estado_semaforo === 'verde' ? 'verde' : ultimoEvaluacion.estado_semaforo === 'amarillo' ? 'amarillo' : 'rojo'}>
                  {ultimoEvaluacion.estado_semaforo}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Puntaje:</span>
                <span className="font-medium">{ultimoEvaluacion.puntaje_total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Fecha:</span>
                <span className="font-medium">{new Date(ultimoEvaluacion.fecha).toLocaleDateString('es-CO')}</span>
              </div>
              {ultimoEvaluacion.subcategoria_principal && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Subcategoria:</span>
                  <span className="font-medium">{ultimoEvaluacion.subcategoria_principal}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-text-muted">Sin evaluaciones registradas</p>
          )}
        </Card>

        <Card>
          <h3 className="font-semibold text-text-primary mb-4">Acciones rapidas</h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <BarChart3 size={18} />
              Estadisticas emocionales
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Activity size={18} />
              Registro emocional
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <ClipboardList size={18} />
              Encuestas respondidas
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
