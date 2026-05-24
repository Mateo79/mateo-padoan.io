import { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/useTranslation';
import type { TranslationKey } from '@/contexts/translations';
import faceImage from '@/assets/face.png';
import {
  FaEnvelope,
  FaGraduationCap,
  FaLaptopCode,
  FaCog,
  FaSchool,
  FaTools,
  FaRuler,
  FaLightbulb,
  FaCheck,
  FaStar,
  FaBuilding,
  FaWrench,
  FaMapMarkerAlt,
  FaLinkedin,
  FaStore,
  FaHeadphones,
  FaGithub,
  SiGithub,
  FiClock,
  FiCheck as FiCheckIcon
} from '../components/icons/ReactIcons';

interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
}

const fetchGithubRepos = async (): Promise<GithubRepo[]> => {
  try {
    const response = await fetch(
      'https://api.github.com/users/Mateo79/repos?sort=updated&per_page=10'
    );
    if (!response.ok) throw new Error('Erreur API GitHub');

    const data = await response.json();
    // Garde uniquement tes repos (pas les forks)
    return data.filter((repo: GithubRepo) => !repo.fork);
  } catch {
    return [];
  }
};

const getLanguageColor = (lang: string | null): string => {
  const colors: Record<string, string> = {
    TypeScript: 'bg-blue-500',
    JavaScript: 'bg-yellow-400',
    Python: 'bg-blue-400',
    C: 'bg-blue-700',
    'C++': 'bg-pink-600',
    HTML: 'bg-orange-500',
    CSS: 'bg-purple-500',
    Java: 'bg-red-500',
    Go: 'bg-cyan-600',
    Rust: 'bg-orange-600',
  };
  return colors[lang || ''] || 'bg-gray-500';
};

interface AboutProps {
  onPageChange?: (page: 'about' | 'dashboard') => void;
}

