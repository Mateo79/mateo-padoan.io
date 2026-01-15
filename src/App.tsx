import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="bg-black text-white min-h-screen flex font-mono overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main content */}
      <main className="flex-1 p-4 overflow-auto bg-gradient-to-br from-black to-gray-900">
        <Dashboard />
      </main>

      {/* Barre de statut en bas */}
      <footer className="fixed bottom-0 left-0 right-0 bg-black border-t border-purple-500/20 text-xs text-gray-400 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Système opérationnel</span>
          </div>
          <div>• ILO</div>
          <div>Uptime: 9d 23h 48m 56s</div>
        </div>
        <div className="flex items-center space-x-4">
          <div>Volume: 75%</div>
          <div>Batterie: 100% 🔋</div>
        </div>
      </footer>
    </div>
  );
}