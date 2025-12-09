import React from 'react';
import { Activity, Users, FileText, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'patients' | 'research';
  setActiveTab: (tab: 'patients' | 'research') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 bg-slate-950">
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-emerald-400" />
            <span className="text-xl font-bold tracking-tight">HepatoTrack</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-2">
          <button
            onClick={() => setActiveTab('patients')}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'patients' 
                ? 'bg-emerald-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Pacientes
          </button>
          
          <button
            onClick={() => setActiveTab('research')}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'research' 
                ? 'bg-emerald-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-5 h-5 mr-3" />
            Protocolos de Investigación
          </button>
        </nav>

        <div className="absolute bottom-0 w-full p-4 bg-slate-950">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold">
              DR
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Dr. Investigador</p>
              <p className="text-xs text-slate-400">Hepatología</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200 lg:px-8">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-500 rounded-md lg:hidden hover:bg-slate-100"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-4">
             {/* Header utilities could go here */}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;