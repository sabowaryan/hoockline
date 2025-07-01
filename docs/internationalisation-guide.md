# Guide d'internationalisation (i18n)

## Vue d'ensemble

L'application utilise **react-i18next** pour gérer les traductions en français et anglais. Le système est configuré pour détecter automatiquement la langue du navigateur et permettre à l'utilisateur de changer de langue.

## Structure des fichiers

```
src/
  locales/
    en/
      translation.json    # Traductions anglaises
    fr/
      translation.json    # Traductions françaises
  i18n.ts                 # Configuration i18next
  components/
    LanguageSwitcher.tsx  # Composant de changement de langue
```

## Utilisation dans les composants

### 1. Importer le hook useTranslation

```typescript
import { useTranslation } from 'react-i18next';

function MonComposant() {
  const { t } = useTranslation();
  
  return <h1>{t('common.home')}</h1>;
}
```

### 2. Utiliser les clés de traduction

```typescript
// Texte simple
<span>{t('common.home')}</span>

// Texte avec interpolation
<span>{t('welcome.message', { name: userName })}</span>

// Texte avec pluriel
<span>{t('items.count', { count: itemCount })}</span>
```

## Ajouter une nouvelle traduction

### 1. Ajouter la clé dans les fichiers de traduction

**src/locales/fr/translation.json :**
```json
{
  "nouvelleSection": {
    "titre": "Mon nouveau titre",
    "description": "Ma nouvelle description"
  }
}
```

**src/locales/en/translation.json :**
```json
{
  "nouvelleSection": {
    "titre": "My new title",
    "description": "My new description"
  }
}
```

### 2. Utiliser dans le composant

```typescript
const { t } = useTranslation();

return (
  <div>
    <h1>{t('nouvelleSection.titre')}</h1>
    <p>{t('nouvelleSection.description')}</p>
  </div>
);
```

## Interpolation de variables

### Texte avec variables

**Fichiers de traduction :**
```json
{
  "welcome": "Bonjour {{name}} !",
  "items": "{{count}} éléments"
}
```

**Utilisation :**
```typescript
t('welcome', { name: 'John' })  // "Bonjour John !"
t('items', { count: 5 })       // "5 éléments"
```

## Pluriels

### Configuration automatique

i18next gère automatiquement les pluriels selon la langue :

**Fichiers de traduction :**
```json
{
  "item_one": "{{count}} élément",
  "item_other": "{{count}} éléments"
}
```

**Utilisation :**
```typescript
t('item', { count: 1 })  // "1 élément"
t('item', { count: 5 })  // "5 éléments"
```

## Changer de langue programmatiquement

```typescript
import { useTranslation } from 'react-i18next';

function MonComposant() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <button onClick={() => changeLanguage('en')}>
      English
    </button>
  );
}
```

## Composant LanguageSwitcher

Le composant `LanguageSwitcher` est déjà intégré dans la navbar et permet de basculer entre français et anglais.

### Utilisation personnalisée

```typescript
import LanguageSwitcher from './components/LanguageSwitcher';

function MonComposant() {
  return (
    <div>
      <LanguageSwitcher />
    </div>
  );
}
```

## Bonnes pratiques

### 1. Organisation des clés

- Utilisez une structure hiérarchique : `section.sousSection.element`
- Groupez les clés par fonctionnalité
- Utilisez des noms descriptifs

### 2. Clés de traduction

```json
{
  "common": {
    "buttons": {
      "save": "Sauvegarder",
      "cancel": "Annuler"
    },
    "messages": {
      "success": "Succès",
      "error": "Erreur"
    }
  },
  "pages": {
    "home": {
      "title": "Accueil",
      "description": "Bienvenue sur notre site"
    }
  }
}
```

### 3. Gestion des textes dynamiques

- Évitez de concaténer des chaînes
- Utilisez l'interpolation pour les variables
- Créez des clés spécifiques pour chaque cas

### 4. Tests

```typescript
// Test des traductions
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

test('affiche le texte traduit', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <MonComposant />
    </I18nextProvider>
  );
  
  expect(screen.getByText('Accueil')).toBeInTheDocument();
});
```

## Ajouter une nouvelle langue

### 1. Créer le dossier et fichier

```bash
mkdir src/locales/es
touch src/locales/es/translation.json
```

### 2. Ajouter la langue dans i18n.ts

```typescript
import translationES from './locales/es/translation.json';

const resources = {
  en: { translation: translationEN },
  fr: { translation: translationFR },
  es: { translation: translationES }  // Nouvelle langue
};
```

### 3. Mettre à jour le LanguageSwitcher

Ajouter le bouton pour la nouvelle langue dans `LanguageSwitcher.tsx`.

## Dépannage

### Problèmes courants

1. **Clé manquante** : Vérifiez que la clé existe dans tous les fichiers de traduction
2. **Import manquant** : Assurez-vous d'importer `useTranslation`
3. **Configuration** : Vérifiez que `i18n.ts` est importé dans `main.tsx`

### Debug

Activez le mode debug dans `i18n.ts` :

```typescript
i18n.init({
  debug: true,  // Affiche les clés manquantes
  // ... autres options
});
```

## Ressources

- [Documentation react-i18next](https://react.i18next.com/)
- [Documentation i18next](https://www.i18next.com/)
- [Guide des bonnes pratiques](https://www.i18next.com/overview/best-practices) 