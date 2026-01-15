import { useState, useEffect } from 'react';

const NetworkWidget = () => {
  const [publicIP, setPublicIP] = useState<string>('Chargement...');
  const [location, setLocation] = useState<string>('Chargement...');
  const [connectionType, setConnectionType] = useState<string>('Inconnu');

  const isDev = process.env.NODE_ENV === 'development';
  const localIP = isDev ? '192.168.1.42' : 'Non accessible';

  useEffect(() => {
    let cancelled = false;

    // Récupérer type de connexion
    // @ts-ignore
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
      setConnectionType(conn.effectiveType || 'Inconnu');
    }

    // Récupérer IP publique et localisation
    const fetchNetworkData = async () => {
      try {
        // IP publique
        const ipRes = await fetch('https://api.ipify.org?format=json', { cache: 'no-store' });
        const ipData = await ipRes.json();
        const ip = ipData.ip;

        if (cancelled) return;

        // Localisation via IP
        const locRes = await fetch(`https://ipapi.co/${ip}/json/`, { cache: 'no-store' });
        const locData = await locRes.json();

        if (cancelled) return;

        const city = locData.city || 'Inconnue';
        const country = locData.country_name || 'Inconnu';
        const fullLocation = `${city}, ${country}`;

        setPublicIP(ip);
        setLocation(fullLocation);
      } catch (err) {
        if (!cancelled) {
          setPublicIP('Erreur');
          setLocation('Indisponible');
        }
      }
    };

    fetchNetworkData();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-gray-900 border border-red-500/20 p-4 rounded-lg">
      <h2 className="text-red-400 font-semibold mb-3">Réseau</h2>
      <div className="text-sm space-y-1 text-gray-300">
        <div>Type: <span className="text-cyan-400">{connectionType}</span></div>
        <div>IP Publique: <span className="text-green-400">{publicIP}</span></div>
        <div>IP Locale: <span className="text-yellow-400">{localIP}</span></div>
        <div>Localisation: <span className="text-purple-400">{location}</span></div>
      </div>

      {!isDev && (
        <div className="mt-3 text-xs text-gray-500 border-t border-gray-800 pt-2">
          ℹ️ IP locale et SSID non accessibles pour des raisons de sécurité navigateur.
        </div>
      )}
    </div>
  );
};

export default NetworkWidget;