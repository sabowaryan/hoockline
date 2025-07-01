import React, { useState, useEffect, memo } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Globe, 
  Eye,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Settings
} from 'lucide-react';
import { 
  getAllSEOSettings, 
  upsertSEOSettings, 
  deleteSEOSettings, 
  validateSEOSettings,
  getDefaultSEOSettings,
  type SEOSettings 
} from '../../services/seo';

interface SEOFormData extends Partial<SEOSettings> {
  page_path: string;
  title: string;
}

export function SEOManagerPage() {
  const [seoSettings, setSeoSettings] = useState<SEOSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSettings, setEditingSettings] = useState<SEOFormData | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSEOSettings();
  }, []);

  const fetchSEOSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const settings = await getAllSEOSettings();
      setSeoSettings(settings);
    } catch (err: any) {
      console.error('Error fetching SEO settings:', err);
      setError('Erreur lors du chargement des paramètres SEO');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (settings: SEOSettings) => {
    setEditingSettings(settings);
    setShowForm(true);
    setFormErrors([]);
  };

  const handleAdd = () => {
    const defaultSettings = getDefaultSEOSettings('/new-page');
    setEditingSettings({
      page_path: '',
      title: '',
      ...defaultSettings
    });
    setShowForm(true);
    setFormErrors([]);
  };

  const handleSave = async () => {
    if (!editingSettings) return;

    const errors = validateSEOSettings(editingSettings);
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const success = await upsertSEOSettings(editingSettings as SEOSettings);
      if (success) {
        await fetchSEOSettings();
        setShowForm(false);
        setEditingSettings(null);
        setFormErrors([]);
      } else {
        setFormErrors(['Erreur lors de la sauvegarde']);
      }
    } catch (err) {
      setFormErrors(['Erreur lors de la sauvegarde']);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ces paramètres SEO ?')) {
      return;
    }

    try {
      const success = await deleteSEOSettings(id);
      if (success) {
        await fetchSEOSettings();
      }
    } catch (err) {
      console.error('Error deleting SEO settings:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSettings(null);
    setFormErrors([]);
  };

  const filteredSettings = seoSettings.filter(settings =>
    settings.page_path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    settings.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCharacterCount = (text: string | undefined, maxLength: number) => {
    const length = text?.length || 0;
    const isOverLimit = length > maxLength;
    return (
      <span className={`text-xs ${isOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
        {length}/{maxLength}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchSEOSettings}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Gestion SEO
          </h2>
          <p className="text-gray-600">
            Configurez les paramètres SEO pour chaque page de votre site
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="mt-4 sm:mt-0 inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une page</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher par chemin ou titre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* SEO Settings List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Paramètres SEO ({filteredSettings.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Page
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre SEO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSettings.length > 0 ? (
                filteredSettings.map((settings) => (
                  <tr key={settings.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {settings.page_path}
                          </div>
                          <div className="text-sm text-gray-500">
                            Priorité: {settings.priority}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {settings.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {settings.title.length}/60 caractères
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {settings.description || 'Aucune description'}
                      </div>
                      {settings.description && (
                        <div className="text-xs text-gray-500">
                          {settings.description.length}/160 caractères
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        settings.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {settings.is_active ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Actif
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3 mr-1" />
                            Inactif
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => window.open(settings.canonical_url || `${window.location.origin}${settings.page_path}`, '_blank')}
                          className="text-gray-400 hover:text-blue-600 p-1 rounded transition-colors"
                          title="Voir la page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(settings)}
                          className="text-gray-400 hover:text-purple-600 p-1 rounded transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(settings.id!)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center">
                      <Settings className="w-8 h-8 text-gray-300 mb-2" />
                      <p>Aucun paramètre SEO trouvé</p>
                      {searchTerm && (
                        <p className="text-xs text-gray-400 mt-1">
                          Essayez de modifier votre recherche
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && editingSettings && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={handleCancel}
            />

            {/* Modal */}
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {editingSettings.id ? 'Modifier' : 'Ajouter'} les paramètres SEO
                    </h3>
                    <p className="text-sm text-gray-600">
                      Configurez les balises méta pour optimiser le référencement
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCancel}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="space-y-6">
                {/* Error Messages */}
              {formErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <h4 className="text-sm font-medium text-red-900">Erreurs de validation</h4>
                    </div>
                    <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                        {formErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                </div>
              )}

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Page Path */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chemin de la page *
                    </label>
                    <input
                      type="text"
                      value={editingSettings.page_path}
                      onChange={(e) => setEditingSettings(prev => ({ ...prev!, page_path: e.target.value }))}
                      placeholder="/exemple-page"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priorité
                    </label>
                    <input
                      type="number"
                      value={editingSettings.priority || 0}
                      onChange={(e) => setEditingSettings(prev => ({ ...prev!, priority: parseInt(e.target.value) || 0 }))}
                      min="0"
                      max="1"
                      step="0.1"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre SEO * {getCharacterCount(editingSettings.title, 60)}
                    </label>
                  <input
                    type="text"
                    value={editingSettings.title}
                    onChange={(e) => setEditingSettings(prev => ({ ...prev!, title: e.target.value }))}
                    placeholder="Titre optimisé pour le SEO"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description {getCharacterCount(editingSettings.description, 160)}
                    </label>
                  <textarea
                    value={editingSettings.description || ''}
                    onChange={(e) => setEditingSettings(prev => ({ ...prev!, description: e.target.value }))}
                    placeholder="Description de la page pour les moteurs de recherche"
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mots-clés
                  </label>
                  <input
                    type="text"
                    value={editingSettings.keywords || ''}
                    onChange={(e) => setEditingSettings(prev => ({ ...prev!, keywords: e.target.value }))}
                    placeholder="mot-clé1, mot-clé2, mot-clé3"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Canonical URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL canonique
                      </label>
                      <input
                        type="url"
                        value={editingSettings.canonical_url || ''}
                    onChange={(e) => setEditingSettings(prev => ({ ...prev!, canonical_url: e.target.value }))}
                    placeholder="https://example.com/page-canonique"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                {/* Active Status */}
                <div className="flex items-center">
                      <input
                    type="checkbox"
                    id="is_active"
                    checked={editingSettings.is_active || false}
                    onChange={(e) => setEditingSettings(prev => ({ ...prev!, is_active: e.target.checked }))}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                    Activer ces paramètres SEO
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sauvegarde...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Sauvegarder</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

SEOManagerPage.displayName = 'SEOManagerPage';