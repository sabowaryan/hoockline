# Plan pour rendre l'application bilingue (français/anglais)

## 1. Choix de la solution d'internationalisation (i18n)
- Utiliser **react-i18next** (basé sur i18next, supporte TypeScript).

## 2. Installation des dépendances
```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

## 3. Structure des fichiers de traduction
Créer le dossier `src/locales/` :
```
src/
  locales/
    en/
      translation.json
    fr/
      translation.json
```

## 4. Configuration d'i18next
Créer `src/i18n.ts` pour configurer i18next avec les fichiers de traduction.

## 5. Intégration dans l'application
Importer la config i18n dans `src/main.tsx` avant de rendre l'app.

## 6. Utilisation dans les composants
Utiliser le hook `useTranslation` pour traduire les textes dans les composants.

## 7. Ajout d'un sélecteur de langue
Créer un composant `LanguageSwitcher.tsx` pour permettre à l'utilisateur de changer de langue.

## 8. Remplacement des textes statiques
Remplacer tous les textes statiques par des clés de traduction via `t('clé')`.

## 9. Gestion des routes et SEO
Adapter les routes et le SEO pour supporter le multilingue si besoin.

## 10. Tests et validation
Vérifier que tous les textes sont traduits et que le changement de langue fonctionne.

## 11. (Optionnel) Extraction et gestion des traductions
Utiliser des outils comme i18next-parser pour extraire automatiquement les clés à traduire.

## 12. Documentation
Documenter dans le README comment ajouter une langue ou une nouvelle clé de traduction.

---

**Résumé des étapes à suivre :**
1. ✅ Installer les dépendances i18n.
2. ✅ Créer les fichiers de traduction.
3. ✅ Configurer i18next.
4. ✅ Intégrer la config dans l'app.
5. ✅ Remplacer tous les textes statiques par des clés de traduction (Navbar).
6. ✅ Ajouter un sélecteur de langue.
7. ✅ Tester et documenter.

**Prochaines étapes :**
- Continuer à remplacer les textes statiques dans les autres composants
- Tester l'application en mode développement
- Ajouter des traductions pour les pages principales 