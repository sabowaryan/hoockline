import React from 'react';
import { 
  Activity, 
  Settings, 
  Calendar, 
  FileText, 
  Users, 
  Mail,
  ArrowRight 
} from 'lucide-react';

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  onClick?: () => void;
}

function QuickActionCard({ title, description, icon: Icon, color, onClick }: QuickActionProps) {
  return (
    <div 
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {description}
          </p>
          <div className="flex items-center text-purple-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
            <span>Accéder</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuickActions() {
  const actions = [
    {
      title: 'Activité système',
      description: 'Surveillez les performances et l\'utilisation de l\'application en temps réel',
      icon: Activity,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      onClick: () => console.log('Navigate to system activity')
    },
    {
      title: 'Gestion des utilisateurs',
      description: 'Administrez les comptes utilisateurs, les rôles et les permissions',
      icon: Users,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      onClick: () => console.log('Navigate to user management')
    },
    {
      title: 'Configuration',
      description: 'Gérez les paramètres de l\'application et les intégrations tierces',
      icon: Settings,
      color: 'bg-gradient-to-r from-gray-500 to-gray-600',
      onClick: () => console.log('Navigate to settings')
    },
    {
      title: 'Rapports avancés',
      description: 'Générez des rapports détaillés sur l\'activité et les revenus',
      icon: Calendar,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      onClick: () => console.log('Navigate to reports')
    },
    {
      title: 'Logs système',
      description: 'Consultez les journaux d\'événements et les erreurs système',
      icon: FileText,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      onClick: () => console.log('Navigate to logs')
    },
    {
      title: 'Communication',
      description: 'Envoyez des notifications et gérez la communication utilisateur',
      icon: Mail,
      color: 'bg-gradient-to-r from-pink-500 to-pink-600',
      onClick: () => console.log('Navigate to communication')
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Actions rapides</h3>
        <p className="text-gray-600">Accédez rapidement aux fonctionnalités principales</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <QuickActionCard
            key={index}
            title={action.title}
            description={action.description}
            icon={action.icon}
            color={action.color}
            onClick={action.onClick}
          />
        ))}
      </div>
    </div>
  );
}