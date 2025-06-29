# 🚀 Clicklone - Générateur IA de Phrases d'Accroche

**Trouvez votre slogan parfait en 1 clic !**

Clicklone est un générateur intelligent de phrases d'accroche propulsé par l'IA Gemini de Google. Fini les heures passées à chercher LA phrase qui accroche - notre IA génère 10 slogans percutants adaptés à votre concept et votre ton en quelques secondes.

![Clicklone Preview](https://via.placeholder.com/800x400/6366f1/ffffff?text=Clicklone+-+G%C3%A9n%C3%A9rateur+IA)

## ✨ Fonctionnalités

### 🎯 **Génération Intelligente**
- **10 phrases uniques** générées en moins de 5 secondes
- **Propulsé par Gemini AI** pour une qualité exceptionnelle
- **Algorithmes avancés** adaptés à chaque secteur d'activité

### 🎨 **Personnalisation Avancée**
- **6 tons différents** : Humoristique, Inspirant, Direct, Mystérieux, Luxueux, Technologique
- **6 langues supportées** : Français, Anglais, Espagnol, Allemand, Italien, Portugais
- **Adaptation culturelle** pour chaque langue

### 🌍 **Multi-langues & Multi-culturel**
- Interface disponible en français
- Génération native dans 6 langues
- Adaptation aux références culturelles locales
- Nuances linguistiques respectées

### 💎 **Expérience Premium**
- Interface moderne et responsive
- Design élégant avec animations fluides
- Copie en un clic de vos phrases favorites
- Paiement sécurisé avec Stripe

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** avec TypeScript
- **Tailwind CSS** pour le design
- **Lucide React** pour les icônes
- **Vite** comme bundler

### IA & Backend
- **Google Gemini AI** (gemini-2.0-flash-exp)
- **API Google Generative AI** (@google/generative-ai)
- Prompts optimisés pour chaque ton et langue

### Déploiement
- **Netlify** pour l'hébergement
- **Redirections SPA** configurées
- **Variables d'environnement** sécurisées

## 🚀 Installation & Configuration

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Clé API Google Gemini

### Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/clicklone.git
cd clicklone

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
```

### Configuration de l'API Gemini

1. Obtenez votre clé API sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Ajoutez-la dans votre fichier `.env` :

```env
VITE_GEMINI_API_KEY=votre_cle_api_gemini_ici
```

### Lancement en développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build de production

```bash
npm run build
npm run preview
```

## 📱 Fonctionnement de l'Application

### 1. **Page d'Accueil**
- Présentation du service
- Exemples de phrases générées
- Fonctionnalités mises en avant
- Call-to-action vers le générateur

### 2. **Générateur IA**
- **Saisie du concept** : Description libre jusqu'à 200 caractères
- **Sélection de la langue** : 6 langues avec drapeaux
- **Choix du ton** : 6 tons avec descriptions
- **Génération** : Traitement par Gemini AI en temps réel

### 3. **Système de Paiement**
- Récapitulatif de la commande (3€)
- Formulaire de paiement sécurisé
- Simulation Stripe (pour la démo)
- Validation et redirection

### 4. **Résultats**
- Affichage des 10 phrases générées
- Copie en un clic avec feedback visuel
- Options de régénération
- Retour à l'accueil

## 🎨 Architecture du Code

### Structure des Composants

```
src/
├── components/
│   ├── Layout.tsx          # Layout principal avec navbar/footer
│   ├── Navbar.tsx          # Navigation responsive
│   ├── Footer.tsx          # Footer avec liens et badge Bolt
│   ├── HomePage.tsx        # Page d'accueil
│   ├── Generator.tsx       # Interface de génération
│   ├── Payment.tsx         # Page de paiement
│   ├── Results.tsx         # Affichage des résultats
│   └── BoltBadge.tsx       # Badge "Built with Bolt.new"
├── context/
│   └── AppContext.tsx      # État global de l'application
├── services/
│   └── gemini.ts          # Service d'intégration Gemini AI
├── types/
│   └── index.ts           # Types TypeScript
└── utils/
    └── generator.ts       # Utilitaires de génération (fallback)
```

### Gestion d'État

L'application utilise React Context pour gérer l'état global :

- **Navigation** entre les étapes
- **Données de génération** (concept, ton, langue)
- **Phrases générées** par l'IA
- **État de chargement** et gestion d'erreurs

### Service Gemini AI

Le service `gemini.ts` gère :
- **Configuration** de l'API Gemini
- **Prompts optimisés** pour chaque ton et langue
- **Traitement** et validation des réponses
- **Gestion d'erreurs** robuste

## 🎯 Tons Disponibles

### 🎭 **Humoristique**
- Ironie et jeux de mots
- Références pop culture
- Tournures inattendues
- Finesse française

### 💪 **Inspirant**
- Verbes d'action puissants
- Évocation du succès
- Personnalisation directe
- Motivation positive

### ⚡ **Direct et Bref**
- Phrases ultra-courtes (4-6 mots)
- Impératifs catégoriques
- Suppression du superflu
- Impact immédiat

### 🔮 **Mystérieux**
- Questions intrigantes
- Évocation de secrets
- Curiosité sans révélation
- Méthodes cachées

### 👑 **Luxueux**
- Vocabulaire raffiné
- Évocation de l'excellence
- Appartenance à l'élite
- Sophistication premium

### 🤖 **Technologique**
- Vocabulaire tech moderne
- Innovation et disruption
- Intelligence artificielle
- Optimisation avancée

## 🌍 Support Multi-langues

### Langues Supportées
- 🇫🇷 **Français** - Langue principale
- 🇺🇸 **Anglais** - Marché international
- 🇪🇸 **Espagnol** - Marché hispanophone
- 🇩🇪 **Allemand** - Marché germanophone
- 🇮🇹 **Italien** - Marché italien
- 🇵🇹 **Portugais** - Marchés lusophone

### Adaptation Culturelle
- **Références locales** intégrées
- **Nuances linguistiques** respectées
- **Structures grammaticales** natives
- **Expressions idiomatiques** appropriées

## 💰 Modèle Économique

### Tarification Simple
- **3€ par pack** de 10 phrases d'accroche
- **Paiement unique** sans abonnement
- **Accès immédiat** aux résultats
- **Copie illimitée** des phrases

### Fonctionnalités Gratuites
- **Génération** des phrases (masquées)
- **Aperçu** du service
- **Test** de l'interface
- **Exemples** de qualité

## 🔒 Sécurité & Confidentialité

### Protection des Données
- **Chiffrement SSL** pour toutes les communications
- **API sécurisées** avec authentification
- **Pas de stockage** des données personnelles
- **Conformité RGPD** européenne

### Paiements Sécurisés
- **Intégration Stripe** (simulation pour la démo)
- **Chiffrement** des données bancaires
- **Validation** des transactions
- **Historique** sécurisé

## 📊 Performance & Optimisation

### Optimisations Frontend
- **Code splitting** automatique avec Vite
- **Lazy loading** des composants
- **Images optimisées** et responsive
- **Cache intelligent** des ressources

### Optimisations IA
- **Prompts optimisés** pour réduire la latence
- **Gestion d'erreurs** avec retry automatique
- **Validation** de la qualité des réponses
- **Fallback** en cas d'échec

## 🚀 Déploiement

### Netlify (Recommandé)
```bash
# Build de production
npm run build

# Déploiement automatique via Git
# Les redirections SPA sont configurées dans public/_redirects
```

### Variables d'Environnement
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 🤝 Contribution

### Comment Contribuer
1. **Fork** le repository
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### Standards de Code
- **TypeScript** strict activé
- **ESLint** pour la qualité du code
- **Prettier** pour le formatage
- **Tests** requis pour les nouvelles fonctionnalités

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- **Google Gemini AI** pour la technologie d'IA
- **Bolt.new** pour l'environnement de développement
- **Tailwind CSS** pour le système de design
- **Lucide** pour les icônes élégantes

## 📞 Support & Contact

- **Email** : support@clicklone.com
- **Documentation** : [docs.clicklone.com](https://docs.clicklone.com)
- **Status** : [status.clicklone.com](https://status.clicklone.com)

---

**Fait avec ❤️ pour les créateurs et entrepreneurs qui veulent des phrases d'accroche qui convertissent !**

[![Built with Bolt.new](https://img.shields.io/badge/Built%20with-Bolt.new-blue)](https://bolt.new)
[![Powered by Gemini AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-orange)](https://ai.google.dev)
[![Deploy to Netlify](https://img.shields.io/badge/Deploy%20to-Netlify-00C7B7)](https://netlify.com)