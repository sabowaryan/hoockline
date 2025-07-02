import { Tone } from '../types/PromptOptions';
import { Laugh, Heart, Zap, Eye, Crown, Rocket } from 'lucide-react';

interface ToneOption {
  value: Tone;
  label: string;
  description: string;
  icon: any;
  color: string;
  verbs: Record<string, string[]>;
}

export const tones: ToneOption[] = [
  {
    value: 'humoristique',
    label: 'generator.form.tones.humoristique',
    description: 'generator.form.tonesDesc.humoristique',
    icon: Laugh,
    color: 'from-yellow-400 to-orange-500',
    verbs: {
      fr: ['Découvre', 'Regarde', 'Stoppe', 'Devine', 'Ris'],
      en: ['Discover', 'Look', 'Stop', 'Guess', 'Laugh'],
      es: ['Descubre', 'Mira', 'Para', 'Adivina', 'Ríe'],
      de: ['Entdecke', 'Schau', 'Stoppe', 'Rate', 'Lache'],
      it: ['Scopri', 'Guarda', 'Ferma', 'Indovina', 'Ridi'],
      pt: ['Descobre', 'Olha', 'Para', 'Adivinha', 'Ri']
    }
  },
  {
    value: 'inspirant',
    label: 'generator.form.tones.inspirant',
    description: 'generator.form.tonesDesc.inspirant',
    icon: Heart,
    color: 'from-pink-400 to-rose-500',
    verbs: {
      fr: ['Transforme', 'Libère', 'Crée', 'Révolutionne', 'Inspire'],
      en: ['Transform', 'Free', 'Create', 'Revolutionize', 'Inspire'],
      es: ['Transforma', 'Libera', 'Crea', 'Revoluciona', 'Inspira'],
      de: ['Verwandle', 'Befreie', 'Erschaffe', 'Revolutioniere', 'Inspiriere'],
      it: ['Trasforma', 'Libera', 'Crea', 'Rivoluziona', 'Ispira'],
      pt: ['Transforma', 'Liberta', 'Cria', 'Revoluciona', 'Inspira']
    }
  },
  {
    value: 'direct',
    label: 'generator.form.tones.direct',
    description: 'generator.form.tonesDesc.direct',
    icon: Zap,
    color: 'from-blue-400 to-cyan-500',
    verbs: {
      fr: ['Commence', 'Obtiens', 'Démarre', 'Lance', 'Agis'],
      en: ['Start', 'Get', 'Begin', 'Launch', 'Act'],
      es: ['Comienza', 'Obtén', 'Empieza', 'Lanza', 'Actúa'],
      de: ['Starte', 'Erhalte', 'Beginne', 'Starte', 'Handle'],
      it: ['Inizia', 'Ottieni', 'Comincia', 'Lancia', 'Agisci'],
      pt: ['Começa', 'Obtém', 'Inicia', 'Lança', 'Age']
    }
  },
  {
    value: 'mysterieux',
    label: 'generator.form.tones.mysterieux',
    description: 'generator.form.tonesDesc.mysterieux',
    icon: Eye,
    color: 'from-purple-400 to-indigo-500',
    verbs: {
      fr: ['Découvre', 'Explore', 'Dévoile', 'Révèle', 'Imagine'],
      en: ['Discover', 'Explore', 'Unveil', 'Reveal', 'Imagine'],
      es: ['Descubre', 'Explora', 'Desvela', 'Revela', 'Imagina'],
      de: ['Entdecke', 'Erkunde', 'Enthülle', 'Offenbare', 'Stelle dir vor'],
      it: ['Scopri', 'Esplora', 'Svela', 'Rivela', 'Immagina'],
      pt: ['Descobre', 'Explora', 'Desvenda', 'Revela', 'Imagina']
    }
  },
  {
    value: 'luxueux',
    label: 'generator.form.tones.luxueux',
    description: 'generator.form.tonesDesc.luxueux',
    icon: Crown,
    color: 'from-amber-400 to-yellow-500',
    verbs: {
      fr: ['Savourez', 'Découvrez', 'Vivez', 'Expérimentez', 'Appréciez'],
      en: ['Savor', 'Discover', 'Experience', 'Indulge', 'Appreciate'],
      es: ['Saborea', 'Descubre', 'Vive', 'Experimenta', 'Aprecia'],
      de: ['Genieße', 'Entdecke', 'Erlebe', 'Schwelge', 'Schätze'],
      it: ['Assapora', 'Scopri', 'Vivi', 'Sperimenta', 'Apprezza'],
      pt: ['Saboreia', 'Descobre', 'Vive', 'Experimenta', 'Aprecia']
    }
  },
  {
    value: 'techy',
    label: 'generator.form.tones.techy',
    description: 'generator.form.tonesDesc.techy',
    icon: Rocket,
    color: 'from-emerald-400 to-teal-500',
    verbs: {
      fr: ['Optimise', 'Configure', 'Automatise', 'Synchronise', 'Connecte'],
      en: ['Optimize', 'Configure', 'Automate', 'Sync', 'Connect'],
      es: ['Optimiza', 'Configura', 'Automatiza', 'Sincroniza', 'Conecta'],
      de: ['Optimiere', 'Konfiguriere', 'Automatisiere', 'Synchronisiere', 'Verbinde'],
      it: ['Ottimizza', 'Configura', 'Automatizza', 'Sincronizza', 'Connetti'],
      pt: ['Otimiza', 'Configura', 'Automatiza', 'Sincroniza', 'Conecta']
    }
  }
]; 