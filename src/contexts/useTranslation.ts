import { useContext } from 'react';
import { SettingsContext } from './SettingsContext';
import { translations, TranslationKey } from './translations';

export const useTranslation = () => {
    const context = useContext(SettingsContext);
    
    if (!context) {
        throw new Error('useTranslation must be used within SettingsProvider');
    }
    
    const { settings } = context;
    const lang = settings.lang;

    const t = (key: TranslationKey): string => {
        return translations[lang][key] || translations.fr[key] || key;
    };

    return { t, lang };
};
