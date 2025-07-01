## 🧠 Système de génération d’accroches GPT — Structure Complète

### 📁 1. Formats × Plateformes × Rôles GPT

|   |
| - |

|   |
| - |

| **Format**                   | **Plateforme / Contexte** | **Rôle GPT**                              | **Description du rôle**                                                                                                                    |
| ---------------------------- | ------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Tagline de startup           | Site vitrine / pitch deck | Brand strategist / Startup copywriter     | Crée un slogan court et impactant qui résume la mission ou la valeur unique de la startup. Doit être clair, différenciateur, et mémorable. |
| Titre de formation           | Page de vente             | Formateur expert / Marketer pédagogique   | Crée un titre qui attire la curiosité et met en avant la transformation promise (ex. "De zéro à expert en 30 jours").                      |
| Description App Store / Play | App Store / Google Play   | Spécialiste App Marketing                 | Rédige une description optimisée pour l’App Store, claire, concise, et orientée bénéfices pour l'utilisateur.                              |
| Hero Banner                  | Site Web / Landing page   | Spécialiste UI Copy / Conversion Writer   | Écrit le titre principal visible en haut d’un site. Doit capter l’attention en une phrase et inciter à explorer.                           |
| Call-to-Action (CTA)         | Landing Page / Pub        | Expert CRO (Conversion Rate Optimization) | Génère des CTA courts, incitatifs et testables. Ex : “Essayez gratuitement”, “Réservez votre place”.                                       |
| Slogan publicitaire          | Google Ads / Meta Ads     | Copywriter publicitaire                   | Crée des accroches publicitaires qui convertissent en quelques mots. Doit respecter les limites de caractères (30-90).                     |
| Ad Copy courte               | Meta Ads / Google         | Performance marketer / Ad copy expert     | Rédige une pub persuasive avec USP, bénéfice et incitation. Ton clair, direct et orienté conversion.                                       |
| Tweet startup / produit      | Twitter / X               | Founder voice / Community Builder         | Crée un tweet comme si le fondateur parlait : confiant, authentique, inspirant ou disruptif.                                               |
| Intro email cold B2B         | Email pro                 | SDR / Expert Sales Copy                   | Rédige une phrase d’intro personnalisée qui brise la glace et donne envie de lire la suite.                                                |
| Message onboarding           | Application mobile / SaaS | UX Writer                                 | Crée des messages courts, guidants et engageants pour les nouveaux utilisateurs.                                                           |
| FAQ / Réponse objections     | Page produit / SaaS       | Customer Success / Rédacteur UX           | Rédige des réponses claires à des objections fréquentes. Doit rassurer, être concise et bienveillante.                                     |

---

### 🏹 2. Verbes d’action par Format

| **Format**           | **Verbes d’action suggérés**                       |
| -------------------- | -------------------------------------------------- |
| TikTok Hook          | Découvre, Regarde, Stoppe, Swipe, Devine           |
| Email marketing      | Ouvre, Réserve, Rejoins, Profite, Obtiens          |
| Slogan produit       | Vivez, Découvrez, Libérez, Transformez, Gagnez     |
| Landing page CTA     | Essayez, Téléchargez, Commencez, Obtenez, Réservez |
| Startup tagline      | Simplifiez, Réinventez, Automatisez, Révélez       |
| Formation / Coaching | Apprenez, Maîtrisez, Dominez, Accélérez            |

### 🎯 3. Verbes par Objectif / Ton

| **Objectif**                 | **Verbes d’action**                         |
| ---------------------------- | ------------------------------------------- |
| ✅ Conversion directe         | Achetez, Essayez, Réservez, Téléchargez     |
| 📚 Apprentissage / pédagogie | Apprenez, Découvrez, Comprenez, Maîtrisez   |
| 🚀 Passage à l’acte          | Lancez, Créez, Commencez, Passez à l’action |
| 💡 Curiosité / exploration   | Explorez, Dévoilez, Imaginez, Révélez       |
| ❤️ Émotionnel                | Vivez, Ressentez, Aimez, Inspirez           |

---

### 🌍 4. Adaptation culturelle par langue

