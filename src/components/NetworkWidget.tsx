import { useState, useEffect } from 'react';
import { FaWifi, FaGlobe, FaLaptop, FaMapMarkerAlt, FaInfo } from 'react-icons/fa';

const NetworkWidget = () => {
  const [publicIP, setPublicIP] = useState<string>('Chargement...');
  const [, setLocation] = useState<string>('Chargement...');
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
      {/* Titre avec icône Wifi */}
      <h2 className="text-red-400 font-semibold mb-3 flex items-center">
        <FaWifi className="mr-2" />
        Réseau
      </h2>
      
      <div className="text-sm space-y-2 text-gray-300">
        {/* Type de connexion */}
        <div className="flex items-center">
          <FaWifi className="mr-2 text-cyan-400 w-4 h-4" />
          <span>Type:</span> 
          <span className="ml-2 text-cyan-400">{connectionType}</span>
        </div>

        {/* IP Publique */}
        <div className="flex items-center">
          <FaGlobe className="mr-2 text-green-400 w-4 h-4" />
          <span>IP Publique:</span> 
          <span className="ml-2 text-green-400">{publicIP}</span>
        </div>

        {/* IP Locale */}
        <div className="flex items-center">
          <FaLaptop className="mr-2 text-yellow-400 w-4 h-4" />
          <span>IP Locale:</span> 
          <span className="ml-2 text-yellow-400">{localIP}</span>
        </div>

        {/* Localisation */}
        <div className="flex items-center">
          <FaMapMarkerAlt className="mr-2 text-purple-400 w-4 h-4" />
          <span>Localisation:</span> 
          <span className="ml-2 text-purple-400">Lille</span>
        </div>
      </div>

      {!isDev && (
        <div className="mt-3 text-xs text-gray-500 border-t border-gray-800 pt-2 flex items-center gap-2">
          <FaInfo className="text-gray-500 w-4 h-4" />
          <span>IP locale et SSID non accessibles pour des raisons de sécurité navigateur.</span>
        </div>
      )}
    </div>
  );
};

export default NetworkWidget;
