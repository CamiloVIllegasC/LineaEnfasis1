import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/app/components/ui/button';
import { CitasManager } from '@/app/components/CitasManager';
import { UsuariosManager } from '@/app/components/UsuariosManager';
import { ProfesionalesManager } from '@/app/components/ProfesionalesManager';
import { Calendar, Users, UserCog, LogOut, Hospital, Menu, X } from 'lucide-react';

type TabType = 'citas' | 'usuarios' | 'profesionales';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('citas');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'citas':
        return <CitasManager />;
      case 'usuarios':
        return <UsuariosManager />;
      case 'profesionales':
        return <ProfesionalesManager />;
      default:
        return <CitasManager />;
    }
  };

  const menuItems = [
    { id: 'citas' as TabType, label: 'Citas', icon: Calendar, show: true },
    { id: 'usuarios' as TabType, label: 'Usuarios', icon: Users, show: user?.role === 'admin' },
    { id: 'profesionales' as TabType, label: 'Profesionales', icon: UserCog, show: user?.role === 'admin' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Hospital className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sistema de Citas</h1>
                <p className="text-sm text-gray-500">Gestión hospitalaria</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.nombre}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-3 space-y-2">
              <div className="pb-3 border-b">
                <p className="text-sm font-medium text-gray-900">{user?.nombre}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <nav className="bg-white rounded-lg border p-2 space-y-1">
              {menuItems
                .filter(item => item.show)
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  );
                })}
            </nav>

            {/* Info card */}
            <div className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100 p-4">
              <h3 className="font-medium text-gray-900 mb-2">Conectar con MySQL</h3>
              <p className="text-sm text-gray-600">
                Este sistema usa datos mock. Para conectar con tu base de datos MySQL, 
                actualiza las funciones en <code className="bg-white px-1 py-0.5 rounded text-xs">services/api.ts</code>
              </p>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};
