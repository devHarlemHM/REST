import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Mail, Users, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/solicitudes', icon: Mail, label: 'Solicitudes' },
  { to: '/pacientes', icon: Users, label: 'Pacientes' },
];

export function Sidebar() {
  const { logout, fullName } = useAuth();

  return (
    <aside className="w-64 bg-surface border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-primary">REST Panel</h1>
        <p className="text-xs text-text-muted mt-1">Psicologo</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-light text-primary'
                  : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
            <UserCircle size={18} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{fullName}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-coral-light hover:text-coral transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          Cerrar sesion
        </button>
      </div>
    </aside>
  );
}