const About: React.FC<AboutProps> = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'about' | 'projects' | 'experience'>('about');

  // State pour les repos GitHub
  const [githubRepos, setGithubRepos] = useState<GithubRepo[]>([]);
  const [reposLoading, setReposLoading] = useState(true);

  // Fetch des repos au montage du composant
  useEffect(() => {
    const loadRepos = async () => {
      const repos = await fetchGithubRepos();
      setGithubRepos(repos);
      setReposLoading(false);
    };
    loadRepos();
  }, []);

  const skillKeys: TranslationKey[] = [
    'skills.development',
    'skills.event',
    'skills.electronics',
    'skills.iot',
    'skills.soundlight',
    'skills.roadie'
  ];

  const interestKeys: TranslationKey[] = [
    'interests.electronics',
    'interests.lightcontrol',
    'interests.musicproduction',
    'interests.embedded',
    'interests.audio',
    'interests.protocols'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header avec photo et présentation */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          {/* Photo de profil */}
          <div className="relative group">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-purple-500 shadow-2xl">
              <img
                src={faceImage}
                alt="Mateo Padoan"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
          </div>

          {/* Présentation */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-bold text-white mb-2">
              {t('about.title')}
            </h1>
            <p className="text-xl text-cyan-400 mb-4">
              {t('about.subtitle')}
            </p>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
              {t('about.description')}
            </p>

            {/* Tags de compétences */}
            <div className="flex flex-wrap gap-2 mt-6 justify-center md:justify-start">
              {skillKeys.map((skillKey) => (
                <span
                  key={skillKey}
                  className="px-4 py-2 bg-purple-600/30 border border-purple-500 rounded-full text-purple-300 text-sm hover:bg-purple-600/50 transition-colors cursor-default"
                >
                  {t(skillKey)}
                </span>
              ))}
            </div>

            {/* Contact rapide */}
            <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start text-sm">
              <a href="mailto:mateo.padoan@gmail.com" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2">
                <FaEnvelope className="w-4 h-4" /> mateo.padoan@gmail.com
              </a>
              <a href="https://github.com/Mateo79" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 flex items-center gap-2">
                <SiGithub className="w-4 h-4" /> github.com/Mateo79
              </a>
              <a href="https://linkedin.com/in/mateo-padoan-b21bb71bb" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                <FaLinkedin className="w-4 h-4" /> LinkedIn
              </a>
              <span className="text-gray-400 flex items-center gap-2">
                <FaMapMarkerAlt className="w-4 h-4" /> Lille
              </span>
            </div>

            {/* Disponibilité */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-600/30 border border-green-500 rounded-full text-green-300 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              {t('common.availability')} : Jeudi soir - Dimanche (soirées, concerts, festivals)
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-6 py-3 font-medium transition-all ${activeTab === 'about'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
              }`}
          >
            {t('section.about')}
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 font-medium transition-all ${activeTab === 'projects'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
              }`}
          >
            {t('section.projects')}
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`px-6 py-3 font-medium transition-all ${activeTab === 'experience'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
              }`}
          >
            {t('section.experience')}
          </button>
        </div>

        {/* Contenu dynamique */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          {activeTab === 'about' && (
            <div className="space-y-6 text-gray-300">
              {/* Description */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">{t('section.description')}</h2>
                <p className="text-lg leading-relaxed">
                  {t('about.longDescription')}
                </p>
              </div>

              {/* Formations */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">{t('section.education')}</h2>
                <div className="space-y-4">
                  <div className="bg-purple-900/30 p-6 rounded-lg border border-purple-500">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white">Epitech Lille - Computer Engineering Degree</h3>
                      <span className="text-cyan-400 text-sm font-mono">2025 - 2028</span>
                    </div>
                    <p className="text-purple-400 text-sm mb-3">{t('education.statusInProgress')}</p>
                    <ul className="space-y-1 text-gray-300">
                      <li className="flex items-start gap-2">
                        <FaGraduationCap className="text-purple-400 mt-0.5 w-4 h-4" />
                        <span>{t('education.epitech.point1')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaLaptopCode className="text-purple-400 mt-0.5 w-4 h-4" />
                        <span>{t('education.epitech.point2')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaCog className="text-purple-400 mt-0.5 w-4 h-4" />
                        <span>{t('education.epitech.point3')}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-cyan-900/30 p-6 rounded-lg border border-cyan-500">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white">BTS CIEL - Cyber Informatique Electronics and Software</h3>
                      <span className="text-cyan-400 text-sm font-mono">2023 - 2025</span>
                    </div>
                    <ul className="space-y-1 text-gray-300">
                      <li className="flex items-start gap-2">
                        <FaSchool className="text-cyan-400 mt-0.5 w-4 h-4" />
                        <span>{t('education.bts.point1')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaTools className="text-cyan-400 mt-0.5 w-4 h-4" />
                        <span>{t('education.bts.point2')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaRuler className="text-cyan-400 mt-0.5 w-4 h-4" />
                        <span>{t('education.bts.point3')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Compétences */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">{t('section.skills')}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
                      <FaLightbulb className="w-5 h-5" />
                      {t('skills.section.strengths')}
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <FaCheck className="text-purple-400 mt-0.5 w-4 h-4" />
                        <span>{t('skills.strengths.point1')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaCheck className="text-purple-400 mt-0.5 w-4 h-4" />
                        <span>{t('skills.strengths.point2')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaCheck className="text-purple-400 mt-0.5 w-4 h-4" />
                        <span>{t('skills.strengths.point3')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaCheck className="text-purple-400 mt-0.5 w-4 h-4" />
                        <span>{t('skills.strengths.point4')}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                    <h3 className="text-xl font-bold text-cyan-400 mb-3 flex items-center gap-2">
                      <FaTools className="w-5 h-5" />
                      {t('skills.section.technical')}
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <FaCheck className="text-cyan-400 mt-0.5 w-4 h-4" />
                        <span>{t('skills.technical.point1')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaCheck className="text-cyan-400 mt-0.5 w-4 h-4" />
                        <span>{t('skills.technical.point2')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Centres d'intérêt */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-2">
                  <FaStar className="w-6 h-6 text-yellow-400" />
                  {t('section.interests')}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {interestKeys.map((interestKey) => (
                    <span
                      key={interestKey}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border border-purple-500 rounded-lg text-gray-300 hover:border-cyan-400 transition-colors flex items-center gap-2"
                    >
                      <FaStar className="w-3 h-3 text-yellow-400" />
                      {t(interestKey)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Détails physiques */}
              <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <FaRuler className="w-5 h-5" />
                  {t('physical.title')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-300">
                  <div>
                    <span className="text-cyan-400 font-semibold">{t('physical.height.label')}:</span> 1m98
                  </div>
                  <div>
                    <span className="text-cyan-400 font-semibold">{t('physical.weight.label')}:</span> 130 kg
                  </div>
                  <div>
                    <span className="text-cyan-400 font-semibold">{t('physical.build.label')}:</span> {t('physical.build.value')}
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-3">
                  {t('physical.note')}
                </p>
              </div>
            </div>
          )}

          {/* Projet Dynamique via Github */}
          {activeTab === 'projects' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                  <FaLaptopCode className="w-7 h-7 text-cyan-400" />
                  Projets GitHub
                </h2>
                <a
                  href="https://github.com/Mateo79?tab=repositories"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cyan-400 hover:underline flex items-center gap-1"
                >
                  Voir tout sur GitHub →
                </a>
              </div>

              {reposLoading ? (
                <div className="text-center py-20 text-gray-500 animate-pulse">
                  Chargement des projets...
                </div>
              ) : githubRepos.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  Aucun projet public trouvé.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {githubRepos.map((repo) => (
                    <div
                      key={repo.id}
                      className="bg-gray-700/50 p-6 rounded-lg border border-gray-600 
                                 hover:border-purple-500 transition-colors group flex flex-col h-full"
                    >
                      {/* Nom + Lien dans le headre */}
                      <div className="flex items-center gap-2 mb-3">
                        <FaGithub className="w-5 h-5 text-purple-400" />
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-bold text-white group-hover:text-purple-400 
                                     transition-colors truncate"
                          title={repo.name}
                        >
                          {repo.name}
                        </a>
                      </div>

                      {/* Description */}
                      <p className="text-gray-400 text-sm mb-4 flex-grow line-clamp-3">
                        {repo.description || 'Pas de description disponible.'}
                      </p>

                      {/* Langage + Stats dans fouter */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-auto flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          {repo.language && (
                            <div className="flex items-center gap-1">
                              <span className={`w-2.5 h-2.5 rounded-full ${getLanguageColor(repo.language)}`} />
                              <span>{repo.language}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <FaStar className="w-3 h-3" />
                            <span>{repo.stargazers_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            <span>{repo.forks_count}</span>
                          </div>
                        </div>
                        <span className="text-gray-600">
                          {new Date(repo.updated_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
                <FaBuilding className="w-7 h-7" />
                {t('section.experience')}
              </h2>

              {/* White2Net */}
              <div className="border-l-4 border-purple-500 pl-6 py-2 bg-gray-800/30 p-6 rounded-r-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaLaptopCode className="w-5 h-5" />
                    {t('experience.white2net.title')}
                  </h3>
                  <span className="text-cyan-400 text-sm font-mono flex items-center gap-1">
                    <FiClock className="w-4 h-4" /> 08/07/2024
                  </span>
                </div>
                <p className="text-purple-400 font-semibold mb-3 flex items-center gap-2">
                  <FaBuilding className="w-4 h-4" /> White2Net
                </p>
                <ul className="text-gray-400 space-y-1">
                  <li className="flex items-start gap-2">
                    <FiCheckIcon className="text-purple-400 mt-0.5 w-4 h-4" />
                    <span>{t('experience.white2net.point1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckIcon className="text-purple-400 mt-0.5 w-4 h-4" />
                    <span>{t('experience.white2net.point2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckIcon className="text-purple-400 mt-0.5 w-4 h-4" />
                    <span>{t('experience.white2net.point3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckIcon className="text-purple-400 mt-0.5 w-4 h-4" />
                    <span>{t('experience.white2net.point4')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckIcon className="text-purple-400 mt-0.5 w-4 h-4" />
                    <span>{t('experience.white2net.point5')}</span>
                  </li>
                </ul>
              </div>

              {/* Fromagerie Saint-Marc */}
              <div className="border-l-4 border-cyan-500 pl-6 py-2 bg-gray-800/30 p-6 rounded-r-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaStore className="w-5 h-5" />
                    {t('experience.fromagerie.title')}
                  </h3>
                  <span className="text-cyan-400 text-sm font-mono flex items-center gap-1">
                    <FiClock className="w-4 h-4" /> 05/05/2023
                  </span>
                </div>
                <p className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                  <FaBuilding className="w-4 h-4" /> Fromagerie Saint-Marc
                </p>
                <ul className="text-gray-400 space-y-1">
                  <li className="flex items-start gap-2">
                    <FiCheckIcon className="text-cyan-400 mt-0.5 w-4 h-4" />
                    <span>{t('experience.fromagerie.point1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckIcon className="text-cyan-400 mt-0.5 w-4 h-4" />
                    <span>{t('experience.fromagerie.point2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckIcon className="text-cyan-400 mt-0.5 w-4 h-4" />
                    <span>{t('experience.fromagerie.point3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckIcon className="text-cyan-400 mt-0.5 w-4 h-4" />
                    <span>{t('experience.fromagerie.point4')}</span>
                  </li>
                </ul>
              </div>

              {/* Roche */}
              <div className="border-l-4 border-green-500 pl-6 py-2 bg-gray-800/30 p-6 rounded-r-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaGraduationCap className="w-5 h-5" />
                    {t('experience.roche.title')}
                  </h3>
                  <span className="text-cyan-400 text-sm font-mono flex items-center gap-1">
                    <FiClock className="w-4 h-4" /> 07/07/2016
                  </span>
                </div>
                <p className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                  <FaBuilding className="w-4 h-4" /> Roche
                </p>
                <ul className="text-gray-400 space-y-1">
                  <li className="flex items-start gap-2">
                    <FiCheckIcon className="text-green-400 mt-0.5 w-4 h-4" />
                    <span>{t('experience.roche.point1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckIcon className="text-green-400 mt-0.5 w-4 h-4" />
                    <span>{t('experience.roche.point2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckIcon className="text-green-400 mt-0.5 w-4 h-4" />
                    <span>{t('experience.roche.point3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckIcon className="text-green-400 mt-0.5 w-4 h-4" />
                    <span>{t('experience.roche.point4')}</span>
                  </li>
                </ul>
              </div>

              {/* Événementiel */}
              <div className="border-l-4 border-yellow-500 pl-6 py-2 bg-gray-800/30 p-6 rounded-r-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaHeadphones className="w-5 h-5" />
                    {t('experience.event.title')}
                  </h3>
                  <span className="text-cyan-400 text-sm font-mono flex items-center gap-1">
                    <FiClock className="w-4 h-4" /> {t('common.availability')}
                  </span>
                </div>
                <p className="text-yellow-400 font-semibold mb-3 flex items-center gap-2">
                  <FaWrench className="w-4 h-4" /> Roadie / Technicien Plateau
                </p>
                <ul className="text-gray-400 space-y-1">
                  <li className="flex items-start gap-2">
                    <FiCheckIcon className="text-yellow-400 mt-0.5 w-4 h-4" />
                    <span>{t('experience.event.point1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckIcon className="text-yellow-400 mt-0.5 w-4 h-4" />
                    <span>{t('experience.event.point2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckIcon className="text-yellow-400 mt-0.5 w-4 h-4" />
                    <span>{t('experience.event.point3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckIcon className="text-yellow-400 mt-0.5 w-4 h-4" />
                    <span>{t('experience.event.point4')}</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
