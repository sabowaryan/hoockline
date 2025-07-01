import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Shield, 
  Bell, 
  Palette, 
  Database, 
  Globe,
  BarChart3,
  Save,
  Eye,
  Lock,
  Users,
  Mail,
  CreditCard,
  DollarSign,
  Zap
} from 'lucide-react';
import { 
  getPaymentSettings, 
  updateSystemSetting, 
  getGeneralSettings,
  type PaymentSettings,
  type GeneralSettings 
} from '../../services/settings';
import { useNotification } from '../../components/common/Notification';

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    payment_required: true,
    free_trials_allowed: false,
    trial_limit: 1,
    payment_amount: 399,
    payment_currency: 'EUR'
  });
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    site_name: 'Clicklone',
    site_description: 'Générateur de contenu intelligent'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const [payment, general] = await Promise.all([
        getPaymentSettings(),
        getGeneralSettings()
      ]);
      setPaymentSettings(payment);
      setGeneralSettings(general);
    } catch (error) {
      console.error('Error loading settings:', error);
      showError('Erreur de chargement', 'Impossible de charger les paramètres');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePaymentSettings = async () => {
    setSaving(true);
    try {
      const updates = [
        updateSystemSetting('payment_required', paymentSettings.payment_required),
        updateSystemSetting('free_trials_allowed', paymentSettings.free_trials_allowed),
        updateSystemSetting('trial_limit', paymentSettings.trial_limit),
        updateSystemSetting('payment_amount', paymentSettings.payment_amount),
        updateSystemSetting('payment_currency', paymentSettings.payment_currency)
      ];

      await Promise.all(updates);
      
      showSuccess(
        '✅ Paramètres sauvegardés !', 
        `Configuration de paiement mise à jour avec succès. Montant: ${(paymentSettings.payment_amount / 100).toFixed(2)} ${paymentSettings.payment_currency}`,
        4000
      );
    } catch (error) {
      console.error('Error saving payment settings:', error);
      showError(
        '❌ Erreur de sauvegarde', 
        'Impossible de sauvegarder les paramètres. Veuillez réessayer.',
        6000
      );
    } finally {
      setSaving(false);
    }
  };

  const tabs: TabItem[] = [
    {
      id: 'general',
      label: 'Général',
      icon: Settings,
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres généraux</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du site
                </label>
                <input
                  type="text"
                  value={generalSettings.site_name}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, site_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={generalSettings.site_description}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, site_description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL du site
                </label>
                <input
                  type="url"
                  defaultValue="https://clicklone.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'payment',
      label: 'Paiement',
      icon: CreditCard,
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration des paiements</h3>
            <div className="space-y-6">
              {/* Paiement requis */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Paiement obligatoire</h4>
                  <p className="text-sm text-gray-500">Les utilisateurs doivent payer pour utiliser le générateur</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={paymentSettings.payment_required}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, payment_required: e.target.checked }))}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {/* Essais gratuits */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Essais gratuits autorisés</h4>
                  <p className="text-sm text-gray-500">Permettre aux utilisateurs d'essayer gratuitement</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={paymentSettings.free_trials_allowed}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, free_trials_allowed: e.target.checked }))}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {/* Limite d'essais */}
              {paymentSettings.free_trials_allowed && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Limite d'essais gratuits
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={paymentSettings.trial_limit}
                    onChange={(e) => setPaymentSettings(prev => ({ ...prev, trial_limit: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Montant du paiement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant du paiement (en centimes)
                </label>
                <input
                  type="number"
                  min="100"
                  step="1"
                  value={paymentSettings.payment_amount}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, payment_amount: parseInt(e.target.value) || 399 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Montant actuel : {(paymentSettings.payment_amount / 100).toFixed(2)} {paymentSettings.payment_currency}
                </p>
              </div>

              {/* Devise */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Devise
                </label>
                <select
                  value={paymentSettings.payment_currency}
                  onChange={(e) => setPaymentSettings(prev => ({ ...prev, payment_currency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>

              {/* Bouton de sauvegarde */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSavePaymentSettings}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'seo',
      label: 'SEO',
      icon: Globe,
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta description par défaut
                </label>
                <textarea
                  rows={3}
                  defaultValue="Générateur de contenu intelligent pour créer du contenu de qualité"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mots-clés principaux
                </label>
                <input
                  type="text"
                  defaultValue="générateur de contenu, IA, création de texte"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Sitemap automatique</h4>
                  <p className="text-sm text-gray-500">Générer automatiquement le sitemap XML</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'traffic',
      label: 'Trafic',
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics et trafic</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Search Console
                </label>
                <input
                  type="text"
                  placeholder="URL de vérification"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Suivi des conversions</h4>
                  <p className="text-sm text-gray-500">Activer le suivi des conversions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      label: 'Sécurité',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres de sécurité</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Authentification à deux facteurs</h4>
                  <p className="text-sm text-gray-500">Sécurisez votre compte avec 2FA</p>
                </div>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Activer
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Sessions actives</h4>
                  <p className="text-sm text-gray-500">Gérez vos sessions connectées</p>
                </div>
                <button className="text-purple-600 hover:text-purple-700 font-medium">
                  Voir les sessions
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Préférences de notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Nouvelles commandes</h4>
                  <p className="text-sm text-gray-500">Recevoir une notification pour chaque nouvelle commande</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Nouveaux utilisateurs</h4>
                  <p className="text-sm text-gray-500">Recevoir une notification pour chaque nouvel utilisateur</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'appearance',
      label: 'Apparence',
      icon: Palette,
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thème et apparence</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thème
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                  <option value="auto">Automatique</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur principale
                </label>
                <div className="flex space-x-2">
                  <button className="w-8 h-8 bg-purple-600 rounded-full border-2 border-white shadow-md"></button>
                  <button className="w-8 h-8 bg-blue-600 rounded-full border-2 border-gray-200"></button>
                  <button className="w-8 h-8 bg-green-600 rounded-full border-2 border-gray-200"></button>
                  <button className="w-8 h-8 bg-red-600 rounded-full border-2 border-gray-200"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {tabs.find(tab => tab.id === activeTab)?.content}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">
          <Save className="w-4 h-4" />
          <span>Sauvegarder les modifications</span>
        </button>
      </div>
    </div>
  );
}
