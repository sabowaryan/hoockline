import React, { memo } from 'react';
import { Shield, User } from 'lucide-react';
import { UserActions } from './UserActions';

interface UserProfile {
  id: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
  email?: string;
}

interface UserRowProps {
  user: UserProfile;
  index: number;
  onView: (user: UserProfile) => void;
  onEdit: (user: UserProfile) => void;
  onDelete: (user: UserProfile) => void;
}

export const UserRow = memo(({ user, index, onView, onEdit, onDelete }: UserRowProps) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {user.email?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">
            {user.email || `Utilisateur ${index + 1}`}
          </div>
          <div className="text-sm text-gray-500">
            ID: {user.id.slice(0, 8)}...
          </div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
        user.role === 'admin' 
          ? 'bg-purple-100 text-purple-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {user.role === 'admin' ? (
          <>
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </>
        ) : (
          <>
            <User className="w-3 h-3 mr-1" />
            Utilisateur
          </>
        )}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {new Date(user.created_at).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {new Date(user.updated_at).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      <UserActions 
        user={user}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </td>
  </tr>
));

UserRow.displayName = 'UserRow';