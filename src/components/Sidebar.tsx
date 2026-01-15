import { FC } from 'react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  if (!isOpen) return null;

  const menuSections = [
    {
      title: 'Applications',
      items: [
        { icon: '🔑', label: 'Password Generator', desc: 'Générateur de mots de passe sécurisé' },
        { icon: '💻', label: 'Terminal Web', desc: 'Ouvrir le terminal web' },
        { icon: '🧩', label: 'VS Code', desc: 'Éditeur de code source' },
        { icon: '📝', label: 'Éditeur de texte', desc: 'Créer ou modifier des fichiers' },
        { icon: '🧮', label: 'Calculatrice', desc: 'Calculs simples ou avancés' },
        { icon: '🎵', label: 'Musique', desc: 'Lecteur audio intégré' },
        { icon: '📁', label: 'Fichiers', desc: 'Navigateur de fichiers local' },
      ],
    },
    {
      title: 'Système',
      items: [
        { icon: '📄', label: 'ReadMe', desc: 'Informations & crédits' },
        { icon: '🔒', label: 'Sécurité', desc: 'Paramètres de confidentialité' },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-purple-500/20 p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 mr-2 text-purple-400">🖥️</div>
          <h1 className="text-xl font-bold text-purple-400">RuruOS</h1>
        </div>
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white text-lg"
          aria-label="Fermer la sidebar"
        >
          ✕
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
                  className="flex items-start p-2 rounded hover:bg-gray-800 cursor-pointer group"
                  onClick={() => console.log(`Ouvrir : ${item.label}`)}
                >
                  <span className="text-lg mr-2 mt-0.5 group-hover:text-green-400">{item.icon}</span>
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
        <button className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded flex items-center justify-center text-sm font-medium transition-colors">
          <span className="mr-2">🔌</span>
          Éteindre le système
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;