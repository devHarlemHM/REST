import api from './axiosInstance';
import type { Asignacion, SolicitudConEstudiante } from '../types';

export const asignacionesApi = {
  getSolicitudesPendientes: async (): Promise<SolicitudConEstudiante[]> => {
    const { data } = await api.get('/api/asignaciones/psicologo/solicitudes');
    return data.data ?? data;
  },

  aprobar: async (id: number): Promise<Asignacion> => {
    const { data } = await api.patch(`/api/asignaciones/${id}/aprobar`);
    return data.data ?? data;
  },

  rechazar: async (id: number): Promise<Asignacion> => {
    const { data } = await api.patch(`/api/asignaciones/${id}/rechazar`);
    return data.data ?? data;
  },
};
