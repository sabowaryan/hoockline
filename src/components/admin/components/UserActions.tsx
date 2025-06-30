import React from 'react';
import { Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react';

interface UserProfile {
  id: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
  email?: string;
}

interface UserActionsProps {
  user: UserProfile;
  onView: (user: UserProfile) => void;
  onEdit: (user: UserProfile) => void;
  onDelete: (user: UserProfile) => void;
}

export function UserActions({ user, onView, onEdit, onDelete }: UserActionsProps) {
  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={() => onView(user)}
        className="text-gray-400 hover:text-blue-600 p-1 rounded transition-colors"
        title="Voir les détails"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button 
        onClick={() => onEdit(user)}
        className="text-gray-400 hover:text-purple-600 p-1 rounded transition-colors"
        title="Modifier l'utilisateur"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button 
        onClick={() => onDelete(user)}
        className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
        title="Supprimer l'utilisateur"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <button 
        className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
        title="Plus d'options"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}