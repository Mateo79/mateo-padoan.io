import { useSettings } from '@/contexts/SettingsContext';
import { FaMoon, FaSun, FaGlobe, FaEye, FaEyeSlash } from 'react-icons/fa';

const SettingsSwitch = () => {
    const { settings, toggleTheme, setLang, toggleAccessibility } = useSettings();

    return (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm rounded-lg px-3 py-2">
            {/* Thème */}
            <button
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700/50 transition-colors text-white"
                title={`Thème : ${settings.theme === 'dark' ? 'Sombre' : 'Clair'}`}
            >
                {settings.theme === 'dark' ? (
                    <FaMoon className="w-5 h-5" />
                ) : (
                    <FaSun className="w-5 h-5" />
                )}
            </button>

            {/* Langue */}
            <button
                onClick={() => setLang(settings.lang === 'fr' ? 'en' : 'fr')}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700/50 transition-colors text-white"
                title={`Langue : ${settings.lang === 'fr' ? 'Français' : 'Anglais'}`}
            >
                <FaGlobe className="w-5 h-5" />
            </button>

            {/* Accessibilité */}
            <button
                onClick={toggleAccessibility}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700/50 transition-colors text-white"
                title={`Accessibilité : ${settings.accessibility === 'normal' ? 'Normale' : 'Contraste élevé'}`}
            >
                {settings.accessibility === 'normal' ? (
                    <FaEye className="w-5 h-5" />
                ) : (
                    <FaEyeSlash className="w-5 h-5" />
                )}
            </button>
        </div>
    );
};

export default SettingsSwitch;
