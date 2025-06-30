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

export const SEOManagerPage = memo(() => {
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
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Errors */}
              {formErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-red-900">Erreurs de validation</h4>
                      <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                        {formErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {/* Basic Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chemin de la page *
                    </label>
                    <input
                      type="text"
                      value={editingSettings.page_path}
                      onChange={(e) => setEditingSettings(prev => prev ? {...prev, page_path: e.target.value} : null)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="/example-page"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut
                    </label>
                    <select
                      value={editingSettings.is_active ? 'true' : 'false'}
                      onChange={(e) => setEditingSettings(prev => prev ? {...prev, is_active: e.target.value === 'true'} : null)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="true">Actif</option>
                      <option value="false">Inactif</option>
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Titre de la page *
                    </label>
                    {getCharacterCount(editingSettings.title, 60)}
                  </div>
                  <input
                    type="text"
                    value={editingSettings.title}
                    onChange={(e) => setEditingSettings(prev => prev ? {...prev, title: e.target.value} : null)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Titre optimisé pour le SEO"
                  />
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Meta description
                    </label>
                    {getCharacterCount(editingSettings.description, 160)}
                  </div>
                  <textarea
                    value={editingSettings.description || ''}
                    onChange={(e) => setEditingSettings(prev => prev ? {...prev, description: e.target.value} : null)}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Description concise et attrayante pour les moteurs de recherche"
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
                    onChange={(e) => setEditingSettings(prev => prev ? {...prev, keywords: e.target.value} : null)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="mot-clé1, mot-clé2, mot-clé3"
                  />
                </div>

                {/* Open Graph */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Open Graph (Réseaux sociaux)</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titre Open Graph
                      </label>
                      <input
                        type="text"
                        value={editingSettings.og_title || ''}
                        onChange={(e) => setEditingSettings(prev => prev ? {...prev, og_title: e.target.value} : null)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Titre pour les réseaux sociaux"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description Open Graph
                      </label>
                      <textarea
                        value={editingSettings.og_description || ''}
                        onChange={(e) => setEditingSettings(prev => prev ? {...prev, og_description: e.target.value} : null)}
                        rows={2}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Description pour les réseaux sociaux"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image Open Graph (URL)
                      </label>
                      <input
                        type="url"
                        value={editingSettings.og_image || ''}
                        onChange={(e) => setEditingSettings(prev => prev ? {...prev, og_image: e.target.value} : null)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Paramètres avancés</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL canonique
                      </label>
                      <input
                        type="url"
                        value={editingSettings.canonical_url || ''}
                        onChange={(e) => setEditingSettings(prev => prev ? {...prev, canonical_url: e.target.value} : null)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://clicklone.com/page"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Robots
                      </label>
                      <select
                        value={editingSettings.robots || 'index, follow'}
                        onChange={(e) => setEditingSettings(prev => prev ? {...prev, robots: e.target.value} : null)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="index, follow">Index, Follow</option>
                        <option value="noindex, follow">NoIndex, Follow</option>
                        <option value="index, nofollow">Index, NoFollow</option>
                        <option value="noindex, nofollow">NoIndex, NoFollow</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de schéma
                      </label>
                      <select
                        value={editingSettings.schema_type || 'WebPage'}
                        onChange={(e) => setEditingSettings(prev => prev ? {...prev, schema_type: e.target.value} : null)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="WebPage">WebPage</option>
                        <option value="WebSite">WebSite</option>
                        <option value="WebApplication">WebApplication</option>
                        <option value="CheckoutPage">CheckoutPage</option>
                        <option value="ConfirmationPage">ConfirmationPage</option>
                        <option value="AdminPage">AdminPage</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priorité (0-1)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={editingSettings.priority || 0.5}
                        onChange={(e) => setEditingSettings(prev => prev ? {...prev, priority: parseFloat(e.target.value)} : null)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-6 border-t">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={saving}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sauvegarde...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

SEOManagerPage.displayName = 'SEOManagerPage';