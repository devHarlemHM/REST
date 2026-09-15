import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RequireAuth } from './features/auth/guards/RequireAuth';
import { Layout } from './components/layout/Layout';
import LoginPage from './features/auth/pages/LoginPage';
import { ForbiddenPage } from './features/auth/pages/ForbiddenPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import SolicitudesPage from './features/solicitudes/pages/SolicitudesPage';
import PacientesPage from './features/pacientes/pages/PacientesPage';
import PacienteDetailPage from './features/pacientes/pages/PacienteDetailPage';
import ChatPage from './features/chat/pages/ChatPage';
import PerfilPage from './features/perfil/pages/PerfilPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/acceso-denegado" element={<ForbiddenPage />} />

        <Route element={<RequireAuth><Layout /></RequireAuth>}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/solicitudes" element={<SolicitudesPage />} />
          <Route path="/pacientes" element={<PacientesPage />} />
          <Route path="/pacientes/:id" element={<PacienteDetailPage />} />
          <Route path="/chat/:estudianteId" element={<ChatPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
