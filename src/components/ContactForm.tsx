import { useForm, ValidationError } from '@formspree/react';
import { useState } from 'react';
import { useTranslation } from '../contexts/useTranslation';
import { FaEnvelope, FaPaperPlane, FaCheckCircle, FaExclamationTriangle } from '../components/icons/ReactIcons';

export default function ContactForm() {
  const [state, handleSubmit] = useForm('xnjllvpb');
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Succès
  if (state.succeeded) {
    return (
      <div className="bg-gray-900 border border-green-500/30 p-6 rounded-lg col-span-1 md:col-span-2 lg:col-span-3 text-center">
        <FaCheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
        <h2 className="text-green-400 font-semibold mb-2 text-lg">{t('contactForm.success')}</h2>
        <p className="text-gray-400 text-sm">{t('contactForm.successMessage')}</p>
        <button
          onClick={() => {
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => window.location.reload(), 3000);
          }}
          className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <FaPaperPlane className="w-4 h-4" />
          {t('contactForm.sendAnother')}
        </button>
      </div>
    );
  }

  // Formulaire actif
  return (
    <div className="bg-gray-900 border border-cyan-500/30 p-6 rounded-lg col-span-1 md:col-span-2 lg:col-span-3">
      <h2 className="text-cyan-400 font-semibold mb-4 flex items-center text-lg">
        <FaEnvelope className="w-5 h-5 mr-2" />
        {t('contactForm.title')}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">{t('contactForm.name')}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
              placeholder={t('contactForm.namePlaceholder')}
            />
            <ValidationError prefix="Name" field="name" errors={state.errors} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">{t('contact.email')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
              placeholder={t('contactForm.emailPlaceholder')}
            />
            <ValidationError prefix="Email" field="email" errors={state.errors} />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">{t('contactForm.subject')}</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
            placeholder={t('contactForm.subjectPlaceholder')}
          />
          <ValidationError prefix="Subject" field="subject" errors={state.errors} />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">{t('contactForm.message')}</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
            placeholder={t('contactForm.messagePlaceholder')}
          />
          <ValidationError prefix="Message" field="message" errors={state.errors} />
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <button
            type="submit"
            disabled={state.submitting}
            className={`px-6 py-2 rounded font-semibold text-sm transition-all flex items-center gap-2 ${
              state.submitting
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white'
            }`}
          >
            {state.submitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('contactForm.sending')}
              </>
            ) : (
              <>
                <FaPaperPlane className="w-4 h-4" />
                {t('contactForm.submit')}
              </>
            )}
          </button>

          {state.errors && (
            <span className="text-red-400 text-sm flex items-center gap-2">
              <FaExclamationTriangle className="w-4 h-4" />
              {t('contactForm.error')}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}