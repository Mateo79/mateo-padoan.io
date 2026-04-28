import { useState, useEffect } from 'react';
import { FaWindows, FaLinux, FaCheck, FaCircle, FaCog } from './icons/ReactIcons';

interface LoadingScreenProps {
  mode: 'portfolio' | 'cv';
  onComplete: () => void;
}

interface LoadComponent {
  name: string;
  progress: number;
  status: 'pending' | 'loading' | 'complete';
  startTime: number;
  duration: number;
}

const LoadingScreen = ({ mode, onComplete }: LoadingScreenProps) => {
  const [components, setComponents] = useState<LoadComponent[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  // Composants à charger
  const baseComponents = [
    { name: 'Graphique', weight: 1 },
    { name: 'UI', weight: 1.2 },
    { name: 'UX', weight: 1 },
    { name: 'Responsive', weight: 1.5 },
    { name: 'Accessibility', weight: 1.1 },
    { name: 'Performance', weight: 0.9 },
    { name: 'SEO', weight: 1.3 },
    { name: 'Animations', weight: 1.4 },
  ];

  const portfolioComponents = [
    ...baseComponents,
    { name: 'Interactive Elements', weight: 1.6 },
    { name: 'State Management', weight: 1.2 },
  ];

  const cvComponents = [
    ...baseComponents,
    { name: 'PDF Generation', weight: 1 },
    { name: 'Document Layout', weight: 0.8 },
  ];

  // Initialiser les composants avec des durées aléatoires
  useEffect(() => {
    const randomDuration = 8000 + Math.random() * 7000;
    setTotalDuration(randomDuration);

    const selectedComponents = mode === 'portfolio' ? portfolioComponents : cvComponents;
    const totalWeight = selectedComponents.reduce((sum, comp) => sum + comp.weight, 0);
    
    const initialized = selectedComponents.map((comp) => {
      const baseDuration = (comp.weight / totalWeight) * randomDuration;
      const variance = 0.7 + Math.random() * 0.6;
      const duration = baseDuration * variance;
      const startDelay = Math.random() * 3000;
      
      return {
        name: comp.name,
        progress: 0,
        status: 'pending' as const,
        startTime: startDelay,
        duration: duration,
      };
    });

    setComponents(initialized);

    initialized.forEach((comp, index) => {
      setTimeout(() => {
        startComponentLoading(index, comp.duration);
      }, comp.startTime);
    });

  }, [mode]);

  const startComponentLoading = (index: number, duration: number) => {
    setComponents(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index].status = 'loading';
      }
      return updated;
    });

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);

      setComponents(prev => {
        const updated = [...prev];
        const comp = updated[index];
        
        if (comp) {
          comp.progress = progress;
          
          if (progress >= 100) {
            comp.status = 'complete';
            clearInterval(interval);
          }
        }
        return updated;
      });
    }, 50);
  };

  useEffect(() => {
    if (components.length === 0) return;

    const totalProgress = components.reduce((sum, comp) => sum + comp.progress, 0);
    const averageProgress = totalProgress / components.length;
    setOverallProgress(averageProgress);

    const allComplete = components.every(comp => comp.progress >= 99);
    if (allComplete && overallProgress >= 99) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [components, overallProgress, onComplete]);

  const getStatusColor = (comp: LoadComponent) => {
    if (comp.status === 'complete') return 'text-green-400';
    if (comp.status === 'loading') {
      if (comp.progress < 33) return 'text-red-400';
      if (comp.progress < 66) return 'text-orange-400';
      return 'text-yellow-400';
    }
    return 'text-gray-500';
  };

  const getBarColor = (comp: LoadComponent) => {
    if (comp.status === 'complete') return 'bg-green-400';
    if (comp.progress < 33) return 'bg-red-400';
    if (comp.progress < 66) return 'bg-orange-400';
    return 'bg-yellow-400';
  };

  const timeRemaining = Math.max(0, Math.ceil((totalDuration - (overallProgress / 100) * totalDuration) / 1000));

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">
            {mode === 'portfolio' ? (
              <FaWindows className="w-16 h-16 text-blue-500 mx-auto" />
            ) : (
              <FaLinux className="w-16 h-16 text-orange-500 mx-auto" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Booting {mode === 'portfolio' ? 'Windows 11' : 'Ubuntu'}...
          </h1>
          <p className="text-gray-400">Loading system components</p>
        </div>

        {/* Progress Bar Globale */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
            <div
              className={`h-full transition-all duration-300 ${
                overallProgress >= 99 ? 'bg-green-400' :
                overallProgress >= 66 ? 'bg-yellow-400' :
                overallProgress >= 33 ? 'bg-orange-400' :
                'bg-red-400'
              }`}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="text-right text-xs text-gray-500 mt-1">
            {timeRemaining > 0 ? `~${timeRemaining}s remaining` : 'Complete!'}
          </div>
        </div>

        {/* Composants individuels */}
        <div className="space-y-3">
          {components.map((comp, index) => (
            <div key={index} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className={`font-medium ${getStatusColor(comp)} flex items-center gap-2`}>
                  {comp.status === 'complete' ? (
                    <FaCheck className="w-4 h-4" />
                  ) : comp.status === 'loading' ? (
                    <FaCog className="w-4 h-4 animate-spin" />
                  ) : (
                    <FaCircle className="w-3 h-3" />
                  )}
                  {comp.name}
                </span>
                <span className={`text-sm ${getStatusColor(comp)}`}>
                  {Math.round(comp.progress)}%
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-100 ${getBarColor(comp)}`}
                  style={{ width: `${comp.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <FaCircle className="w-3 h-3 text-red-400" /> Pending
            </span>
            <span className="flex items-center gap-1">
              <FaCog className="w-3 h-3 text-orange-400 animate-spin" /> Loading
            </span>
            <span className="flex items-center gap-1">
              <FaCheck className="w-3 h-3 text-green-400" /> Complete
            </span>
          </div>
          <p className="text-gray-600 text-xs mt-4">
            Estimated time: 8-15 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
