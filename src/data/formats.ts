import { Format } from '../types/PromptOptions';
import { Star, BookOpen, AppWindow, Layout, MousePointer, Sparkles, MessageSquare, Twitter, Mail, Smartphone, HelpCircle } from 'lucide-react';

interface FormatOption {
  value: {
    id: Format;
    name: string;
    description: string;
    platforms: string[];
    roles: string[];
    maxLength?: number;
  };
  label: string;
  description: string;
  icon: any;
  color: string;
  platform: string;
  role: string;
  roleDescription: string;
}

export const formats: FormatOption[] = [
  {
    value: {
      id: 'tagline',
      name: 'Tagline de startup',
      description: 'Slogan court et impactant qui résume la mission ou la valeur unique de la startup',
      platforms: ['Site vitrine', 'pitch deck'],
      roles: ['Brand strategist', 'Startup copywriter'],
      maxLength: 8
    },
    label: 'generator.form.formats.tagline',
    description: 'generator.form.formatsDesc.tagline',
    icon: Star,
    color: 'from-blue-400 to-indigo-500',
    platform: 'Site vitrine / pitch deck',
    role: 'Brand strategist / Startup copywriter',
    roleDescription: 'Crée un slogan court et impactant qui résume la mission ou la valeur unique de la startup.'
  },
  {
    value: {
      id: 'formation',
      name: 'Formation',
      description: 'Titre qui attire la curiosité et met en avant la transformation promise',
      platforms: ['Page de vente'],
      roles: ['Formateur expert', 'Marketer pédagogique'],
      maxLength: 10
    },
    label: 'generator.form.formats.formation',
    description: 'generator.form.formatsDesc.formation',
    icon: BookOpen,
    color: 'from-green-400 to-emerald-500',
    platform: 'Page de vente',
    role: 'Formateur expert / Marketer pédagogique',
    roleDescription: 'Crée un titre qui attire la curiosité et met en avant la transformation promise.'
  },
  {
    value: {
      id: 'app_store',
      name: 'Description de l\'application',
      description: 'Description optimisée pour l\'App Store, claire, concise, et orientée bénéfices',
      platforms: ['App Store', 'Google Play'],
      roles: ['Spécialiste App Marketing'],
      maxLength: 30
    },
    label: 'generator.form.formats.app_store',
    description: 'generator.form.formatsDesc.app_store',
    icon: AppWindow,
    color: 'from-purple-400 to-violet-500',
    platform: 'App Store / Google Play',
    role: 'Spécialiste App Marketing',
    roleDescription: 'Rédige une description optimisée pour l\'App Store, claire, concise, et orientée bénéfices.'
  },
  {
    value: {
      id: 'hero_banner',
      name: 'Titre principal',
      description: 'Titre principal visible en haut d\'un site. Doit capter l\'attention en une phrase',
      platforms: ['Site Web', 'Landing page'],
      roles: ['Spécialiste UI Copy', 'Conversion Writer'],
      maxLength: 8
    },
    label: 'generator.form.formats.hero_banner',
    description: 'generator.form.formatsDesc.hero_banner',
    icon: Layout,
    color: 'from-pink-400 to-rose-500',
    platform: 'Site Web / Landing page',
    role: 'Spécialiste UI Copy / Conversion Writer',
    roleDescription: 'Écrit le titre principal visible en haut d\'un site. Doit capter l\'attention en une phrase.'
  },
  {
    value: {
      id: 'cta',
      name: 'CTA',
      description: 'CTA courts, incitatifs et testables',
      platforms: ['Landing Page', 'Pub'],
      roles: ['Expert CRO'],
      maxLength: 4
    },
    label: 'generator.form.formats.cta',
    description: 'generator.form.formatsDesc.cta',
    icon: MousePointer,
    color: 'from-orange-400 to-red-500',
    platform: 'Landing Page / Pub',
    role: 'Expert CRO (Conversion Rate Optimization)',
    roleDescription: 'Génère des CTA courts, incitatifs et testables.'
  },
  {
    value: {
      id: 'slogan',
      name: 'Accroche publicitaire',
      description: 'Accroches publicitaires qui convertissent en quelques mots',
      platforms: ['Google Ads', 'Meta Ads'],
      roles: ['Copywriter publicitaire'],
      maxLength: 6
    },
    label: 'generator.form.formats.slogan',
    description: 'generator.form.formatsDesc.slogan',
    icon: Sparkles,
    color: 'from-yellow-400 to-amber-500',
    platform: 'Google Ads / Meta Ads',
    role: 'Copywriter publicitaire',
    roleDescription: 'Crée des accroches publicitaires qui convertissent en quelques mots.'
  },
  {
    value: {
      id: 'ad_copy',
      name: 'Pub persuasive',
      description: 'Pub persuasive avec USP, bénéfice et incitation',
      platforms: ['Meta Ads', 'Google'],
      roles: ['Performance marketer', 'Ad copy expert'],
      maxLength: 100
    },
    label: 'generator.form.formats.ad_copy',
    description: 'generator.form.formatsDesc.ad_copy',
    icon: MessageSquare,
    color: 'from-teal-400 to-cyan-500',
    platform: 'Meta Ads / Google',
    role: 'Performance marketer / Ad copy expert',
    roleDescription: 'Rédige une pub persuasive avec USP, bénéfice et incitation.'
  },
  {
    value: {
      id: 'tweet',
      name: 'Tweet',
      description: 'Tweet comme si le fondateur parlait : confiant, authentique, inspirant',
      platforms: ['Twitter', 'X'],
      roles: ['Founder voice', 'Community Builder'],
      maxLength: 280
    },
    label: 'generator.form.formats.tweet',
    description: 'generator.form.formatsDesc.tweet',
    icon: Twitter,
    color: 'from-sky-400 to-blue-500',
    platform: 'Twitter / X',
    role: 'Founder voice / Community Builder',
    roleDescription: 'Crée un tweet comme si le fondateur parlait : confiant, authentique, inspirant.'
  },
  {
    value: {
      id: 'email',
      name: 'Phrase d\'intro personnalisée',
      description: 'Phrase d\'intro personnalisée qui brise la glace',
      platforms: ['Email pro'],
      roles: ['SDR', 'Expert Sales Copy'],
      maxLength: 250
    },
    label: 'generator.form.formats.email',
    description: 'generator.form.formatsDesc.email',
    icon: Mail,
    color: 'from-red-400 to-pink-500',
    platform: 'Email pro',
    role: 'SDR / Expert Sales Copy',
    roleDescription: 'Rédige une phrase d\'intro personnalisée qui brise la glace.'
  },
  {
    value: {
      id: 'onboarding',
      name: 'Message de bienvenue',
      description: 'Messages courts, guidants et engageants pour les nouveaux utilisateurs',
      platforms: ['Application mobile', 'SaaS'],
      roles: ['UX Writer'],
      maxLength: 100
    },
    label: 'generator.form.formats.onboarding',
    description: 'generator.form.formatsDesc.onboarding',
    icon: Smartphone,
    color: 'from-indigo-400 to-purple-500',
    platform: 'Application mobile / SaaS',
    role: 'UX Writer',
    roleDescription: 'Crée des messages courts, guidants et engageants pour les nouveaux utilisateurs.'
  },
  {
    value: {
      id: 'faq',
      name: 'Réponse à des objections fréquentes',
      description: 'Réponses claires à des objections fréquentes',
      platforms: ['Page produit', 'SaaS'],
      roles: ['Customer Success', 'Rédacteur UX'],
      maxLength: 500
    },
    label: 'generator.form.formats.faq',
    description: 'generator.form.formatsDesc.faq',
    icon: HelpCircle,
    color: 'from-emerald-400 to-green-500',
    platform: 'Page produit / SaaS',
    role: 'Customer Success / Rédacteur UX',
    roleDescription: 'Rédige des réponses claires à des objections fréquentes.'
  }
]; 

