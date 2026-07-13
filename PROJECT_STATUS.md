# 🚦 État du Projet — Plateforme Éducative
> Dernière mise à jour : 2026-06-21 par Antigravity
> Règle : Lire ce fichier EN PREMIER avant de toucher au code.

---

## ✅ Fonctionnalités Validées (NE PAS TOUCHER)

| # | Fonctionnalité | Testé le | Méthode de test |
|---|---|---|---|
| 1 | ✅ Initialisation Vite + React + TS | 2026-06-21 | npm run dev |
| 2 | ✅ Alias TypeScript (`@/*`) | 2026-06-21 | Compilation |
| 3 | ✅ Design System (`tokens.css`, `reset.css`) | 2026-06-21 | Rendu visuel |
| 4 | ✅ Infrastructure API (`apiClient.ts`, Axios) | 2026-06-21 | Inspection de code |
| 5 | ✅ Infrastructure Query (`queryClient.ts`) | 2026-06-21 | Inspection de code |
| 6 | ✅ Store Global (`authStore.ts` Zustand) | 2026-06-21 | Inspection de code |
| 7 | ✅ Router Global (`AppRouter.tsx`, `ProtectedRoute`) | 2026-06-21 | Rendu visuel |
| 8 | ✅ Câblage Global (`AppProviders.tsx`, `main.tsx`) | 2026-06-21 | Rendu visuel |
| 9 | ✅ Page - Connexion (Pixel Perfect HTML) | 2026-06-21 | Navigateur |
| 10 | ✅ Page - Admin (Pixel Perfect HTML + Fix Traductions) | 2026-06-21 | Navigateur |
| 11 | ✅ Feature Auth (Architecture Hexagonale 100%) | 2026-06-21 | Tests manuels |

---

## 🟡 En Cours (Reprendre ici)

| # | Fonctionnalité | Démarré le | Prochaine étape |
|---|---|---|---|
| 1 | 🟡 Composants UI Réutilisables | 2026-06-21 | Créer `shared/components/Button.tsx` et autres. |
| 2 | 🟡 Feature Admin | 2026-06-21 | Transformer `AdminPage` pour respecter l'Hexagonale. |

---

## 🔴 Bugs Identifiés (Résoudre avant de continuer)

Aucun pour l'instant.

---

## 📋 Backlog (Pas encore commencé)

| # | Fonctionnalité | Priorité |
|---|---|---|
| 1 | 🔲 features/payment/ | HAUTE |
| 2 | 🔲 features/schedule/ | HAUTE |
| 3 | 🔲 features/exam/ | HAUTE |
| 4 | 🔲 Mock Backend JSON Server (`db.json`) | MOYENNE |

---

## 🧠 Contexte pour le prochain Agent IA

> **Lis cette section avant de commencer.**

### Ce qui a été fait
- L'infrastructure Hexagonale fondamentale est entièrement en place (apiClient, queryClient, Store, AppProviders, ProtectedRoute).
- L'intégration UI Pixel Perfect de la page de Connexion et du Dashboard Admin est terminée.
- Un bug majeur dû à Google Translate cassant les icônes `material-symbols` a été résolu en ajoutant `translate="no"`.

### Où en est-on
- On commence à intégrer les autres pages du projet depuis le dossier HTML (`toute_les_pages_sont_la`).

### Ce qui est interdit
- Ne pas dévier de la limite de 100 lignes.
- Ne pas modifier le fichier `index.html` (il contient déjà la config exacte Tailwind et les polices).
