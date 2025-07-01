import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

export function Breadcrumb() {
  const location = useLocation();

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    if (pathSegments.length === 0) {
      return [{ label: 'Accueil' }];
    }

    const items: BreadcrumbItem[] = [
      { label: 'Accueil', path: '/', icon: <Home className="w-4 h-4" /> }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Map route segments to readable labels
      let label = segment;
      switch (segment) {
        case 'admin':
          label = 'Administration';
          break;
        case 'generator':
          label = 'Générateur';
          break;
        case 'payment':
          label = 'Paiement';
          break;
        case 'results':
          label = 'Résultats';
          break;
        case 'success':
          label = 'Succès';
          break;
        case 'traffic':
          label = 'Trafic';
          break;
        case 'users':
          label = 'Utilisateurs';
          break;
        case 'orders':
          label = 'Commandes';
          break;
        case 'seo':
          label = 'SEO';
          break;
        default:
          label = segment.charAt(0).toUpperCase() + segment.slice(1);
      }

      // Don't make the last item clickable
      if (index === pathSegments.length - 1) {
        items.push({ label });
      } else {
        items.push({ label, path: currentPath });
      }
    });

    return items;
  };

  const items = getBreadcrumbItems();

  // Don't show breadcrumb on home page
  if (items.length === 1 && items[0].label === 'Accueil') {
    return null;
  }

  return (
    <nav className="bg-gray-50 border-b border-gray-100 py-3">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center space-x-2 text-sm">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
              
              {item.path ? (
                <Link
                  to={item.path}
                  className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  {item.icon && item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className="flex items-center space-x-1 text-gray-900 font-medium">
                  {item.icon && item.icon}
                  <span>{item.label}</span>
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
} 