| **Langue**     | **Éléments à respecter**                                                                                    |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| Français       | Éviter les anglicismes, respecter le vouvoiement dans les contextes pro, adapter à la culture latine/romane |
| Anglais US     | Ton direct et énergique, idiomes et références américaines, formules orientées action                       |
| Anglais UK     | Plus formel, références culturelles locales, humour subtil                                                  |
| Espagnol       | Ton émotionnel et chaleureux, idiomes typiques, importance de la famille et du ressenti                     |
| Allemand       | Ton structuré et crédible, peu de superlatifs, précision et fiabilité mises en avant                        |
| Arabe          | Respect du registre formel, références à la réussite, respect des normes culturelles et religieuses         |
| Portugais (BR) | Ton détendu, affectif, culturellement vivant, éviter l'excès de formalisme                                  |

> **Règles d’adaptation** : idiomes natifs, formules d’appel à l’action cohérentes, humour et style adaptés localement.

---

### 🤖 5. Règles spécifiques par modèle IA

| **Modèle** | **Spécificités techniques et recommandations**                                                                    |
| ---------- | ----------------------------------------------------------------------------------------------------------------- |
| GPT-4      | Très bonne maîtrise du style, privilégier prompts précis, éviter surcontexte inutile                              |
| Gemini     | Bien pour des phrases émotionnelles et créatives, ajouter des instructions structurées et visuelles (emoji, etc.) |
| Claude     | Très bon pour la clarté et la logique, excellent avec instructions pédagogiques, moins bon avec l’humour          |
| Mistral    | Utiliser pour rapidité et prompts courts, éviter phrases complexes, bien en génération brute                      |
| LLaMA      | Nécessite simplification des contraintes, fonctionne mieux en prompts brefs                                       |

---

### 🧾 6. Prompt principal (exemple de base)

```js
const prompt = `Tu es un copywriter publicitaire de haut niveau, multilingue, expert en psychologie du consommateur et en nuances culturelles locales. Tu crées des phrases d'accroche qui convertissent immédiatement.

🎯 OBJECTIF :
Génère exactement 10 slogans publicitaires irrésistibles pour le concept suivant :
"${concept}" (ex. application mobile de finance personnelle)

🗣️ LANGUE DE SORTIE : ${targetLanguage.toUpperCase()}

🎭 TON REQUIS : ${tone.toUpperCase()}
${toneInstruction}

📏 CONTRAINTES STRICTES :
1. 4 à 8 mots maximum par phrase
2. Chaque mot doit être stratégique, aucun mot inutile
3. Phrases ultra-mémorables, faciles à répéter
4. Parfaitement naturelles et idiomatiques en ${targetLanguage}
5. Zéro cliché, pas de blabla marketing générique
6. Chaque accroche doit inciter à l’action (essayer, cliquer, acheter)
7. Toutes doivent respecter le ton ${tone}
8. Culturellement adaptées à la langue cible

💡 TECHNIQUES À UTILISER (simplifiées pour compatibilité multi-modèles) :
- Sons impactants : allitérations, répétitions
- Rythme fluide : mots courts/longs alternés
- Vocabulaire émotionnel et bénéfices clairs
- Urgence subtile et moderne
- Références culturelles pertinentes

🧪 EXEMPLES :
✅ Bon : "Gérez votre argent en un geste"
❌ Mauvais : "La meilleure application pour tous vos besoins financiers"

🚫 À ÉVITER ABSOLUMENT :
- Généralités sans impact ("La meilleure solution", etc.)
- Superlatifs vagues ("très", "plutôt")
- Jargon technique froid
- Traductions maladroites

✅ TEST FINAL POUR CHAQUE PHRASE :
> “Est-ce que cette phrase me donne vraiment envie d’agir (cliquer, acheter, tester), **dans la culture ciblée** ?”

📤 FORMAT DE SORTIE OBLIGATOIRE :
Réponds UNIQUEMENT avec les **10 slogans**, en ${targetLanguage}, **un par ligne**, sans numérotation, sans commentaires ni balises.

GÉNÈRE MAINTENANT :
`;
```

Souhaitez-vous également une version exportable en JSON pour automatiser dans une interface no-code ou React ?

