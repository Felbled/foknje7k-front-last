import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import { fr } from './locales/fr';
import { ar } from './locales/ar';

const resources = {
    fr: { translation: fr },
    ar: { translation: ar },
};

const language = localStorage.getItem('language') || 'ar';

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: language,
        fallbackLng: 'ar',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
