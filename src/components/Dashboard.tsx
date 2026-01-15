import { useState, useEffect } from 'react';
import NetworkWidget from './NetworkWidget';
import BatteryWidget from './BatteryWidget';

// Temps réel
const useRealTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return time;
};

// Widget Horloge + Système 
const WeatherClock = () => {
  const now = useRealTime();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;

  const getIcon = () => {
    const h = now.getHours();
    if (h >= 6 && h < 12) return '🌅';
    if (h >= 12 && h < 18) return '☀️';
    if (h >= 18 && h < 22) return '🌇';
    return '🌙';
  };

  return (
    <div className="bg-gray-900 border border-cyan-500/30 p-4 rounded-lg">
      <h2 className="text-cyan-400 font-semibold mb-3 flex items-center">
        <span className="mr-2">{getIcon()}</span>
        Système & Temps
      </h2>
      <div className="text-center">
        <div className="text-4xl font-mono font-bold text-white mb-1">{timeString}</div>
        <div className="text-sm text-gray-400">
          {now.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
    </div>
  );
};

// Widget État du Système 
const SystemStatus = () => {
  const [cpu, setCpu] = useState(15);
  const [ramUsed, setRamUsed] = useState(0.4);
  const [storage, setStorage] = useState(51);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(prev => (prev + (Math.random() * 10 - 5)) % 100);
      setRamUsed(prev => Math.min(0.8, Math.max(0.2, prev + (Math.random() * 0.05 - 0.025))));
      setStorage(prev => Math.min(90, prev + Math.random() * 0.1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 border border-purple-500/20 p-4 rounded-lg">
      <h2 className="text-purple-400 font-semibold mb-3">État du Système</h2>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm">
            <span>CPU</span>
            <span className="text-green-400">{cpu.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${cpu}%` }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm">
            <span>RAM</span>
            <span className="text-green-400">{(ramUsed * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
            <div className="bg-red-500 h-2 rounded-full" style={{ width: `${ramUsed * 100}%` }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm">
            <span>Stockage</span>
            <span className="text-green-400">{storage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
            <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${storage}%` }}></div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-xs space-y-1 text-gray-400">
        <div>Plateforme: Win32</div>
        <div>Cœurs: 8</div>
        <div>Mémoire: {(ramUsed * 0.5).toFixed(1)} GB / 0.5 GB</div>
        <div>Résolution: 2560x1440</div>
        <div>Langue: fr-FR</div>
        <div>GPU: ANGLE (AMD Radeon)</div>
      </div>
    </div>
  );
};

// Widget To-Do
const TodoWidget = () => {
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, input.trim()]);
      setInput('');
    }
  };

  return (
    <div className="bg-gray-900 border border-yellow-500/20 p-4 rounded-lg">
      <h2 className="text-yellow-400 font-semibold mb-3">To-Do</h2>
      <div className="flex items-center mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Nouvelle tâche..."
          className="flex-1 bg-gray-800 text-white px-3 py-1 rounded-l focus:outline-none text-sm"
        />
        <button
          onClick={addTodo}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded-r text-sm font-bold"
        >
          +
        </button>
      </div>
      <ul className="text-sm space-y-1 max-h-24 overflow-y-auto">
        {todos.length === 0 ? (
          <li className="text-gray-500 italic">Aucune tâche</li>
        ) : (
          todos.map((todo, i) => (
            <li key={i} className="flex items-start">
              <span className="text-yellow-400 mr-2">•</span>
              <span>{todo}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <WeatherClock />
      <SystemStatus />
      <NetworkWidget />
      <BatteryWidget />
      <TodoWidget />
      <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg text-gray-500 italic">
        Widget personnalisé
      </div>
    </div>
  );
}