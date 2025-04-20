# Documentation de l'application mobile

## Présentation

Cette application mobile permet de rechercher et de consulter des articles de loi à partir d'une base de données centralisée. Elle est développée en React Native avec Expo et utilise Supabase comme backend pour la gestion des données.

---

## Technologies utilisées

- **React Native** : Framework principal pour le développement mobile multiplateforme.
- **Expo** : Outils et services pour simplifier le développement React Native.
- **Supabase** : Backend as a Service (BaaS) basé sur PostgreSQL, utilisé pour l'authentification, le stockage et la gestion des données.

---

## Fonctionnalités principales

- Recherche d'articles de loi par mots-clés ou références.
- Consultation de l'arborescence des codes (livres, parties, titres, chapitres, sections, sous-titres, articles).
- Accès à l'historique des versions des articles.
- Navigation entre les articles liés via les références croisées.

---

## Architecture de la base de données (Supabase)

### Table : `code_sections`
- **id** : identifiant unique (clé primaire)
- **parent_id** : référence à la section parente (clé étrangère sur `code_sections.id`)
- **type** : type de section (`livre`, `partie`, `titre`, `chapitre`, `section`, `sous_titre`, `article`)
- **code** : code unique de la section
- **title** : titre de la section
- **content** : contenu textuel (optionnel)
- **page_number_start** / **page_number_end** : pagination
- **version_date** : date de version
- **created_at** / **updated_at** : timestamps
- **search_vector** : champ pour l’indexation full-text (PostgreSQL tsvector)

#### Index et triggers
- Index sur `code`, `parent_id`, `type`
- Trigger pour la mise à jour automatique du champ `search_vector` (full-text search en français)

### Table : `article_versions`
- **id** : identifiant unique (clé primaire)
- **article_id** : référence à l'article dans `code_sections` (clé étrangère)
- **version_content** : contenu de la version
- **effective_date** : date d'effet de la version
- **created_at** : timestamp
- Index sur `effective_date`

### Table : `article_references`
- **source_article_id** : identifiant de l'article source (clé primaire, clé étrangère sur `code_sections.id`)
- **target_article_id** : identifiant de l'article cible (clé primaire, clé étrangère sur `code_sections.id`)

---

## Paramétrage du projet (Expo)

- Le projet utilise Expo SDK 52 et React 18.
- Pour lancer l'application :
  ```bash
  npm install
  npx expo start
  ```
- Les paramètres de connexion à Supabase sont à renseigner dans un fichier de configuration sécurisé (ex : `.env`).

---

## Bonnes pratiques & conseils

- Respecter la structure hiérarchique lors de l’insertion des sections de code.
- Utiliser la recherche full-text pour optimiser les performances de recherche.
- Maintenir l’historique des articles via la table `article_versions`.
- Gérer les références croisées via la table `article_references`.

---

## Contact & Contributeurs

Pour toute question ou contribution, veuillez contacter l’équipe de développement.
