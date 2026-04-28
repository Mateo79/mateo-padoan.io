// src/components/Sidebar.tsx
import { FC, useState } from 'react';
import { useTranslation } from '@/contexts/useTranslation';
import TerminalModal from './TerminalModal';
import GomokuModal from './GomokuModal';
import MusicModal from './MusicModal';
import CalculatorModal from './CalculatorModal';
import VSCModal from './VscModal';
import { 
    FaUser, 
    FaChartLine, 
    FaChessPawn, 
    FaTerminal, 
    FaCode, 
    FaCalculator, 
    FaMusic, 
    FaDesktop, 
    FaTimes, 
    FaPowerOff 
} from 'react-icons/fa';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, toggleSidebar, currentPage, onPageChange }) => {
  const { t } = useTranslation();
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isGomokuOpen, setIsGomokuOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isVSCOpen, setIsVSCOpen] = useState(false);

  if (!isOpen) return null;

  const menuSections = [
    {
      title: t('sidebar.navTitle'),
      items: [
        {
          icon: <FaUser />,
          label: t('nav.about'),
          desc: t('sidebar.aboutDesc'),
          action: () => onPageChange('about')
        },
        {
          icon: <FaChartLine />,
          label: t('nav.dashboard'),
          desc: t('sidebar.dashboardDesc'),
          action: () => onPageChange('dashboard')
        },
      ],
    },
    {
      title: t('sidebar.appsTitle'),
      items: [
        {
          icon: <FaChessPawn />,
          label: t('nav.gomoku'),
          desc: t('sidebar.gomokuDesc'),
          action: () => setIsGomokuOpen(true)
        },
        {
          icon: <FaTerminal />,
          label: t('nav.terminal'),
          desc: t('sidebar.terminalDesc'),
          action: () => setIsTerminalOpen(true)
        },
        {
          icon: <FaCode />,
          label: t('nav.vscode'),
          desc: t('sidebar.vscodeDesc'),
          action: () => setIsVSCOpen(true)
        },
        {
          icon: <FaCalculator />,
          label: t('nav.calculator'),
          desc: t('sidebar.calculatorDesc'),
          action: () => setIsCalculatorOpen(true)
        },
        {
          icon: <FaMusic />,
          label: t('nav.music'),
          desc: t('sidebar.musicDesc'),
          action: () => setIsMusicOpen(true)
        },
      ],
    }
  ];

  return (
    <>
      {/* Modals */}
      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />
      <GomokuModal
        isOpen={isGomokuOpen}
        onClose={() => setIsGomokuOpen(false)}
      />
      <MusicModal
        isOpen={isMusicOpen}
        onClose={() => setIsMusicOpen(false)}
      />

      <VSCModal
        isOpen={isVSCOpen}
        onClose={() => setIsVSCOpen(false)}
      />

      <CalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-purple-500/20 p-4 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-2 text-purple-400 flex items-center justify-center">
              <FaDesktop className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-purple-400">Aincrad</h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-white text-lg"
            aria-label={t('sidebar.closeAria')}
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h2 className="text-purple-400 font-semibold mb-3 text-sm uppercase tracking-wider">
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className={`flex items-start p-2 rounded cursor-pointer group transition-all ${
                      currentPage === 'about' && item.label === t('nav.about')
                        ? 'bg-purple-600/30 border border-purple-500'
                        : currentPage === 'dashboard' && item.label === t('nav.dashboard')
                          ? 'bg-purple-600/30 border border-purple-500'
                          : 'hover:bg-gray-800'
                    }`}
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else {
                        console.log(`Ouvrir : ${item.label}`);
                      }
                    }}
                  >
                    <div className="mr-2 mt-1 group-hover:text-green-400 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-medium text-white">{item.label}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer de la sidebar */}
        <div className="mt-4 pt-4 border-t border-purple-500/20">
          <button 
            className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded flex items-center justify-center text-sm font-medium transition-colors"
            onClick={() => {
              // Animation de shutdown simulée
              document.body.style.transition = 'opacity 2s ease-out';
              document.body.style.opacity = '0';
              setTimeout(() => {
                alert(t('sidebar.shutdownAlert'));
                document.body.style.opacity = '1';
              }, 2000);
            }}
          >
            <FaPowerOff className="mr-2 w-4 h-4" />
            {t('sidebar.shutdown')}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
