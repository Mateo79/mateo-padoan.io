import { useState, useEffect } from 'react';

const SystemStatus = () => {
    const [gpu, setGpu] = useState<string>('Chargement...');

    useEffect(() => {
        // Récupérer le GPU via WebGL
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

            if (!gl) {
                setGpu('Non supporté');
                return;
            }

            // Utilisation de 'as any' pour bypasser les erreurs de typage
            const webgl = gl as any;

            const debugInfo = webgl.getExtension?.('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const renderer = webgl.getParameter?.(debugInfo.UNMASKED_RENDERER_WEBGL);
                setGpu(renderer ? String(renderer) : 'WebGL (nom masqué)');
            } else {
                setGpu('WebGL disponible');
            }
        } catch (err) {
            setGpu('Erreur');
        }
    }, []);

    // Informations système disponibles
    const getOS = () => {
        const ua = navigator.userAgent;
        if (ua.includes('Win')) return 'Windows';
        if (ua.includes('Mac')) return 'macOS';
        if (ua.includes('Linux')) return 'Linux';
        return 'Inconnu';
    };

    const platform = getOS();
    const cores = navigator.hardwareConcurrency || 'Inconnu';

    // Vérifier si deviceMemory existe 
    let memory = 'Inconnue';
    if ('deviceMemory' in navigator) {
        // @ts-ignore 
        memory = `${(navigator as any).deviceMemory} GB`;
    }

    const resolution = `${screen.width}x${screen.height}`;
    const language = navigator.language;

    return (
        <div className="bg-gray-900 border border-purple-500/20 p-4 rounded-lg">
            <h2 className="text-purple-400 font-semibold mb-3">État du Système</h2>

            {/* Barres d'utilisation (non disponibles → affichage neutre) */}
            <div className="space-y-3 mb-4">
                <div>
                    <div className="flex justify-between text-sm">
                        <span>CPU</span>
                        <span className="text-gray-500">—</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-sm">
                        <span>RAM</span>
                        <span className="text-gray-500">—</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-sm">
                        <span>Stockage</span>
                        <span className="text-gray-500">—</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                        <div className="bg-pink-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                </div>
            </div>

            {/* Infos réelles */}
            <div className="mt-2 text-xs space-y-1 text-gray-400">
                <div>Plateforme: {platform}</div>
                <div>Cœurs: {cores}</div>
                <div>Mémoire: {memory}</div>
                <div>Résolution: {resolution}</div>
                <div>Langue: {language}</div>
                <div>GPU: {gpu}</div>
            </div>

            <div className="mt-3 text-xs text-gray-500 border-t border-gray-800 pt-2">
                Données CPU/RAM/Stockage non accessibles (sécurité navigateur)
            </div>
        </div>
    );
};

export default SystemStatus;