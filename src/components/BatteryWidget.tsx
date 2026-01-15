import { useState, useEffect } from 'react';

const formatTime = (seconds: number): string => {
  if (seconds === Infinity || seconds <= 0) return 'Inconnu';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
};

const BatteryWidget = () => {
  const [battery, setBattery] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBattery = async () => {
      try {
        // @ts-ignore
        if (!navigator.getBattery) {
          setError("Non supporté");
          return;
        }

        // @ts-ignore
        const batt = await navigator.getBattery();
        setBattery({
          level: batt.level,
          charging: batt.charging,
          chargingTime: batt.chargingTime,
          dischargingTime: batt.dischargingTime,
        });

        // Écouter les changements
        const update = () => setBattery({
          level: batt.level,
          charging: batt.charging,
          chargingTime: batt.chargingTime,
          dischargingTime: batt.dischargingTime,
        });

        batt.addEventListener('levelchange', update);
        batt.addEventListener('chargingchange', update);
        batt.addEventListener('chargingtimechange', update);
        batt.addEventListener('dischargingtimechange', update);

        return () => {
          batt.removeEventListener('levelchange', update);
          batt.removeEventListener('chargingchange', update);
          batt.removeEventListener('chargingtimechange', update);
          batt.removeEventListener('dischargingtimechange', update);
        };
      } catch (err) {
        setError("Accès refusé");
      }
    };

    loadBattery();
  }, []);

  // Détecter les valeurs par défaut
  const isFakeData = battery?.level === 1 && 
                    battery?.charging === true && 
                    battery?.chargingTime === 0;

  if (error) {
    return (
      <div className="bg-gray-900 border border-green-500/20 p-4 rounded-lg">
        <h2 className="text-green-400 font-semibold mb-3">Batterie</h2>
        <div className="text-sm text-gray-400">{error}</div>
        <div className="mt-2 text-xs text-gray-500">
            Disponible uniquement sur laptop
        </div>
      </div>
    );
  }

  if (!battery) {
    return (
      <div className="bg-gray-900 border border-green-500/20 p-4 rounded-lg">
        <h2 className="text-green-400 font-semibold mb-3">Batterie</h2>
        <div className="text-sm text-gray-400">Chargement...</div>
      </div>
    );
  }

  if (isFakeData) {
    return (
      <div className="bg-gray-900 border border-green-500/20 p-4 rounded-lg">
        <h2 className="text-green-400 font-semibold mb-3">Batterie</h2>
        <div className="text-sm text-gray-400">
          Données non disponibles
        </div>
        <div className="mt-2 text-xs text-gray-500">
            Fonctionne sur laptop avec batterie
        </div>
      </div>
    );
  }

  const percent = Math.round(battery.level * 100);
  const isCharging = battery.charging;
  const timeLeft = isCharging ? battery.chargingTime : battery.dischargingTime;
  const statusText = isCharging ? 'En charge' : 'Autonome';

  let icon = '🔋';
  if (isCharging) icon = '🔌';
  else if (percent <= 20) icon = '🪫';

  return (
    <div className="bg-gray-900 border border-green-500/20 p-4 rounded-lg">
      <h2 className="text-green-400 font-semibold mb-3 flex items-center">
        <span className="mr-2">{icon}</span>
        Batterie
      </h2>
      <div className="flex flex-col items-center">
        <div className="text-4xl mb-2">{icon}</div>
        <div className="text-xl font-bold">{percent}%</div>
        <div className="text-sm text-gray-400">{statusText}</div>
        {timeLeft !== Infinity && timeLeft > 0 && (
          <div className="text-xs text-cyan-400 mt-1">
            {isCharging ? 'Temps charge : ' : 'Autonomie : '}
            {formatTime(timeLeft)}
          </div>
        )}
        <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
          <div
            className={`h-2 rounded-full ${
              percent > 50 ? 'bg-green-500' : percent > 20 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BatteryWidget;