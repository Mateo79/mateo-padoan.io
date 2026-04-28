import { createContext, useState, useContext, ReactNode } from 'react';

export interface Settings {
    theme: 'light' | 'dark' | 'system';
    lang: 'fr' | 'en';
    accessibility: 'normal' | 'high-contrast';
}

const defaultSettings: Settings = {
    theme: 'dark',
    lang: 'fr',
    accessibility: 'normal',
};

export const SettingsContext = createContext<{
    settings: Settings;
    toggleTheme: () => void;
    setLang: (lang: 'fr' | 'en') => void;
    toggleAccessibility: () => void;
} | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<Settings>(() => {
        const savedSettings = localStorage.getItem('userSettings');
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    });

    const saveSettings = (newSettings: Settings) => {
        setSettings(newSettings);
        localStorage.setItem('userSettings', JSON.stringify(newSettings));
    };

    const toggleTheme = () => {
        const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
        saveSettings({ ...settings, theme: newTheme });
    };

    const setLang = (lang: 'fr' | 'en') => {
        saveSettings({ ...settings, lang });
    };

    const toggleAccessibility = () => {
        const newMode = settings.accessibility === 'normal' ? 'high-contrast' : 'normal';
        saveSettings({ ...settings, accessibility: newMode });
    };

    return (
        <SettingsContext.Provider value={{ settings, toggleTheme, setLang, toggleAccessibility }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
};
