// src/App.tsx
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import About from '@/components/About';
import SettingsSwitch from '@/components/SettingsSwitch';
import BootMenu from '@/components/BootMenu';
import { SettingsProvider, useSettings } from '@/contexts/SettingsContext';
import { FaLinux, FaFileDownload } from 'react-icons/fa';

type Page = 'about' | 'dashboard';
type BootMode = 'menu' | 'portfolio' | 'cv';

const AppContent = ({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  currentPage, 
  setCurrentPage,
  bootMode,
  setBootMode
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
  currentPage: Page;
  setCurrentPage: (p: Page) => void;
  bootMode: BootMode;
  setBootMode: (mode: BootMode) => void;
}) => {
  const { settings } = useSettings();

  // Si on est encore au menu de boot
  if (bootMode === 'menu') {
    return <BootMenu onBootComplete={setBootMode} />;
  }

  // Si on a choisi CV (Ubuntu)
  if (bootMode === 'cv') {
    return (
      <div className={`min-h-screen flex font-mono overflow-hidden ${
        settings.theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
      }`}>
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center max-w-2xl">
            <FaLinux className="text-6xl mb-4 mx-auto" />
            <h1 className="text-3xl font-bold mb-4">CV Documents</h1>
            <p className="text-gray-400 mb-8">Download my CV in PDF format</p>
            
            <div className="space-y-4">
              <a
                href="/cv-mateo-padoan-fr.pdf"
                download
                className="block w-full bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-lg transition-colors flex items-center justify-center gap-3"
              >
                <FaFileDownload className="w-5 h-5" /> CV Français (PDF)
              </a>
              <a
                href="/cv-mateo-padoan-en.pdf"
                download
                className="block w-full bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-lg transition-colors flex items-center justify-center gap-3"
              >
                <FaFileDownload className="w-5 h-5" /> CV English (PDF)
              </a>
              <a
                href="/cv-mateo-padoan-event.pdf"
                download
                className="block w-full bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-lg transition-colors flex items-center justify-center gap-3"
              >
                <FaFileDownload className="w-5 h-5" /> CV Événementiel (PDF)
              </a>
            </div>

            <button
              onClick={() => setBootMode('menu')}
              className="mt-8 text-gray-400 hover:text-white underline"
            >
              ← Return to Boot Menu
            </button>
          </div>
        </div>
        <SettingsSwitch />
      </div>
    );
  }

  // Sinon, afficher le portfolio normal (Windows 11)
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'about':
      default:
        return <About onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div 
      className={`min-h-screen flex font-mono overflow-hidden ${
        settings.theme === 'dark' 
          ? 'bg-black text-white' 
          : 'bg-white text-black'
      } ${settings.accessibility === 'high-contrast' ? 'high-contrast' : ''}`}
    >
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        currentPage={currentPage}
        onPageChange={(page: string) => setCurrentPage(page as Page)} 
      />
      <main className="flex-1 p-4 overflow-auto">
        {renderPage()}
        <SettingsSwitch />
      </main>
    </div>
  );
};

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('about');
  const [bootMode, setBootMode] = useState<BootMode>('menu');

  return (
    <SettingsProvider>
      <AppContent 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        bootMode={bootMode}
        setBootMode={setBootMode}
      />
    </SettingsProvider>
  );
}
