import React, { memo, useCallback } from 'react';
import { 
  Activity, 
  Settings, 
  Calendar, 
  FileText, 
  Users, 
  Mail,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  onClick?: () => void;
}

const QuickActionCard = memo(({ title, description, icon: Icon, gradient, onClick }: QuickActionProps) => {
  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  return (
    <div 
      className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02]"
      onClick={handleClick}
    >
      {/* Gradient background overlay */}
      <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative p-8">
        <div className="flex items-start space-x-6">
          {/* Icon container with gradient background */}
          <div className={`relative w-16 h-16 ${gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:rotate-6 group-hover:scale-110`}>
            <Icon className="w-8 h-8 text-white drop-shadow-sm" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                {title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                {description}
              </p>
            </div>
            
            {/* Action button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                <span className="text-sm font-semibold mr-2">Accéder</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
              
              {/* Decorative sparkle */}
              <Sparkles className="w-5 h-5 text-gray-300 group-hover:text-yellow-400 transition-colors duration-500 transform group-hover:rotate-12" />
            </div>
          </div>
        </div>
        
        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
      </div>
    </div>
  );
});

export const QuickActions = memo(() => {
  const actions = [
    {
      title: 'Activité système',
      description: 'Surveillez les performances et l\'utilisation de l\'application en temps réel avec des métriques avancées',
      icon: Activity,
      gradient: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700',
      onClick: () => console.log('Navigate to system activity')
    },
    {
      title: 'Gestion des utilisateurs',
      description: 'Administrez les comptes utilisateurs, les rôles et les permissions avec une interface intuitive',
      icon: Users,
      gradient: 'bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700',
      onClick: () => console.log('Navigate to user management')
    },
    {
      title: 'Configuration',
      description: 'Gérez les paramètres de l\'application et les intégrations tierces de manière centralisée',
      icon: Settings,
      gradient: 'bg-gradient-to-br from-slate-500 via-gray-600 to-zinc-700',
      onClick: () => console.log('Navigate to settings')
    },
    {
      title: 'Rapports avancés',
      description: 'Générez des rapports détaillés sur l\'activité et les revenus avec des visualisations interactives',
      icon: Calendar,
      gradient: 'bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700',
      onClick: () => console.log('Navigate to reports')
    },
    {
      title: 'Logs système',
      description: 'Consultez les journaux d\'événements et les erreurs système avec un suivi en temps réel',
      icon: FileText,
      gradient: 'bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-700',
      onClick: () => console.log('Navigate to logs')
    },
    {
      title: 'Communication',
      description: 'Envoyez des notifications et gérez la communication utilisateur de façon efficace',
      icon: Mail,
      gradient: 'bg-gradient-to-br from-pink-500 via-rose-600 to-red-700',
      onClick: () => console.log('Navigate to communication')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-semibold text-purple-700">Actions rapides</span>
        </div>
        <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent">
          Accès rapide
        </h3>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Accédez rapidement aux fonctionnalités principales de votre tableau de bord avec une interface moderne et intuitive
        </p>
      </div>
      
      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {actions.map((action, index) => (
          <div
            key={index}
            className="animate-fade-in"
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}
          >
            <QuickActionCard
              title={action.title}
              description={action.description}
              icon={action.icon}
              gradient={action.gradient}
              onClick={action.onClick}
            />
          </div>
        ))}
      </div>
      
      {/* Decorative elements */}
      <div className="relative">
        <div className="absolute -top-4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
        <div className="absolute -top-8 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -top-2 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
});

// Add custom animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.6s ease-out;
  }
`;
document.head.appendChild(style);