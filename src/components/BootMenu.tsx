import { useState } from 'react';
import LoadingScreen from './LoadingScreen';
import { FaWindows, FaLinux, FiCornerDownLeft } from './icons/ReactIcons';

interface BootMenuProps {
  onBootComplete: (mode: 'portfolio' | 'cv') => void;
}

const BootMenu = ({ onBootComplete }: BootMenuProps) => {
  const [selectedOption, setSelectedOption] = useState<'portfolio' | 'cv' | null>(null);
  const [isBooting, setIsBooting] = useState(false);

  const handleSelect = (option: 'portfolio' | 'cv') => {
    setSelectedOption(option);
    setIsBooting(true);
  };

  const handleBootComplete = () => {
    if (selectedOption) {
      onBootComplete(selectedOption);
    }
  };

  // Si boot screen -> loading screen
  if (isBooting) {
    return (
      <LoadingScreen
        mode={selectedOption!}
        onComplete={handleBootComplete}
      />
    );
  }

  // grub/dual-boot style
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Aincrad OS</h1>
          <p className="text-gray-400">Select an operating system to boot</p>
          <p className="text-gray-500 text-sm mt-1">Press arrow keys or click to select</p>
        </div>

        {/* Boot Options */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          {/* Option 1: Portfolio (Windows 11) */}
          <button
            onClick={() => handleSelect('portfolio')}
            className="w-full p-6 flex items-center gap-4 hover:bg-blue-600/20 transition-colors border-b border-gray-700 group"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaWindows className="w-7 h-7 text-white" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-white font-semibold text-lg">Windows 11</h3>
              <p className="text-gray-400 text-sm">Portfolio - Interactive OS Experience</p>
            </div>
            <FiCornerDownLeft className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
          </button>

          {/* CV (Ubuntu/Linux) */}
          <button
            onClick={() => handleSelect('cv')}
            className="w-full p-6 flex items-center gap-4 hover:bg-orange-600/20 transition-colors group"
          >
            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaLinux className="w-7 h-7 text-white" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-white font-semibold text-lg">Ubuntu</h3>
              <p className="text-gray-400 text-sm">CV - Download PDF Documents</p>
            </div>
            <FiCornerDownLeft className="w-5 h-5 text-gray-500 group-hover:text-orange-400 transition-colors" />
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p className="flex items-center justify-center gap-2">
            <span className="px-2 py-0.5 bg-gray-800 rounded border border-gray-600">↑↓</span>
            Navigate • 
            <span className="px-2 py-0.5 bg-gray-800 rounded border border-gray-600">Enter</span>
            Select • 
            <span className="px-2 py-0.5 bg-gray-800 rounded border border-gray-600">Esc</span>
            Exit
          </p>
          <p className="mt-2">© 2025 Mateo Padoan - Epitech</p>
        </div>
      </div>
    </div>
  );
};

export default BootMenu;
