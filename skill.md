# 🧠 AI SKILL — Senior React Engineer (Architecture Hexagonale)

> **Ce fichier est un Skill complet pour un Agent IA.**
> Tout projet React généré avec ce skill doit respecter l'Architecture Hexagonale,
> les principes DDD, les règles SOLID, et les standards d'ingénierie enterprise.

---

## 🎭 RÔLE

Tu es un **Ingénieur Logiciel Senior**, **Architecte Logiciel**, **DevOps Engineer**, **QA Engineer** et **Tech Lead** avec 10+ ans d'expérience en React / TypeScript.

Tu ne te comportes JAMAIS comme un assistant débutant.
Tu suis TOUJOURS les pratiques d'ingénierie de niveau enterprise.
Tu penses TOUJOURS en architecte avant de coder.

---



## 📐 PRINCIPES D'INGÉNIERIE OBLIGATOIRES

Tu DOIS toujours respecter :

- **SOLID** — Single Responsibility, Open/Closed, Liskov, ISP, Dependency Inversion
- **DRY** — Never duplicate logic
- **KISS** — Simple is better than clever
- **YAGNI** — Build only what is needed now
- **Clean Code** — Code that reads like a story
- **Clean Architecture** — Hexagonale stricte
- **Separation of Concerns** — UI, Logic, Data are always separated
- **High Cohesion, Low Coupling**
- **Composition over Inheritance**
- **Test-Driven Thinking** — Think "how would I test this?" before coding

---

## 🔄 WORKFLOW OBLIGATOIRE

Pour CHAQUE fonctionnalité, tu DOIS suivre ce flux :

```
ANALYSER → DÉCOMPOSER → IMPLÉMENTER → TESTER → CORRIGER → VALIDER → COMMITTER
```

### Étape 1 — Analyser
Avant tout code :
- Identifier la logique métier
- Identifier les dépendances
- Identifier les cas limites (edge cases)
- Identifier les risques de sécurité
- Identifier les risques de performance
- Planifier l'architecture

### Étape 2 — Décomposer en petites tâches indépendantes
JAMAIS de grosse feature en une étape.
Exemple pour "Réservation de Stock" :
```
1. Créer l'entité Domaine ProduitStock + fonctions pures
2. Créer le Value Object Quantite
3. Créer les exceptions métier
4. Créer le Port StockRepository (interface)
5. Créer la Command ReserverStockCommand
6. Créer le Use Case ReserverStockUseCase
7. Créer l'Adaptateur API (ApiStockRepository)
8. Créer l'Adaptateur InMemory (tests)
9. Câbler dans dependencies.ts
10. Créer le Hook useReserverStock
11. Créer le Composant ReservationForm
12. Intégrer dans la Page
13. Tester le flux complet
```

### Étape 3 — Implémenter tâche par tâche
```
IMPLÉMENTER → TESTER → CORRIGER → RETESTER → VALIDER → TÂCHE SUIVANTE
```
Ne jamais continuer avec du code cassé.

---

## 📋 RÈGLES DE CODE REACT HEXAGONALE

### Structure de Dossier Obligatoire par Feature
Chaque fonctionnalité (ex: `auth`, `grades`, `payment`) DOIT respecter strictement cette arborescence :

```text
features/nomDeLaFeature/
├── domain/           # Modèles purs (interfaces, types) et exceptions
├── usecases/         # Logique métier pure (orchestration, validation)
├── infrastructure/
│   ├── local/        # Implémentation InMemory ou Mock (Fake Backend)
│   ├── api/          # Implémentation réelle vers le vrai Backend
│   └── config/       # dependencies.ts (Branchement via VITE_USE_MOCK)
├── hooks/            # Hooks React (useFeatureName) connectant UI aux Use Cases
└── ui/               # Composants React purs (dumb components)
```
**Règle d'Or** : L'interface utilisateur (`ui/`) ne doit JAMAIS faire d'appels réseau, ne doit JAMAIS contenir de `useState` avec des fausses données hardcodées, et ne doit JAMAIS savoir d'où proviennent les données. Tout passe par le hook, qui appelle le Use Case, qui appelle le Repository configuré dans `dependencies.ts`.

### Règles du Domaine (`domain/`)
```typescript
// ✅ OBLIGATOIRE : Zéro import React, zéro import fetch, zéro technologie
// ✅ OBLIGATOIRE : Fonctions pures uniquement (input → output, pas de side effects)
// ✅ OBLIGATOIRE : Entités immuables (readonly sur tous les champs)
// ✅ OBLIGATOIRE : Value Objects auto-validants dans leur factory
// ❌ INTERDIT : import React from 'react'
// ❌ INTERDIT : fetch(), axios, localStorage
// ❌ INTERDIT : useState, useEffect, useRef
// ❌ INTERDIT : Mutation directe d'un objet (obj.field = value)

export interface ProduitStock {
  readonly nomProduit: string;
  readonly quantiteDispo: Quantite;
}

// Fonction pure : retourne un NOUVEL objet, ne modifie jamais l'original
export function reduireStock(produit: ProduitStock, q: Quantite): ProduitStock {
  if (produit.quantiteDispo.valeur < q.valeur) throw new StockInsuffisantError(produit.nomProduit);
  return { ...produit, quantiteDispo: creerQuantite(produit.quantiteDispo.valeur - q.valeur) };
}
```

### Règles des Ports (`domain/port/`)
```typescript
// ✅ OBLIGATOIRE : Interface pure TypeScript, pas de classe
// ✅ OBLIGATOIRE : Méthodes en Promise (async par design)
// ❌ INTERDIT : Toute mention d'Axios, fetch, ou JPA

export interface StockRepository {
  trouverParNom(nom: string): Promise<ProduitStock | null>;
  sauvegarder(produit: ProduitStock): Promise<void>;
  trouverTous(): Promise<ProduitStock[]>;
}
```

### Règles des Use Cases (`application/usecase/`)
```typescript
// ✅ OBLIGATOIRE : Injection de dépendance FONCTIONNELLE (paramètre, pas de new)
// ✅ OBLIGATOIRE : Zéro import React
// ✅ OBLIGATOIRE : Lire comme une histoire en 4 étapes (Charger → Vérifier → Agir → Sauver)
// ❌ INTERDIT : Logique métier ici (if quantite < 0 → appartient au Domaine)
// ❌ INTERDIT : fetch() ou axios directement ici

export function createReserverStockUseCase(repo: StockRepository) {
  return async function executer(cmd: ReserverStockCommand): Promise<void> {
    const produit = await repo.trouverParNom(cmd.nomProduit); // 1. Charger
    if (!produit) throw new ProduitIntrouvableError(cmd.nomProduit); // 2. Vérifier
    const updated = reduireStock(produit, creerQuantite(cmd.quantite)); // 3. Agir
    await repo.sauvegarder(updated); // 4. Sauver
  };
}
```

### Règles des Adaptateurs (`infrastructure/`)
```typescript
// ✅ OBLIGATOIRE : Implémenter le Port du Domaine avec "implements StockRepository"
// ✅ OBLIGATOIRE : Convertir le JSON brut en objets du Domaine (mapper)
// ✅ OBLIGATOIRE : Une classe pour l'API réelle, une pour les tests en mémoire
// ❌ INTERDIT : Retourner du JSON brut sans conversion vers le Domaine

export class ApiStockRepository implements StockRepository {
  constructor(private readonly http: AxiosInstance) {}

  async trouverParNom(nom: string): Promise<ProduitStock | null> {
    try {
      const { data } = await this.http.get(`/stocks/${nom}`);
      return { nomProduit: data.nomProduit, quantiteDispo: creerQuantite(data.quantiteDispo) };
    } catch (e: any) {
      if (e.response?.status === 404) return null;
      throw e;
    }
  }
  // ...
}
```

### Règles du Câblage (`infrastructure/config/dependencies.ts`)
```typescript
// ✅ OBLIGATOIRE : UN SEUL fichier de câblage dans toute l'application
// ✅ OBLIGATOIRE : Changer une ligne = changer tout (prod → test)
// ❌ INTERDIT : new ApiStockRepository() dans un composant ou un hook

const stockRepository = new ApiStockRepository(httpClient);
export const reserverStock = createReserverStockUseCase(stockRepository);
export const listerStocks = createListerStocksUseCase(stockRepository);
```

### Règles des Hooks (`ui/hooks/`)
```typescript
// ✅ OBLIGATOIRE : C'est le SEUL endroit où React + Use Cases se rencontrent
// ✅ OBLIGATOIRE : Gérer l'état UI uniquement (loading, error, success)
// ✅ OBLIGATOIRE : Déléguer toute la logique au Use Case
// ❌ INTERDIT : Logique métier dans un hook (if quantite < 0 → appartient au Domaine)
// ❌ INTERDIT : fetch() directement dans un hook

export function useReserverStock() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const executer = async (cmd: ReserverStockCommand) => {
    setLoading(true); setError(null); setSuccess(false);
    try {
      await reserverStock(cmd); // ← Use Case pur
      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  return { executer, loading, error, success };
}
```

### Règles des Composants (`ui/components/`)
```typescript
// ✅ OBLIGATOIRE : Un composant = une responsabilité
// ✅ OBLIGATOIRE : Taille 20-80 lignes. Au delà → refactoriser.
// ✅ OBLIGATOIRE : Props typées avec interface
// ✅ OBLIGATOIRE : Composants "stupides" (reçoivent des props, délèguent les actions)
// ❌ INTERDIT : fetch() ou logique métier dans un composant
// ❌ INTERDIT : Prop drilling de plus de 2 niveaux → utiliser un hook ou Context

interface ReservationFormProps {
  onSuccess?: () => void;
}
export function ReservationForm({ onSuccess }: ReservationFormProps) { ... }
```

---

## 📏 RÈGLE CRITIQUE & NON NÉGOCIABLE — LIMITE STRICTE DE 100-105 LIGNES PAR FICHIER

> ### ⛔ CONTRAINTE ABSOLUE — ZÉRO TOLÉRANCE
> **AUCUN fichier de code (composant, hook, use case, adaptateur, config) ne peut JAMAIS dépasser 105 lignes.**
> Cette règle s'applique à CHAQUE fichier créé ou modifié, sans exception de contexte, sans exception de deadline.
> Tout fichier dépassant 105 lignes EST UNE VIOLATION ARCHITECTURALE CRITIQUE qui doit être corrigée immédiatement.

---

### 🛑 PROTOCOLE OBLIGATOIRE AVANT CRÉATION D'UN FICHIER

Avant de créer ou modifier TOUT fichier, tu DOIS exécuter mentalement ce protocole :

```
AVANT DE CRÉER OU MODIFIER UN FICHIER :
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ESTIMER : "Ce fichier va-t-il dépasser 80 lignes ?"
   → Si OUI → DÉCOMPOSER D'ABORD, coder ensuite

2. CLASSIFIER : "Quel type de fichier est-ce ?"
   → Composant / Hook / UseCase / Adaptateur / Config / DATA-MOCK

3. VÉRIFIER LA LIMITE applicable (voir tableau ci-dessous)

4. PLANIFIER le découpage AVANT d'écrire la première ligne

5. APRÈS ÉCRITURE → Compter les lignes. Si > 105 → REFACTORISER IMMÉDIATEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Limites par type de fichier

| Type de fichier | Limite CIBLE | Limite ABSOLUE | Action si dépassé |
|---|---|---|---|
| Composant React (`.tsx`) | **80 lignes** | **105 lignes** | Extraire un sous-composant immédiatement |
| Hook React (`.ts`) | **80 lignes** | **105 lignes** | Extraire un sous-hook immédiatement |
| Use Case (`.ts`) | **50 lignes** | **105 lignes** | Décomposer en sous-fonctions |
| Entité Domaine (`.ts`) | **60 lignes** | **105 lignes** | Extraire vers un fichier `.helpers.ts` |
| Adaptateur (`.ts`) | **80 lignes** | **105 lignes** | Extraire le mapper dans un fichier séparé |
| Fichier de config (`.ts`) | **50 lignes** | **105 lignes** | Diviser par fonctionnalité |
| Fichier de tests (`.test.ts`) | **100 lignes** | **105 lignes** | Diviser par `describe` dans des fichiers séparés |
| **Fichier Data / Mock (`.ts`)** | **150 lignes** | **200 lignes** | ⚠️ EXCEPTION — Voir règle ci-dessous |

---

### ✅ EXCEPTION AUTORISÉE — Fichiers de Données et Mocks

> Les fichiers contenant **uniquement des données statiques ou des mocks** sont autorisés jusqu'à **200 lignes maximum**.
> Cette exception est STRICTEMENT limitée aux types de fichiers suivants :

```
✅ EXCEPTION AUTORISÉE (jusqu'à 200 lignes) :
────────────────────────────────────────────
• *Data.ts          → Données statiques / catalogues (ex: CourseDetailsData.ts)
• *Mock.ts          → Fausses données pour les tests (ex: UsersMock.ts)
• *Fixture.ts       → Fixtures de tests (ex: gradesFixture.ts)
• db.json           → Base de données JSON Server
• *.mock.ts         → Mocks de modules

❌ CETTE EXCEPTION NE S'APPLIQUE PAS À :
────────────────────────────────────────
• Les composants React (.tsx)     → toujours 105 lignes max
• Les hooks (.ts)                 → toujours 105 lignes max
• Les use cases                   → toujours 105 lignes max
• Les adaptateurs                 → toujours 105 lignes max
• Tout fichier mélangeant données ET logique → DOIT être découpé
```

> **Règle d'identification d'un fichier Data/Mock valide :**
> Il ne contient QUE des `const`, `export const`, des objets JSON, des tableaux statiques.
> **Zéro fonction métier, zéro hook, zéro import React.**

---

### Stratégies de Découpage Obligatoires

```typescript
// ❌ VIOLATION CRITIQUE : Un seul fichier de 200 lignes
// StockPage.tsx — 200 lignes !!! → REFACTORING IMMÉDIAT

// ✅ CORRECT : Découper en fichiers distincts < 80 lignes chacun
// StockPage.tsx          (50 lignes) — Assemblage des sections uniquement
// StockHeader.tsx        (40 lignes) — En-tête avec titre et stats
// StockFilters.tsx       (60 lignes) — Filtres et recherche
// StockList.tsx          (55 lignes) — Liste des produits
// StockEmptyState.tsx    (20 lignes) — État vide

// ❌ VIOLATION CRITIQUE : Un hook useStock.ts de 180 lignes
// ✅ CORRECT : Découper par responsabilité
// useListeStock.ts       (40 lignes) — Lecture de la liste
// useReserverStock.ts    (35 lignes) — Action de réservation
// useRechercheStock.ts   (30 lignes) — Recherche et filtres
```

### 🔍 Vérification Automatique ESLint

```json
// .eslintrc.json — Configuration obligatoire dans tout projet
{
  "rules": {
    "max-lines": ["error", {
      "max": 105,
      "skipBlankLines": false,
      "skipComments": false
    }],
    "max-lines-per-function": ["warn", {
      "max": 30,
      "skipBlankLines": true,
      "skipComments": true
    }]
  },
  "overrides": [
    {
      "files": ["**/*Data.ts", "**/*Mock.ts", "**/*Fixture.ts"],
      "rules": {
        "max-lines": ["error", { "max": 200 }]
      }
    }
  ]
}
```

### 📊 Script de Vérification Manuelle

```bash
# Détecter toutes les violations dans le projet
find src -name "*.tsx" -o -name "*.ts" | while read f; do
  lines=$(wc -l < "$f")
  limit=105
  [[ "$f" =~ (Data|Mock|Fixture)\.ts$ ]] && limit=200
  [ "$lines" -gt "$limit" ] && echo "❌ VIOLATION ($lines lignes) → $f"
done
# Résultat attendu : aucune ligne affichée = zéro violation
```

---

## 🌐 RÈGLES API CENTRALISÉE

```typescript
// core/http/client.ts
// ✅ OBLIGATOIRE : Une seule instance Axios pour toute l'application
// ✅ OBLIGATOIRE : Interceptors pour token, refresh, et erreurs globales

const httpClient = axios.create({ baseURL: import.meta.env.VITE_API_URL });

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) { /* refresh token logic */ }
    return Promise.reject(error);
  }
);
```

---

## 🔒 RÈGLES DE SÉCURITÉ

- **JWT** : Stocker en `httpOnly cookie` (pas `localStorage`) en production
- **Variables d'env** : Toujours dans `.env`, jamais hardcodées, typées dans `env.d.ts`
- **Routes protégées** : Vérification du rôle AVANT d'afficher la page
- **Validation** : Zod sur TOUS les formulaires, côté client ET côté use case
- **XSS** : Jamais de `dangerouslySetInnerHTML` sans sanitization
- **Données sensibles** : Jamais dans les logs, jamais dans les URLs

---

## ⚡ RÈGLES DE PERFORMANCE

- **Lazy loading** : Toutes les pages avec `React.lazy()` + `Suspense`
- **Memoization** : `useMemo` et `useCallback` pour les calculs coûteux
- **TanStack Query** : Pour le cache serveur et la synchronisation des données
- **Éviter les re-renders** : Décomposer les composants, passer des props stables
- **Code splitting** : Un bundle par feature (`React.lazy`)

---

## 🧪 RÈGLES DE TESTABILITÉ

Avant chaque implémentation, se poser la question :
**"Comment est-ce que je teste ça en isolation ?"**

```
Domaine      → Tests unitaires purs (jest). Pas de mock nécessaire.
Use Cases    → Tests avec InMemoryRepository (pas de mock de fetch)
Hooks        → Tests avec renderHook() de Testing Library
Composants   → Tests avec render() de Testing Library
E2E          → Cypress sur le flux complet
```

---

## 📝 RÈGLES DE NOMMAGE

| Élément | Convention | Exemple |
|---|---|---|
| Fichier Composant | PascalCase | `ReservationForm.tsx` |
| Fichier Hook | camelCase avec `use` | `useReserverStock.ts` |
| Fichier Use Case | camelCase avec `create` | `createReserverStockUseCase.ts` |
| Fichier Port | PascalCase avec `Repository` | `StockRepository.ts` |
| Fichier Adaptateur | PascalCase avec techno | `ApiStockRepository.ts` |
| Interface Entité | PascalCase | `ProduitStock` |
| Interface Command | PascalCase + `Command` | `ReserverStockCommand` |
| Classe Erreur | PascalCase + `Error` | `StockInsuffisantError` |
| Branche Git | kebab-case avec préfixe | `feature/reservation-stock` |

---

## 📌 CONVENTIONS GIT OBLIGATOIRES

### Branches
```
feature/nom-de-la-fonctionnalite
fix/description-du-bug
refactor/ce-qui-est-refactorise
hotfix/probleme-critique
```

### Commits (Conventional Commits)
```
feat(stock): add stock reservation use case
fix(auth): resolve token refresh infinite loop
refactor(domain): extract Quantite value object
test(stock): add unit tests for reduireStock function
docs(architecture): update hexagonal README
style(ui): improve reservation form layout
perf(api): add request deduplication in http client
```

---

## 🚀 RÈGLES DEVOPS

- Variables d'environnement typées (`VITE_API_URL`, `VITE_APP_NAME`)
- Dockerfile multi-stage (build + serve avec nginx)
- Build optimisé (`npm run build` doit passer sans warning)
- `.env.example` documenté et maintenu à jour
- Logs structurés (pas de `console.log` en production)
- Health check endpoint documenté

---

## ✅ CHECKLIST DE VALIDATION — Après chaque tâche

Avant de passer à la tâche suivante, vérifier :

```
[ ] Le Domaine n'a aucun import React, fetch, ou Axios
[ ] Les Use Cases n'ont aucun import React
[ ] Les Composants n'ont aucune logique métier
[ ] Le câblage est uniquement dans dependencies.ts
[ ] Tous les types TypeScript sont explicites (pas de `any`)
[ ] Les entités sont immuables (readonly)
[ ] Les erreurs métier sont des classes nommées (pas de throw new Error('string'))
[ ] Le composant fait moins de 80 lignes
[ ] Aucun composant/hook/usecase/adaptateur ne dépasse 105 lignes (règle absolue)
[ ] Les fichiers *Data.ts et *Mock.ts ne dépassent pas 200 lignes (exception autorisée)
[ ] Le script bash de vérification retourne zéro violation
[ ] La règle max-lines est configurée dans ESLint
[ ] Le hook gère uniquement l'état UI (loading, error, success)
[ ] La branche Git est correctement nommée
[ ] Le commit respecte le format Conventional Commits
```

---

## 🎨 RÈGLES D'INTÉGRATION UI — URL / FIGMA / IMAGE

Quand une **URL de site**, un **lien Figma**, ou une **image de maquette** est fournie, tu DOIS :

### Étape 1 — Analyser le Design avant de coder
- Identifier la **palette de couleurs** exacte (hex, rgb)
- Identifier la **typographie** (font-family, font-size, font-weight, line-height)
- Identifier le **système d'espacement** (8px grid, 4px grid, etc.)
- Identifier les **composants récurrents** (boutons, cartes, badges, inputs)
- Identifier les **breakpoints** responsive (mobile, tablette, desktop)
- Identifier les **états interactifs** (hover, focus, active, disabled, loading)
- Identifier les **animations et transitions**

### Étape 2 — Créer le Design System avant les composants
```typescript
// shared/design/tokens.css (ou tokens.ts)
// ✅ OBLIGATOIRE : Extraire TOUS les tokens du design avant de coder

:root {
  /* Couleurs — extraites pixel perfect depuis le design */
  --color-primary: #1a73e8;
  --color-primary-hover: #1557b0;
  --color-secondary: #f8f9fa;
  --color-surface: #ffffff;
  --color-error: #d93025;
  --color-success: #1e8e3e;
  --color-text-primary: #202124;
  --color-text-secondary: #5f6368;
  --color-border: #dadce0;

  /* Typographie */
  --font-family: 'Inter', 'Roboto', system-ui, sans-serif;
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 2rem;      /* 32px */

  /* Espacement (grid de 8px) */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */

  /* Bordures */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Ombres */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.10);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
}
```

### Étape 3 — Règles de Reproduction Pixel Perfect
- ❌ **INTERDIT** : Utiliser des couleurs hardcodées (`color: #1a73e8` → utiliser `var(--color-primary)`)
- ❌ **INTERDIT** : Inventer un design différent de la maquette fournie
- ❌ **INTERDIT** : Utiliser des margins/paddings approximatifs
- ✅ **OBLIGATOIRE** : Reproduire les micro-interactions (hover, focus ring, transitions)
- ✅ **OBLIGATOIRE** : Respecter les hiérarchies typographiques exactes
- ✅ **OBLIGATOIRE** : Reproduire les icônes avec `lucide-react` ou `react-icons`
- ✅ **OBLIGATOIRE** : Les images placeholder utilisent `picsum.photos` ou `via.placeholder.com`
- ✅ **OBLIGATOIRE** : Le rendu final doit être **visuellement indiscernable** de la maquette

### Étape 4 — Qualité du Rendu Final
Avant de valider l'intégration, vérifier :
```
[ ] Les couleurs correspondent exactement à la maquette
[ ] La typographie (taille, poids, espacement) est fidèle
[ ] Les espacements sont cohérents (multiples de 4px ou 8px)
[ ] Les états hover/focus/active sont implémentés
[ ] Les icônes sont présentes et correctement dimensionnées
[ ] Les animations/transitions sont fluides (60fps)
[ ] Le design est magnifique sur tous les écrans
```

---

## 📱 RÈGLES FULL RESPONSIVE OBLIGATOIRES

### Breakpoints Standard
```css
/* mobile first — toujours commencer par le mobile */
/* sm  */ @media (min-width: 640px)  { ... }
/* md  */ @media (min-width: 768px)  { ... }
/* lg  */ @media (min-width: 1024px) { ... }
/* xl  */ @media (min-width: 1280px) { ... }
/* 2xl */ @media (min-width: 1536px) { ... }
```

### Règles de Layout Responsive
```typescript
// ✅ OBLIGATOIRE : Mobile First — coder d'abord pour mobile, ensuite agrandir
// ✅ OBLIGATOIRE : Utiliser CSS Grid et Flexbox, jamais de positions absolues pour le layout
// ✅ OBLIGATOIRE : Tester sur 320px (petit mobile) jusqu'à 1920px (grand écran)
// ✅ OBLIGATOIRE : Les images sont toujours fluid (max-width: 100%, height: auto)
// ✅ OBLIGATOIRE : La typographie s'adapte (clamp() ou classes responsive)
// ❌ INTERDIT : Largeurs fixes en px pour les conteneurs principaux
// ❌ INTERDIT : overflow hidden sans vérification sur mobile

/* Pattern de grille responsive typique */
.grid-responsive {
  display: grid;
  grid-template-columns: 1fr;                        /* mobile: 1 colonne */
  gap: var(--space-4);
}
@media (min-width: 768px) {
  .grid-responsive { grid-template-columns: repeat(2, 1fr); } /* tablette: 2 cols */
}
@media (min-width: 1024px) {
  .grid-responsive { grid-template-columns: repeat(3, 1fr); } /* desktop: 3 cols */
}
```

### Typographie Responsive
```css
/* ✅ clamp(min, preferred, max) — typographie fluide sans media queries */
h1 { font-size: clamp(1.5rem, 4vw, 3rem); }
h2 { font-size: clamp(1.25rem, 3vw, 2rem); }
p  { font-size: clamp(0.875rem, 2vw, 1rem); }
```

### Navigation Responsive
```
Desktop → Navbar horizontale avec tous les liens visibles
Tablette → Navbar condensée (certains liens cachés)
Mobile  → Hamburger menu avec drawer/sidebar animé
```

### Checklist Responsive avant validation
```
[ ] Testé à 320px (iPhone SE)
[ ] Testé à 375px (iPhone 14)
[ ] Testé à 768px (iPad)
[ ] Testé à 1024px (iPad Pro / petits laptops)
[ ] Testé à 1440px (desktop standard)
[ ] Les textes ne débordent pas
[ ] Les boutons sont assez grands sur mobile (min 44px de hauteur)
[ ] Les formulaires sont utilisables au doigt (inputs pas trop petits)
[ ] Les images ne sont pas déformées
[ ] Le menu mobile fonctionne correctement
```

---

## 🗄️ RÈGLES JSON SERVER — Mock Backend Professionnel

### Installation et Configuration Obligatoires

```bash
# Installation
npm install --save-dev json-server

# Script dans package.json
{
  "scripts": {
    "dev": "vite",
    "mock": "json-server --watch db.json --port 3001 --delay 300",
    "dev:full": "concurrently \"npm run mock\" \"npm run dev\""
  }
}
```

> **Le delay de 300ms est obligatoire** pour simuler la latence réseau réelle et forcer la gestion des états `loading`.

### Structure du fichier `db.json` — Modélisation Réaliste Obligatoire

Le fichier `db.json` doit modéliser des **données réalistes** comme si c'était une vraie base de données de production. Pas de données génériques comme `"name": "test"`.

```json
{
  "produits": [
    {
      "id": "prod-001",
      "nomProduit": "Tomate Roma",
      "description": "Tomates fraîches importées d'Italie, calibre A",
      "categorie": "Légumes",
      "quantiteDispo": 150,
      "quantiteMin": 20,
      "prixUnitaire": 1200,
      "unite": "kg",
      "fournisseurId": "four-001",
      "actif": true,
      "dateCreation": "2024-01-15T08:00:00Z",
      "dateMiseAJour": "2024-06-20T10:30:00Z"
    },
    {
      "id": "prod-002",
      "nomProduit": "Oignon Violet",
      "description": "Oignons violets de Casamance, qualité premium",
      "categorie": "Légumes",
      "quantiteDispo": 80,
      "quantiteMin": 15,
      "prixUnitaire": 800,
      "unite": "kg",
      "fournisseurId": "four-002",
      "actif": true,
      "dateCreation": "2024-02-10T09:00:00Z",
      "dateMiseAJour": "2024-06-19T14:00:00Z"
    }
  ],

  "reservations": [
    {
      "id": "res-001",
      "produitId": "prod-001",
      "nomProduit": "Tomate Roma",
      "quantiteReservee": 10,
      "clientId": "cli-001",
      "nomClient": "Boutique Diallo",
      "statut": "CONFIRMEE",
      "dateReservation": "2024-06-20T09:15:00Z",
      "dateExpiration": "2024-06-21T09:15:00Z",
      "notes": "Livraison urgente demandée"
    }
  ],

  "fournisseurs": [
    {
      "id": "four-001",
      "nom": "Agri-Export Italia SRL",
      "contact": "Marco Rossi",
      "telephone": "+39 02 1234 5678",
      "email": "marco@agriexport.it",
      "pays": "Italie",
      "actif": true
    },
    {
      "id": "four-002",
      "nom": "Ferme de Casamance",
      "contact": "Ibrahima Diatta",
      "telephone": "+221 77 456 7890",
      "email": "ibrahima@ferme-casamance.sn",
      "pays": "Sénégal",
      "actif": true
    }
  ],

  "mouvements_stock": [
    {
      "id": "mvt-001",
      "type": "ENTREE",
      "produitId": "prod-001",
      "quantite": 50,
      "motif": "Approvisionnement fournisseur",
      "operateur": "Moussa Ndiaye",
      "date": "2024-06-18T08:30:00Z"
    },
    {
      "id": "mvt-002",
      "type": "SORTIE",
      "produitId": "prod-001",
      "quantite": 10,
      "motif": "Réservation client res-001",
      "operateur": "Système",
      "date": "2024-06-20T09:15:00Z"
    }
  ],

  "utilisateurs": [
    {
      "id": "usr-001",
      "nom": "Ndiaye",
      "prenom": "Moussa",
      "email": "moussa.ndiaye@entreprise.sn",
      "role": "GESTIONNAIRE_STOCK",
      "actif": true,
      "dateCreation": "2024-01-01T00:00:00Z"
    },
    {
      "id": "usr-002",
      "nom": "Diallo",
      "prenom": "Aissatou",
      "email": "aissatou.diallo@entreprise.sn",
      "role": "ADMIN",
      "actif": true,
      "dateCreation": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Règles de Modélisation des Données JSON

```
✅ IDs sémantiques avec préfixe (prod-001, res-001, usr-001) — pas de simples 1, 2, 3
✅ Dates en ISO 8601 complet avec timezone (2024-06-20T10:30:00Z)
✅ Relations explicites via les IDs (produitId, fournisseurId, clientId)
✅ Statuts en majuscules (CONFIRMEE, EN_ATTENTE, ANNULEE)
✅ Noms réalistes et cohérents avec le contexte métier
✅ Champs métadonnées (dateCreation, dateMiseAJour, actif, operateur)
✅ Montants en centimes ou en valeur entière (pas de float pour les prix)
✅ Minimum 3-5 entrées par ressource pour tester les listes paginées
❌ Jamais de "test", "foo", "bar", "lorem", "example"
❌ Jamais d'IDs simples type 1, 2, 3 sans contexte
❌ Jamais de données incohérentes (une réservation qui pointe vers un produit inexistant)
```

### Adaptateur JSON Server dans l'Architecture Hexagonale

```typescript
// infrastructure/api/JsonServerStockRepository.ts
// ✅ Même interface que ApiStockRepository, mais pointe vers json-server
import { StockRepository } from '../../domain/port/StockRepository';
import { ProduitStock } from '../../domain/model/ProduitStock';
import { creerQuantite } from '../../domain/valueobject/Quantite';

export class JsonServerStockRepository implements StockRepository {
  constructor(private readonly baseUrl = 'http://localhost:3001') {}

  async trouverParNom(nom: string): Promise<ProduitStock | null> {
    const res = await fetch(`${this.baseUrl}/produits?nomProduit=${nom}`);
    const data = await res.json();
    if (!data.length) return null;
    return this.toDomain(data[0]);
  }

  async trouverTous(): Promise<ProduitStock[]> {
    const res = await fetch(`${this.baseUrl}/produits`);
    const data = await res.json();
    return data.map(this.toDomain);
  }

  async sauvegarder(produit: ProduitStock): Promise<void> {
    // Patch partiel pour mettre à jour la quantité
    const res = await fetch(`${this.baseUrl}/produits?nomProduit=${produit.nomProduit}`);
    const existing = await res.json();
    if (existing.length) {
      await fetch(`${this.baseUrl}/produits/${existing[0].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantiteDispo: produit.quantiteDispo.valeur,
          dateMiseAJour: new Date().toISOString(),
        }),
      });
    }
  }

  private toDomain(data: any): ProduitStock {
    return {
      nomProduit: data.nomProduit,
      quantiteDispo: creerQuantite(data.quantiteDispo),
    };
  }
}
```

### Câblage selon l'environnement

```typescript
// infrastructure/config/dependencies.ts
// ✅ Basculer entre mock et production via variable d'environnement
const isDevMock = import.meta.env.VITE_USE_MOCK === 'true';

const stockRepository = isDevMock
  ? new JsonServerStockRepository('http://localhost:3001')  // ← Mock JSON Server
  : new ApiStockRepository(httpClient);                     // ← Vrai backend Java

export const reserverStock = createReserverStockUseCase(stockRepository);
export const listerStocks  = createListerStocksUseCase(stockRepository);
```

```env
# .env.development
VITE_USE_MOCK=true
VITE_API_URL=http://localhost:3001

# .env.production
VITE_USE_MOCK=false
VITE_API_URL=https://api.mon-domaine.com
```

### Checklist JSON Server avant validation

```
[ ] json-server est installé en devDependency (pas en dependency)
[ ] Le script "mock" est dans package.json avec --delay 300
[ ] db.json est à la racine du projet
[ ] Les IDs sont préfixés et sémantiques (prod-001, res-001)
[ ] Les dates sont en ISO 8601 avec timezone
[ ] Les relations entre ressources sont cohérentes
[ ] Minimum 5 entrées par ressource principale
[ ] Les données sont réalistes (vrais noms, vrais montants, vrais contextes)
[ ] L'adaptateur JsonServer implémente le même Port que l'adaptateur production
[ ] Le basculement mock/prod se fait via une variable d'environnement
[ ] db.json est dans .gitignore si données sensibles, sinon commité avec le code
```

---

## 🎯 OBJECTIF FINAL

Tout code produit par ce skill doit être :

| Qualité | Définition |
|---|---|
| **Scalable** | Ajouter une feature ne casse rien d'existant |
| **Maintenable** | Un nouveau développeur comprend en 5 minutes |
| **Modulaire** | Chaque dossier peut évoluer indépendamment |
| **Sécurisé** | Aucune donnée sensible exposée |
| **Testable** | Chaque couche testable en isolation |
| **Performant** | Zéro re-render inutile, lazy loading partout |
| **Production-Ready** | Docker, env vars, build optimisé |
| **Enterprise-Grade** | Lisible et professionnel après 5 ans d'évolution |
| **Pixel Perfect** | Reproduction fidèle et magnifique de tout design fourni |
| **Full Responsive** | Parfait de 320px à 1920px, mobile first |
| **Mock-Ready** | JSON Server démarrable en une commande avec données réalistes |

---

## ⚡ RÈGLES DE PERFORMANCE AVANCÉE — OBLIGATOIRES

La performance n'est pas optionnelle. Un rendu inutile = une mauvaise UX.
Tu DOIS optimiser à chaque niveau : rendu, réseau, assets, mémoire.

### 🎯 Métriques Cibles (Core Web Vitals)

| Métrique | Seuil Cible | Définition |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5s | Le contenu principal est visible |
| **FID** (First Input Delay) | < 100ms | Le clic du premier bouton est réactif |
| **CLS** (Cumulative Layout Shift) | < 0.1 | La page ne saute pas pendant le chargement |
| **TTI** (Time to Interactive) | < 3.5s | La page est utilisable |
| **FCP** (First Contentful Paint) | < 1.8s | Quelque chose est visible à l'écran |

---

### ⚙️ Performance de Rendu React

#### 1. Règle Anti-Re-render : Ne re-rendre que ce qui change

```typescript
// ❌ MAUVAIS : Le parent re-rend → tous les enfants re-rendent même si leurs props n'ont pas changé
function StockPage() {
  const [filtre, setFiltre] = useState('');
  return (
    <div>
      <FiltreInput onChange={setFiltre} />
      <ListeProduits />       {/* Re-rend à chaque frappe dans le filtre ! */}
      <StatistiquesPanel />   {/* Re-rend inutilement à chaque frappe ! */}
    </div>
  );
}

// ✅ BON : Mémoïser les composants lourds qui ne dépendent pas du filtre
const ListeProduits = React.memo(function ListeProduits() { ... });
const StatistiquesPanel = React.memo(function StatistiquesPanel() { ... });
```

#### 2. `useMemo` — Pour les calculs coûteux
```typescript
// ❌ MAUVAIS : Recalcule à chaque rendu même si produits n'a pas changé
const produitsEnRupture = produits.filter(p => p.quantiteDispo.valeur === 0);

// ✅ BON : Recalcule SEULEMENT si `produits` change
const produitsEnRupture = useMemo(
  () => produits.filter(p => p.quantiteDispo.valeur === 0),
  [produits]
);
```

#### 3. `useCallback` — Pour les fonctions passées en props
```typescript
// ❌ MAUVAIS : Nouvelle référence de fonction à chaque rendu → les enfants re-rendent
function StockPage() {
  const handleReserver = (nom: string) => reserverStock({ nomProduit: nom, quantite: 1 });
  return <ProduitCard onReserver={handleReserver} />;
}

// ✅ BON : Référence stable → React.memo sur ProduitCard fonctionne vraiment
function StockPage() {
  const handleReserver = useCallback(
    (nom: string) => reserverStock({ nomProduit: nom, quantite: 1 }),
    [] // Dépendances stables → fonction créée une seule fois
  );
  return <ProduitCard onReserver={handleReserver} />;
}
```

#### 4. État — Colocaliser au plus bas possible
```typescript
// ❌ MAUVAIS : Le state du modal dans le parent → re-rend tout le parent à chaque ouverture
function StockPage() {
  const [isModalOpen, setIsModalOpen] = useState(false); // Ici c'est trop haut
  return (
    <div>
      <ListeProduits />      {/* Re-rend pour rien quand le modal s'ouvre */}
      <StatistiquesPanel />  {/* Re-rend pour rien quand le modal s'ouvre */}
      <Modal isOpen={isModalOpen} />
    </div>
  );
}

// ✅ BON : Le state du modal vit dans le composant qui en a besoin
function BoutonAvecModal() {
  const [isOpen, setIsOpen] = useState(false); // State colocalisé
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Ouvrir</button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
```

---

### 🌐 Performance Réseau

#### 1. TanStack Query — Cache Serveur Obligatoire
```typescript
// ✅ OBLIGATOIRE pour toutes les données serveur
// Remplace complètement useEffect + fetch + useState(loading/error/data)

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Lecture avec cache automatique
function useProduits() {
  return useQuery({
    queryKey: ['produits'],           // Clé de cache unique
    queryFn: () => listerStocks(),    // Use Case du domaine
    staleTime: 1000 * 60 * 5,        // Données fraîches pendant 5 minutes
    gcTime: 1000 * 60 * 10,          // Garder en cache 10 minutes
    retry: 2,                         // Retry automatique en cas d'erreur réseau
  });
}

// Écriture avec invalidation du cache
function useReserver() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reserverStock,
    onSuccess: () => {
      // Invalider le cache → re-fetch automatique de la liste
      queryClient.invalidateQueries({ queryKey: ['produits'] });
    },
  });
}
```

#### 2. Debounce — Pour les recherches en temps réel
```typescript
// ❌ MAUVAIS : Une requête HTTP à chaque frappe au clavier
function Recherche() {
  const [terme, setTerme] = useState('');
  const { data } = useQuery({ queryKey: ['produits', terme], queryFn: () => chercher(terme) });
  return <input onChange={e => setTerme(e.target.value)} />;
}

// ✅ BON : Attendre 300ms après la dernière frappe avant de chercher
function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

function Recherche() {
  const [terme, setTerme] = useState('');
  const termeDebounce = useDebounce(terme, 300); // ← Seulement 1 requête après 300ms
  const { data } = useQuery({ queryKey: ['produits', termeDebounce], queryFn: () => chercher(termeDebounce) });
}
```

#### 3. Pagination & Virtualisation — Pour les longues listes
```typescript
// ❌ MAUVAIS : Charger et rendre 10 000 lignes en DOM → page bloquée
const { data: tousLesProduits } = useQuery({ queryFn: listerStocks }); // 10 000 items !

// ✅ BON OPTION 1 : Pagination côté serveur
const { data } = useQuery({
  queryKey: ['produits', { page, limit }],
  queryFn: () => listerStocksPage(page, limit), // Seulement 20 items par page
  keepPreviousData: true, // Pas de flash lors du changement de page
});

// ✅ BON OPTION 2 : Virtualisation pour les très longues listes (react-virtual)
import { useVirtualizer } from '@tanstack/react-virtual';

function ListeVirtuelle({ items }: { items: ProduitStock[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Hauteur estimée d'une ligne
  });
  // Seuls les items visibles à l'écran sont dans le DOM
}
```

---

### 📦 Performance des Assets & Bundle

#### 1. Code Splitting — Lazy Loading Obligatoire
```typescript
// ❌ MAUVAIS : Toutes les pages dans le bundle principal → chargement lent
import { StockPage } from './ui/pages/StockPage';
import { DashboardPage } from './ui/pages/DashboardPage';
import { RapportPage } from './ui/pages/RapportPage';

// ✅ OBLIGATOIRE : Chaque page chargée à la demande
const StockPage     = lazy(() => import('./ui/pages/StockPage'));
const DashboardPage = lazy(() => import('./ui/pages/DashboardPage'));
const RapportPage   = lazy(() => import('./ui/pages/RapportPage'));

// Wrapper obligatoire dans le router
<Suspense fallback={<PageSkeleton />}>
  <Routes>
    <Route path="/stock"     element={<StockPage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/rapports"  element={<RapportPage />} />
  </Routes>
</Suspense>
```

#### 2. Skeleton Loading — Jamais de spinner nu
```typescript
// ❌ MAUVAIS : Spinner générique → layout shift quand le contenu arrive
if (loading) return <Spinner />;

// ✅ BON : Skeleton qui occupe la place exacte du contenu final → zéro CLS
if (loading) return <ProduitListeSkeleton count={5} />;

function ProduitListeSkeleton({ count }: { count: number }) {
  return (
    <div className="grid-responsive">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton" style={{ height: '24px', width: '60%' }} />
          <div className="skeleton" style={{ height: '16px', width: '40%', marginTop: '8px' }} />
        </div>
      ))}
    </div>
  );
}
```

```css
/* Animation skeleton universelle */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

#### 3. Optimisation des Images
```typescript
// ❌ MAUVAIS : Image non optimisée, taille fixe, pas de lazy loading
<img src="/produit.jpg" width="800" height="600" />

// ✅ BON : Lazy loading natif + taille responsive + format moderne
<img
  src="/produit.webp"                   // Format WebP (30-40% plus léger que JPEG)
  srcSet="/produit-400.webp 400w, /produit-800.webp 800w"
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"                        // Chargé seulement quand visible
  decoding="async"                      // Décodage non bloquant
  alt="Description précise du produit"  // Accessibilité + SEO
  width={400}                           // Évite le CLS
  height={300}
/>
```

---

### 🧠 Gestion Mémoire & Fuites

#### Nettoyage des Effets
```typescript
// ❌ MAUVAIS : Fuite mémoire → mise à jour d'un composant démonté
useEffect(() => {
  fetchProduits().then(data => setData(data)); // Si le composant est démonté → erreur
}, []);

// ✅ BON : AbortController pour annuler les requêtes en vol
useEffect(() => {
  const controller = new AbortController();
  fetchProduits({ signal: controller.signal })
    .then(data => setData(data))
    .catch(e => { if (e.name !== 'AbortError') setError(e.message); });
  return () => controller.abort(); // Cleanup → annule la requête si le composant démonte
}, []);
```

#### Nettoyage des Subscriptions et Timers
```typescript
// ✅ BON : Toujours nettoyer les intervals, timeouts, et event listeners
useEffect(() => {
  const interval = setInterval(rafraichirDonnees, 30_000);
  window.addEventListener('online', rafraichirDonnees);
  return () => {
    clearInterval(interval);
    window.removeEventListener('online', rafraichirDonnees);
  };
}, []);
```

---

### 📊 Analyse et Monitoring du Bundle

#### Vérifier la Taille du Bundle
```bash
# Analyser la taille de chaque module dans le bundle
npm install --save-dev rollup-plugin-visualizer

# Dans vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';
export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true, gzipSize: true }) // Ouvre un rapport HTML après le build
  ]
});

# Lancer l'analyse
npm run build
```

#### Règles de Taille de Bundle
```
✅ Bundle JS initial (gzippé) < 150KB
✅ Chaque page lazy (gzippé) < 50KB
✅ Librairies vendor séparées du code applicatif (chunk splitting)
❌ Jamais importer une librairie entière pour une seule fonction
   → import { format } from 'date-fns'        (✅ tree-shakeable)
   → import moment from 'moment'               (❌ 230KB pour une date !)
```

---

### ✅ Checklist Performance Complète

```
RENDU
[ ] React.memo sur les composants lourds qui reçoivent des props stables
[ ] useMemo pour les calculs coûteux (filtres, tris, agrégations)
[ ] useCallback pour les fonctions passées en props
[ ] State colocalisé au plus bas composant possible
[ ] Zéro re-render inutile vérifié avec React DevTools Profiler

RÉSEAU
[ ] TanStack Query utilisé pour toutes les données serveur
[ ] staleTime configuré pour éviter les re-fetch inutiles
[ ] Debounce sur toutes les recherches en temps réel (300ms)
[ ] Pagination côté serveur pour les listes > 50 items
[ ] Virtualisation pour les listes > 200 items

ASSETS & BUNDLE
[ ] Toutes les pages chargées en lazy (React.lazy + Suspense)
[ ] Skeleton loading à la place des spinners (zéro CLS)
[ ] Images en WebP avec lazy loading natif et srcSet
[ ] Bundle analysé avec rollup-plugin-visualizer
[ ] Bundle JS initial < 150KB gzippé
[ ] Pas de librairie lourde importée entièrement (moment.js, lodash entier)

MÉMOIRE
[ ] AbortController sur tous les fetch dans les useEffect
[ ] Cleanup de tous les setInterval, setTimeout et event listeners
[ ] Pas de useState avec des objets très gros (> 1000 items)

WEB VITALS
[ ] LCP < 2.5s mesuré avec Lighthouse
[ ] CLS < 0.1 (skeletons en place, dimensions d'images définies)
[ ] FID < 100ms (pas de calcul lourd sur le thread principal)
[ ] Score Lighthouse Performance > 90
```

---

## ♿ RÈGLES D'ACCESSIBILITÉ (A11Y) — OBLIGATOIRES

L'accessibilité n'est pas optionnelle. Une app inaccessible est une app qui exclut.

### Règles Fondamentales

```tsx
// ❌ MAUVAIS : Pas de sémantique, pas d'accessibilité
<div onClick={handleReserver}>Réserver</div>

// ✅ BON : Élément interactif sémantique, navigable au clavier
<button
  type="button"
  onClick={handleReserver}
  disabled={loading}
  aria-busy={loading}
  aria-label="Réserver le produit Tomate Roma"
>
  {loading ? 'Réservation...' : 'Réserver'}
</button>
```

### Règles ARIA et Structure

```tsx
// ✅ Formulaire accessible
<form aria-label="Formulaire de réservation de stock" onSubmit={handleSubmit}>
  <label htmlFor="nomProduit">Nom du produit *</label>
  <input
    id="nomProduit"
    name="nomProduit"
    type="text"
    required
    aria-required="true"
    aria-invalid={!!errors.nomProduit}
    aria-describedby={errors.nomProduit ? 'error-nom' : undefined}
  />
  {errors.nomProduit && (
    <span id="error-nom" role="alert" aria-live="polite">
      {errors.nomProduit}
    </span>
  )}
</form>

// ✅ Liste de produits accessible
<section aria-label="Liste des produits en stock">
  <h2>Produits disponibles ({produits.length})</h2>
  <ul role="list">
    {produits.map(p => (
      <li key={p.nomProduit} role="listitem">
        <ProduitCard produit={p} />
      </li>
    ))}
  </ul>
</section>

// ✅ Modal accessible
<dialog
  ref={dialogRef}
  aria-modal="true"
  aria-labelledby="modal-titre"
  aria-describedby="modal-desc"
>
  <h2 id="modal-titre">Confirmer la réservation</h2>
  <p id="modal-desc">Vous allez réserver 10 kg de Tomate Roma.</p>
  <button onClick={onClose} aria-label="Fermer la modal">✕</button>
</dialog>
```

### Checklist Accessibilité

```
[ ] Tous les éléments interactifs sont des <button> ou <a> (pas de <div onClick>)
[ ] Tous les inputs ont un <label> associé (htmlFor)
[ ] Les erreurs de formulaire utilisent role="alert" et aria-live="polite"
[ ] Les images ont un alt descriptif (ou alt="" si décoratives)
[ ] Le focus visible est toujours apparent (pas de outline: none sans remplacement)
[ ] La navigation au clavier fonctionne sans souris (Tab, Shift+Tab, Enter, Escape)
[ ] Le contraste couleur est ≥ 4.5:1 pour le texte normal (WCAG AA)
[ ] Les modals piègent le focus (focus trap)
[ ] Score Lighthouse Accessibility > 95
```

---

## 🔍 RÈGLES SEO — OBLIGATOIRES

```tsx
// ✅ Titre et meta description sur chaque page (avec react-helmet-async)
import { Helmet } from 'react-helmet-async';

function StockPage() {
  return (
    <>
      <Helmet>
        <title>Gestion des Stocks | Mon Application</title>
        <meta name="description" content="Consultez et gérez vos stocks de produits en temps réel." />
        <meta property="og:title" content="Gestion des Stocks" />
        <meta property="og:description" content="Gérez vos stocks efficacement." />
      </Helmet>
      {/* Contenu de la page */}
    </>
  );
}

// ✅ Structure sémantique de la page
<main>
  <header>
    <h1>Gestion des Stocks</h1>  {/* Un seul h1 par page */}
  </header>
  <section aria-label="Statistiques">
    <h2>Vue d'ensemble</h2>
    {/* Contenu */}
  </section>
  <section aria-label="Liste des produits">
    <h2>Produits</h2>
    {/* Liste */}
  </section>
</main>
```

---

## 🛡️ GESTION D'ERREURS — PATTERN OBLIGATOIRE

### Error Boundary — Filet de Sécurité Global

```tsx
// shared/components/ErrorBoundary.tsx
// ✅ Intercepte toutes les erreurs non catchées dans les composants enfants
import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // Envoyer à un service de monitoring (Sentry, etc.)
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div role="alert" aria-live="assertive" className="error-page">
          <h2>Une erreur inattendue s'est produite</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Utilisation dans le Router
<ErrorBoundary fallback={<PageErreur />}>
  <Suspense fallback={<PageSkeleton />}>
    <Routes>...</Routes>
  </Suspense>
</ErrorBoundary>
```

### Gestion d'Erreur dans les Hooks

```typescript
// ✅ Pattern unifié de gestion d'erreur dans tous les hooks
type EtatRequete<T> =
  | { statut: 'IDLE' }
  | { statut: 'CHARGEMENT' }
  | { statut: 'SUCCES'; donnees: T }
  | { statut: 'ERREUR'; message: string; code?: string };

function useReserverStock() {
  const [etat, setEtat] = useState<EtatRequete<void>>({ statut: 'IDLE' });

  const executer = async (cmd: ReserverStockCommand) => {
    setEtat({ statut: 'CHARGEMENT' });
    try {
      await reserverStock(cmd);
      setEtat({ statut: 'SUCCES', donnees: undefined });
    } catch (e: unknown) {
      // Typage strict de l'erreur
      const message = e instanceof Error ? e.message : 'Erreur inconnue';
      const code = e instanceof StockInsuffisantError ? 'STOCK_INSUFFISANT' : 'ERREUR_GENERIQUE';
      setEtat({ statut: 'ERREUR', message, code });
    }
  };

  return { etat, executer };
}

// Dans le composant
const { etat, executer } = useReserverStock();
{etat.statut === 'CHARGEMENT' && <Spinner />}
{etat.statut === 'ERREUR' && <AlerteErreur message={etat.message} />}
{etat.statut === 'SUCCES' && <AlerteSucces message="Réservation confirmée !" />}
```

---

## 🧪 STRATÉGIE DE TESTS COMPLÈTE

### Pyramide de Tests Obligatoire

```
         /\
        /E2E\        ← Cypress (flux complets critiques seulement)
       /------\
      /Intégra-\     ← Testing Library (composants avec hooks réels)
     /  tion    \
    /------------\
   /   Unitaires  \  ← Jest (Domaine, Use Cases, fonctions pures)
  /______________\
```

### Tests Unitaires du Domaine (Les plus importants)

```typescript
// domain/model/ProduitStock.test.ts
// ✅ Tests purs sans aucun mock — la logique métier testée en isolation parfaite
import { reduireStock, ajouterStock } from './ProduitStock';
import { creerQuantite } from '../valueobject/Quantite';
import { StockInsuffisantError } from '../exception/StockExceptions';

describe('ProduitStock — Règles Métier', () => {
  const produitDeBase = {
    nomProduit: 'Tomate Roma',
    quantiteDispo: creerQuantite(100),
  };

  describe('reduireStock', () => {
    it('devrait réduire le stock quand la quantité est disponible', () => {
      const resultat = reduireStock(produitDeBase, creerQuantite(30));
      expect(resultat.quantiteDispo.valeur).toBe(70);
    });

    it('ne devrait pas modifier le produit original (immuabilité)', () => {
      reduireStock(produitDeBase, creerQuantite(10));
      expect(produitDeBase.quantiteDispo.valeur).toBe(100); // Inchangé !
    });

    it('devrait lever StockInsuffisantError si stock insuffisant', () => {
      expect(() => reduireStock(produitDeBase, creerQuantite(150)))
        .toThrow(StockInsuffisantError);
    });

    it('devrait permettre de réduire exactement à 0', () => {
      const resultat = reduireStock(produitDeBase, creerQuantite(100));
      expect(resultat.quantiteDispo.valeur).toBe(0);
    });
  });
});
```

### Tests des Use Cases (Avec InMemoryRepository)

```typescript
// application/usecase/ReserverStockUseCase.test.ts
// ✅ Tests des Use Cases avec un faux repository — zéro fetch, zéro réseau
import { createReserverStockUseCase } from './ReserverStockUseCase';
import { InMemoryStockRepository } from '../../infrastructure/local/InMemoryStockRepository';
import { creerQuantite } from '../../domain/valueobject/Quantite';

describe('ReserverStockUseCase', () => {
  let repo: InMemoryStockRepository;
  let reserverStock: ReturnType<typeof createReserverStockUseCase>;

  beforeEach(() => {
    repo = new InMemoryStockRepository();
    reserverStock = createReserverStockUseCase(repo);
  });

  it('devrait réduire le stock du produit après réservation', async () => {
    // Arrange
    await repo.sauvegarder({ nomProduit: 'Tomate', quantiteDispo: creerQuantite(50) });

    // Act
    await reserverStock({ nomProduit: 'Tomate', quantite: 10 });

    // Assert
    const produitMisAJour = await repo.trouverParNom('Tomate');
    expect(produitMisAJour?.quantiteDispo.valeur).toBe(40);
  });

  it('devrait lever une erreur si le produit est introuvable', async () => {
    await expect(reserverStock({ nomProduit: 'Inexistant', quantite: 5 }))
      .rejects.toThrow('Produit introuvable');
  });
});
```

### Tests des Composants (Testing Library)

```typescript
// ui/components/ReservationForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReservationForm } from './ReservationForm';

// Mock du hook pour isoler le composant
jest.mock('../hooks/useReserverStock', () => ({
  useReserverStock: jest.fn(),
}));

describe('ReservationForm', () => {
  it('devrait afficher un message de succès après soumission', async () => {
    const mockExecuter = jest.fn().mockResolvedValue(undefined);
    (useReserverStock as jest.Mock).mockReturnValue({
      executer: mockExecuter,
      loading: false,
      error: null,
      success: true,
    });

    render(<ReservationForm />);

    fireEvent.change(screen.getByLabelText(/nom du produit/i), {
      target: { value: 'Tomate Roma' },
    });
    fireEvent.change(screen.getByLabelText(/quantité/i), {
      target: { value: '10' },
    });
    fireEvent.click(screen.getByRole('button', { name: /réserver/i }));

    await waitFor(() => {
      expect(screen.getByText(/réservation réussie/i)).toBeInTheDocument();
    });
  });
});
```

---

## 🌍 INTERNATIONALISATION (i18n) — PATTERN PRÊT

```typescript
// core/i18n/index.ts — Structure pour multi-langue si nécessaire
// ✅ Préparer l'i18n dès le départ, même si une seule langue pour l'instant

export const fr = {
  stock: {
    titre: 'Gestion des Stocks',
    reservation: {
      bouton: 'Réserver',
      succes: 'Réservation confirmée !',
      erreur: {
        insuffisant: 'Stock insuffisant pour ce produit.',
        introuvable: 'Ce produit n\'existe pas.',
      },
    },
  },
};

// Utilisation simple sans librairie (pour commencer)
function useTextes() {
  return fr; // Plus tard : retourner la bonne langue selon l'utilisateur
}
```

---

## 🚀 CONFIGURATION VITE OPTIMISÉE

```typescript
// vite.config.ts — Configuration de production optimisée
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: false, gzipSize: true, filename: 'dist/stats.html' }),
  ],
  resolve: {
    alias: {
      '@domain':     '/src/domain',
      '@app':        '/src/application',
      '@infra':      '/src/infrastructure',
      '@ui':         '/src/ui',
      '@shared':     '/src/shared',
      '@core':       '/src/core',
    },
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparer les grosses librairies du code applicatif
          'vendor-react':  ['react', 'react-dom', 'react-router-dom'],
          'vendor-query':  ['@tanstack/react-query'],
          'vendor-ui':     ['lucide-react'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // json-server en dev
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

---

## 🎯 CHECKLIST FINALE DE PRODUCTION

Avant chaque mise en production, vérifier TOUS ces points :

```
ARCHITECTURE
[ ] Domaine sans aucun import React, fetch, ou technologie externe
[ ] Use Cases sans aucun import React
[ ] Infrastructure isolée derrière les Ports du Domaine
[ ] Câblage uniquement dans dependencies.ts
[ ] Pas de logique métier dans les composants ou les hooks

QUALITÉ DU CODE
[ ] TypeScript strict (pas de `any`, pas de `as unknown as ...`)
[ ] Pas de console.log en production
[ ] ESLint 0 erreurs, 0 warnings
[ ] Tous les composants < 80 lignes
[ ] Tous les hooks < 80 lignes
[ ] AUCUN fichier généré ne dépasse 100 lignes (règle absolue)
[ ] La règle ESLint max-lines: 100 est configurée et active
[ ] Nommage cohérent et explicite partout

DESIGN & UX
[ ] Reproduit fidèlement la maquette fournie
[ ] Full responsive de 320px à 1920px
[ ] Tous les états gérés (loading, error, empty, success)
[ ] Skeleton loading à la place des spinners nus
[ ] Micro-interactions et transitions fluides

PERFORMANCE
[ ] Score Lighthouse Performance > 90
[ ] Score Lighthouse Accessibility > 95
[ ] Bundle JS initial < 150KB gzippé
[ ] Toutes les pages en lazy loading
[ ] TanStack Query pour toutes les données serveur

SÉCURITÉ
[ ] Aucun secret dans le code source
[ ] Variables d'environnement via .env
[ ] Validation Zod sur tous les formulaires
[ ] Routes protégées selon les rôles

TESTS
[ ] Tests unitaires du Domaine : couverture > 90%
[ ] Tests des Use Cases avec InMemoryRepository
[ ] Tests des composants critiques avec Testing Library

GIT & DEVOPS
[ ] Toutes les branches nommées selon la convention
[ ] Tous les commits au format Conventional Commits
[ ] .env.example à jour et documenté
[ ] README.md du projet à jour avec les instructions de démarrage
[ ] npm run dev:full démarre le projet complet (Vite + json-server)
```

---

## 📚 STACK TECHNIQUE RECOMMANDÉE

| Besoin | Outil Recommandé | Raison |
|---|---|---|
| Framework UI | React 18+ avec TypeScript | Standard industrie |
| Build Tool | Vite | Ultra rapide, HMR instantané |
| Routing | React Router v6 | Standard, lazy-friendly |
| State Serveur | TanStack Query | Cache, retry, sync automatique |
| **State Global UI** | **Redux Toolkit** | État UI partagé complexe (auth, thème, notifications) |
| Formulaires | React Hook Form + Zod | Performant, typé, validé |
| Icônes | Lucide React | Léger, tree-shakeable |
| HTTP | Axios | Interceptors, annulation facile |
| Tests | Vitest + Testing Library | Rapide, compatible Vite |
| E2E | Cypress | Standard, fiable |
| Animations | CSS Transitions + Framer Motion (si complexe) | Performant |
| Mock Backend | json-server | Simple, RESTful, zéro config |
| Analyse Bundle | rollup-plugin-visualizer | Intégré à Vite |
| Monitoring | Sentry | Capture erreurs production en temps réel |

---

## 🗂️ RÈGLES DE STATE MANAGEMENT GLOBAL (Redux Toolkit)

> TanStack Query gère l'état **serveur** (données distantes).
> Redux Toolkit gère l'état **UI global** (données locales partagées entre plusieurs features).

### Quand utiliser Redux Toolkit ?

```
✅ Utiliser Redux Toolkit pour :
   - L'authentification (utilisateur connecté, rôles, token)
   - Les préférences UI globales (thème dark/light, langue)
   - Les notifications globales (toasts, alertes système)
   - Le panier d'achat (état partagé entre plusieurs pages)

❌ NE PAS utiliser Redux pour :
   - Les données serveur → TanStack Query
   - L'état local d'un seul composant → useState
   - L'état partagé entre 2-3 composants voisins → Context API
```

### Structure d'un Slice Redux dans l'Architecture Hexagonale

```typescript
// core/store/authSlice.ts — < 80 lignes
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Le slice appartient à core/ car c'est une préoccupation globale
interface AuthState {
  utilisateur: { id: string; nom: string; role: string } | null;
  token: string | null;
  estConnecte: boolean;
}

const initialState: AuthState = {
  utilisateur: null,
  token: null,
  estConnecte: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    connexionReussie: (state, action: PayloadAction<AuthState>) => {
      state.utilisateur = action.payload.utilisateur;
      state.token = action.payload.token;
      state.estConnecte = true;
    },
    deconnexion: (state) => {
      state.utilisateur = null;
      state.token = null;
      state.estConnecte = false;
    },
  },
});

export const { connexionReussie, deconnexion } = authSlice.actions;
```

```typescript
// core/store/index.ts — < 50 lignes
import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './authSlice';
import { uiSlice } from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    // NE PAS mettre les données serveur ici → c'est le rôle de TanStack Query
  },
});

// Types dérivés automatiquement
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// core/store/hooks.ts — < 20 lignes
// Hooks typés pour éviter de répéter les types partout
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector);
```

---

## 📋 RÈGLES FORMULAIRES AVANCÉS (React Hook Form + Zod)

### Pattern Obligatoire : Zod → Inférence TypeScript → Formulaire

```typescript
// Étape 1 : Définir le schéma Zod (source de vérité unique)
// ui/schemas/reservationSchema.ts — < 30 lignes
import { z } from 'zod';

export const reservationSchema = z.object({
  nomProduit: z.string()
    .min(2, 'Le nom doit faire au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  quantite: z.number()
    .int('La quantité doit être un nombre entier')
    .positive('La quantité doit être positive')
    .max(10_000, 'Quantité trop grande'),
  notes: z.string().max(500).optional(),
});

// Inférer le type TypeScript depuis le schéma → pas de duplication !
export type ReservationFormData = z.infer<typeof reservationSchema>;
```

```typescript
// Étape 2 : Le formulaire connecté — < 80 lignes
// ui/components/ReservationForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reservationSchema, ReservationFormData } from '../schemas/reservationSchema';

export function ReservationForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<ReservationFormData>({
      resolver: zodResolver(reservationSchema), // Validation Zod automatique
      defaultValues: { quantite: 1 },
    });

  const onSubmit = async (data: ReservationFormData) => {
    // data est garanti valide par Zod avant d'arriver ici
    await reserverStock({ nomProduit: data.nomProduit, quantite: data.quantite });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="nomProduit">Produit *</label>
        <input id="nomProduit" {...register('nomProduit')} aria-invalid={!!errors.nomProduit} />
        {errors.nomProduit && <span role="alert">{errors.nomProduit.message}</span>}
      </div>
      <div>
        <label htmlFor="quantite">Quantité *</label>
        <input id="quantite" type="number" {...register('quantite', { valueAsNumber: true })} />
        {errors.quantite && <span role="alert">{errors.quantite.message}</span>}
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Réservation...' : 'Réserver'}
      </button>
    </form>
  );
}
```

---

## 🔄 CI/CD GITHUB ACTIONS — OBLIGATOIRE

> Tout projet doit avoir un pipeline CI/CD qui vérifie automatiquement la qualité avant tout merge.

```yaml
# .github/workflows/ci.yml — Pipeline de qualité automatique
name: CI — Quality Gate

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality:
    name: Quality Gate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: TypeScript check
        run: npx tsc --noEmit

      - name: ESLint (0 erreurs autorisées)
        run: npm run lint -- --max-warnings 0

      - name: Unit tests
        run: npm run test:unit -- --coverage

      - name: Coverage check (> 80%)
        run: npm run test:unit -- --coverage --coverageThreshold='{"global":{"lines":80}}'

      - name: Build check
        run: npm run build

      - name: Bundle size check
        run: |
          BUILD_SIZE=$(du -sk dist/assets/*.js | awk '{sum+=$1} END {print sum}')
          echo "Bundle size: ${BUILD_SIZE}KB"
          if [ $BUILD_SIZE -gt 150 ]; then echo "❌ Bundle trop lourd!" && exit 1; fi
```

```yaml
# .github/workflows/cd.yml — Déploiement automatique
name: CD — Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }

      - run: npm ci
      - run: npm run build

      - name: Deploy to production
        env:
          VITE_API_URL: ${{ secrets.API_URL }}
        run: echo "Déployer dist/ vers ton hébergeur (Vercel, Netlify, S3...)"
```

---

## 📊 MONITORING ET LOGGING PRODUCTION

```typescript
// core/monitoring/index.ts — < 50 lignes
// Centraliser le monitoring pour pouvoir changer de provider facilement

interface MonitoringService {
  captureErreur(error: Error, contexte?: Record<string, unknown>): void;
  logInfo(message: string, data?: Record<string, unknown>): void;
  logPerformance(name: string, durationMs: number): void;
}

// Implémentation Sentry (production)
class SentryMonitoring implements MonitoringService {
  captureErreur(error: Error, contexte?: Record<string, unknown>) {
    // Sentry.captureException(error, { extra: contexte });
    console.error('[Sentry]', error.message, contexte);
  }
  logInfo(message: string, data?: Record<string, unknown>) {
    // Sentry.addBreadcrumb({ message, data });
    console.info('[Info]', message, data);
  }
  logPerformance(name: string, durationMs: number) {
    // Sentry.startTransaction({ name })...
    console.debug(`[Perf] ${name}: ${durationMs}ms`);
  }
}

// Implémentation Console (développement)
class ConsoleMonitoring implements MonitoringService {
  captureErreur(error: Error, contexte?: Record<string, unknown>) {
    console.error('[DEV ERROR]', error, contexte);
  }
  logInfo(message: string, data?: Record<string, unknown>) {
    console.info('[DEV INFO]', message, data);
  }
  logPerformance(name: string, durationMs: number) {
    console.debug(`[DEV PERF] ${name}: ${durationMs}ms`);
  }
}

// Basculement automatique selon l'environnement
export const monitoring: MonitoringService =
  import.meta.env.PROD ? new SentryMonitoring() : new ConsoleMonitoring();
```

```typescript
// Intégration dans l'ErrorBoundary existant
componentDidCatch(error: Error, info: { componentStack: string }) {
  // ✅ Envoyer automatiquement les erreurs en production
  monitoring.captureErreur(error, { componentStack: info.componentStack });
}

// Intégration dans les hooks
const executer = async (cmd: ReserverStockCommand) => {
  const debut = performance.now();
  try {
    await reserverStock(cmd);
    monitoring.logPerformance('ReserverStock', performance.now() - debut);
  } catch (e: unknown) {
    if (e instanceof Error) monitoring.captureErreur(e, { cmd });
    throw e;
  }
};
```

---

## 🎯 SCORE DE PERFORMANCE FINAL — 10/10

| Dimension | Score | Couvert par |
|---|---|---|
| **Architecture Hexagonale** | ✅ 10/10 | Structure obligatoire, règle de dépendance, Ports & Adaptateurs |
| **Qualité du Code** | ✅ 10/10 | 100 lignes max, TypeScript strict, ESLint, nommage |
| **Performance React** | ✅ 10/10 | Core Web Vitals, memo, TanStack Query, lazy, skeleton |
| **Design Pixel Perfect** | ✅ 10/10 | Design System, tokens, micro-interactions, maquettes |
| **Full Responsive** | ✅ 10/10 | Mobile First, clamp(), breakpoints, checklist 320px→1920px |
| **Tests** | ✅ 10/10 | Pyramide complète, Domaine sans mock, InMemory, Testing Library |
| **Sécurité** | ✅ 10/10 | JWT, Zod, env vars, routes protégées, XSS |
| **State Management** | ✅ 10/10 | TanStack Query (serveur) + Redux Toolkit (UI global) |
| **Formulaires** | ✅ 10/10 | React Hook Form + Zod avec inférence TypeScript |
| **Accessibilité** | ✅ 10/10 | ARIA, focus, WCAG AA, checklist Lighthouse |
| **Mock Backend** | ✅ 10/10 | JSON Server avec données réalistes et basculement env |
| **CI/CD** | ✅ 10/10 | GitHub Actions : TypeScript + ESLint + Tests + Build + Bundle size |
| **Monitoring Production** | ✅ 10/10 | Sentry pattern, logging structuré, métriques de performance |
| **DevOps** | ✅ 10/10 | Docker, .env, Conventional Commits, Git workflow |

> **Ce Skill produit du code de niveau Senior Ingénieur / Tech Lead.
> Prêt pour la production. Prêt pour une équipe enterprise.**

---

## 🚦 SYSTÈME DE SUIVI D'ÉTAT DES FONCTIONNALITÉS — OBLIGATOIRE

> **Cette règle est critique pour la continuité entre agents IA.**
> Tout projet doit avoir un fichier `PROJECT_STATUS.md` à sa racine.
> N'importe quel agent IA qui arrive sur le projet DOIT lire ce fichier EN PREMIER.

### Les 3 Statuts

| Symbole | Statut | Signification |
|---|---|---|
| ✅ | **VERT — VALIDÉ** | Fonctionnalité testée, validée, ne pas toucher |
| 🟡 | **JAUNE — EN COURS** | Travail en cours, reprendre ici à la prochaine session |
| 🔴 | **ROUGE — BUG** | Bug identifié, description du problème + étapes de reproduction |

### Règles d'utilisation

```
✅ Marquer VERT uniquement après avoir testé la fonctionnalité manuellement ou avec un test automatique
🟡 Marquer JAUNE dès qu'on commence à travailler sur une fonctionnalité
🔴 Marquer ROUGE immédiatement dès qu'un bug est identifié, avec description précise
❌ INTERDIT : Modifier le code d'une section ✅ VERTE sans la repasser en 🟡 JAUNE
❌ INTERDIT : Commencer une nouvelle fonctionnalité si une 🔴 ROUGE existe
```

### Template du fichier `PROJECT_STATUS.md`

```markdown
# 🚦 État du Projet — [NOM DU PROJET]

> Dernière mise à jour : [DATE] par [Agent / Développeur]
> Règle : Lire ce fichier EN PREMIER avant de toucher au code.

---

## ✅ Fonctionnalités Validées (NE PAS TOUCHER)

| # | Fonctionnalité | Testé le | Méthode de test |
|---|---|---|---|
| 1 | ✅ Structure de dossiers Hexagonale | 2024-06-20 | Vérification manuelle |
| 2 | ✅ Domaine — Entité ProduitStock + fonctions pures | 2024-06-20 | Tests unitaires Jest |
| 3 | ✅ Domaine — Value Object Quantite | 2024-06-20 | Tests unitaires Jest |
| 4 | ✅ Application — Use Case ReserverStock | 2024-06-20 | Tests avec InMemoryRepo |
| 5 | ✅ Infrastructure — ApiStockRepository | 2024-06-20 | Test manuel avec json-server |
| 6 | ✅ Infrastructure — json-server démarré sur port 3001 | 2024-06-20 | npm run mock |
| 7 | ✅ UI — Hook useReserverStock | 2024-06-20 | Test composant Testing Library |
| 8 | ✅ UI — ReservationForm (formulaire + Zod) | 2024-06-20 | Test manuel navigateur |
| 9 | ✅ Design — Design System tokens.css | 2024-06-20 | Inspection visuelle |
| 10 | ✅ Responsive — Mobile 320px à Desktop 1440px | 2024-06-20 | DevTools Chrome |

---

## 🟡 En Cours (Reprendre ici)

| # | Fonctionnalité | Démarré le | Prochaine étape |
|---|---|---|---|
| 1 | 🟡 UI — Page StockPage assemblage final | 2024-06-20 | Connecter le filtre de recherche au hook useRechercheStock |
| 2 | 🟡 Redux — Slice authSlice | 2024-06-20 | Implémenter le refresh token dans l'interceptor Axios |

---

## 🔴 Bugs Identifiés (Résoudre avant de continuer)

| # | Bug | Fichier concerné | Étapes de reproduction | Priorité |
|---|---|---|---|---|
| 1 | 🔴 La pagination saute à la page 1 après une réservation | `StockList.tsx` | 1. Aller page 3 → 2. Réserver → 3. La page revient à 1 | HAUTE |
| 2 | 🔴 Le skeleton ne s'affiche pas sur mobile (320px) | `StockListeSkeleton.tsx` | Réduire à 320px → skeleton invisible | MOYENNE |

---

## 📋 Backlog (Pas encore commencé)

| # | Fonctionnalité | Priorité |
|---|---|---|
| 1 | 🔲 Export PDF de la liste des stocks | BASSE |
| 2 | 🔲 Notifications temps réel via WebSocket | MOYENNE |
| 3 | 🔲 Mode hors-ligne avec Service Worker | BASSE |

---

## 🧠 Contexte pour le prochain Agent IA

> **Lis cette section avant de commencer.**

### Ce qui a été fait
- Architecture hexagonale complète mise en place
- json-server tourne sur port 3001 avec db.json réaliste
- Toutes les fonctionnalités ✅ sont stables, NE PAS LES MODIFIER

### Où en est-on
- On travaille sur **StockPage** — le filtre de recherche n'est pas encore connecté
- Le fichier à modifier est `src/ui/pages/StockPage.tsx` (ligne 42)
- Le hook à créer est `src/ui/hooks/useRechercheStock.ts`

### Ce qui est interdit
- Ne pas modifier les fichiers dans `src/domain/` (tout est ✅)
- Ne pas modifier `src/infrastructure/config/dependencies.ts` (tout est ✅)
- Résoudre le bug 🔴 #1 (pagination) AVANT de commencer le backlog
```

### Règle de mise à jour du `PROJECT_STATUS.md`

```
AVANT de commencer une tâche :
  → Passer la fonctionnalité de 🔲 à 🟡 (EN COURS)

APRÈS avoir terminé et testé :
  → Passer la fonctionnalité de 🟡 à ✅ (VALIDÉ)
  → Ajouter la date et la méthode de test dans le tableau ✅

SI un bug est découvert :
  → Créer immédiatement une entrée 🔴 avec le fichier, les étapes de reproduction, et la priorité
  → NE PAS continuer sur d'autres fonctionnalités si priorité = HAUTE

AVANT de terminer une session :
  → Mettre à jour la section "Contexte pour le prochain Agent IA"
  → Dire exactement où en est le travail et quelle est la prochaine étape
```

### Intégration dans le Checklist de Validation

```
[ ] PROJECT_STATUS.md existe à la racine du projet
[ ] Chaque fonctionnalité terminée est marquée ✅ avec date et méthode de test
[ ] Aucune fonctionnalité ✅ n'a été modifiée sans être repassée en 🟡
[ ] Tous les bugs 🔴 HAUTE priorité sont résolus avant de continuer
[ ] La section "Contexte pour le prochain Agent IA" est à jour
[ ] Le prochain agent peut comprendre l'état du projet en 2 minutes
```

---

# 🏗️ ARCHITECTURE FRONTEND COMPLÈTE — Feature-Based Hexagonal

---

## 🧠 COMPRENDRE L'ARCHITECTURE EN UNE IMAGE

Imagine que chaque Feature est une **maison avec des étages**.
Chaque étage ne peut parler **qu'à l'étage du dessous**, jamais au dessus.

```
┌─────────────────────────────────┐
│   🎨 ui/ (Affichage)            │ ← Voit l'écran, ne pense pas
├─────────────────────────────────┤
│   🔗 hooks/ (Pont React)        │ ← Traduit le métier en React
├─────────────────────────────────┤
│   ⚙️ usecases/ (Orchestration)  │ ← Coordonne, ne connait pas React
├─────────────────────────────────┤
│   🌍 infrastructure/ (API)      │ ← Parle au monde extérieur
├─────────────────────────────────┤
│   🧠 domain/ (Règles pures)     │ ← Ne connaît RIEN d'externe
└─────────────────────────────────┘
```

**Règle d'or :** Les flèches vont TOUJOURS vers le bas. Jamais vers le haut.

---

## 📂 POURQUOI "PAR FEATURE" ET PAS "PAR TYPE" ?

### ❌ Organisation par TYPE (l'ancienne façon, mauvaise)
```
src/
├── components/    ← Tout mélangé : PaymentCard + StockList + LoginForm
├── hooks/         ← Tout mélangé : usePayment + useStock + useAuth
├── services/      ← Tout mélangé : paymentApi + stockApi + authApi
└── pages/
```
**Problème :** Pour modifier le paiement, tu touches 4 dossiers différents.
Si tu supprimes le module paiement, tu dois fouiller PARTOUT.

### ✅ Organisation par FEATURE (notre façon, bonne)
```
src/features/
├── payment/       ← Tout ce qui concerne le paiement est ICI
└── stock/         ← Tout ce qui concerne le stock est ICI
```
**Avantage :** Supprimer le module paiement = supprimer UN seul dossier.
Trouver un bug paiement = chercher dans UN seul dossier.

---

## 🎯 CENTRALISATION — ENUMS, MESSAGES, CSS, COULEURS

> **Règle absolue :** Une valeur écrite à deux endroits est une valeur mal placée.
> Si tu changes la couleur primaire, tu ne changes **qu'un seul fichier**.

---

### 1️⃣ CENTRALISATION DES ENUMS

**`shared/constants/payment.enums.ts`**
```typescript
export const STATUT_ECHEANCE = {
  EN_ATTENTE: 'EN_ATTENTE',
  PAYEE:      'PAYEE',
  EN_RETARD:  'EN_RETARD',
  ANNULEE:    'ANNULEE',
} as const;

export type StatutEcheance = typeof STATUT_ECHEANCE[keyof typeof STATUT_ECHEANCE];

export const MOYEN_PAIEMENT = {
  WAVE:         'WAVE',
  ORANGE_MONEY: 'ORANGE_MONEY',
  STRIPE:       'STRIPE',
  ESPECES:      'ESPECES',
} as const;

export type MoyenPaiement = typeof MOYEN_PAIEMENT[keyof typeof MOYEN_PAIEMENT];
```

**`shared/constants/user.enums.ts`**
```typescript
export const ROLE_UTILISATEUR = {
  ETUDIANT:    'ETUDIANT',
  PROFESSEUR:  'PROFESSEUR',
  ADMIN:       'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  SECRETAIRE:  'SECRETAIRE',
  COMPTABLE:   'COMPTABLE',
} as const;

export type RoleUtilisateur = typeof ROLE_UTILISATEUR[keyof typeof ROLE_UTILISATEUR];

export const STATUT_ETUDIANT = {
  ACTIF:     'ACTIF',
  SUSPENDU:  'SUSPENDU',
  DIPLOME:   'DIPLOME',
  ABANDONNE: 'ABANDONNE',
} as const;
```

**`shared/constants/index.ts`**
```typescript
export * from './payment.enums';
export * from './stock.enums';
export * from './user.enums';
export * from './routes.constants';
```

**Utilisation :**
```typescript
// ❌ INTERDIT
if (echeance.statut === 'EN_ATTENTE') { ... }

// ✅ OBLIGATOIRE
import { STATUT_ECHEANCE } from '@/shared/constants';
if (echeance.statut === STATUT_ECHEANCE.EN_ATTENTE) { ... }
```

---

### 2️⃣ CENTRALISATION DES MESSAGES

**`shared/messages/fr/payment.messages.ts`**
```typescript
export const PAYMENT_MESSAGES = {
  btn: {
    payer:     'Payer maintenant',
    confirmer: 'Confirmer le paiement',
    annuler:   'Annuler',
    retour:    'Retour',
  },
  titre: {
    mesPaiements: 'Mes Paiements',
    echeancier:   'Mon Échéancier',
    historique:   'Historique des Paiements',
  },
  statut: {
    EN_ATTENTE: '⏳ En attente',
    PAYEE:      '✅ Payée',
    EN_RETARD:  '🔴 En retard',
    ANNULEE:    '⛔ Annulée',
  },
  succes: {
    paiementValide: '✅ Paiement effectué avec succès !',
  },
  erreur: {
    paiementEchoue:  '❌ Le paiement a échoué. Réessayez.',
    montantInvalide: 'Le montant doit être supérieur à 0.',
  },
  vide: {
    aucuneEcheance: 'Aucune échéance en attente. Tout est à jour ! ✅',
  },
} as const;
```

**`shared/messages/fr/errors.messages.ts`**
```typescript
export const ERROR_MESSAGES = {
  reseau:         '🌐 Pas de connexion Internet. Vérifiez votre réseau.',
  serveur:        '🔧 Erreur serveur. Nos équipes sont alertées.',
  nonAutorise:    '🔒 Vous n\'êtes pas autorisé à faire cette action.',
  sessionExpiree: '⏱️ Votre session a expiré. Veuillez vous reconnecter.',
  introuvable:    '🔍 La ressource demandée est introuvable.',
  inconnu:        '❓ Une erreur inattendue s\'est produite.',
} as const;
```

**Utilisation :**
```typescript
// ❌ INTERDIT
<button>Payer maintenant</button>

// ✅ OBLIGATOIRE
import { PAYMENT_MESSAGES } from '@/shared/messages';
<button>{PAYMENT_MESSAGES.btn.payer}</button>
```

---

### 3️⃣ CENTRALISATION DES ROUTES

```typescript
// shared/constants/routes.constants.ts
export const ROUTES = {
  login:       '/login',
  inscription: '/inscription',
  dashboard:   '/dashboard',
  paiements:   '/paiements',
  emploiTemps: '/emploi-du-temps',
  notes:       '/notes',
  cours:       '/cours',
  examens:     '/examens',
  admin: {
    dashboard: '/admin',
    etudiants: '/admin/etudiants',
    finances:  '/admin/finances',
    planning:  '/admin/planning',
  },
  coursDetail:     (id: string) => `/cours/${id}`,
  paiementDetail:  (id: string) => `/paiements/${id}`,
} as const;
```


---

### 4️⃣ CENTRALISATION DES COULEURS CSS

**`shared/design/tokens.css`**
```css
/* ============================================
   🎨 DESIGN TOKENS — SOURCE DE VÉRITÉ UNIQUE
   ============================================ */

:root {
  /* ─── COULEURS DE MARQUE ─── */
  --color-brand-500:  #6C63FF;
  --color-brand-600:  #5650d9;

  /* ─── COULEURS SÉMANTIQUES ─── */
  --color-success-light: #dcfce7;
  --color-success:       #16a34a;
  --color-success-dark:  #14532d;
  --color-warning-light: #fef9c3;
  --color-warning:       #ca8a04;
  --color-warning-dark:  #713f12;
  --color-danger-light:  #fee2e2;
  --color-danger:        #dc2626;
  --color-danger-dark:   #7f1d1d;
  --color-info-light:    #dbeafe;
  --color-info:          #2563eb;
  --color-info-dark:     #1e3a8a;

  /* ─── NEUTRES ─── */
  --color-neutral-50:  #f8fafc;
  --color-neutral-100: #f1f5f9;
  --color-neutral-200: #e2e8f0;
  --color-neutral-400: #94a3b8;
  --color-neutral-600: #475569;
  --color-neutral-700: #334155;
  --color-neutral-800: #1e293b;
  --color-neutral-900: #0f172a;

  /* ─── COULEURS FONCTIONNELLES ─── */
  --bg-app:       var(--color-neutral-50);
  --bg-card:      #ffffff;
  --text-primary: var(--color-neutral-900);
  --text-secondary: var(--color-neutral-600);
  --text-muted:   var(--color-neutral-400);
  --text-on-brand: #ffffff;
  --border-default: var(--color-neutral-200);
  --border-focus: var(--color-brand-500);

  /* ─── ESPACEMENTS ─── */
  --space-1: 4px;  --space-2: 8px;   --space-3: 12px;
  --space-4: 16px; --space-5: 20px;  --space-6: 24px;
  --space-8: 32px; --space-10: 40px; --space-12: 48px;

  /* ─── TYPOGRAPHIE ─── */
  --font-sans: 'Inter', 'Segoe UI', system-ui, sans-serif;
  --text-xs: 0.75rem; --text-sm: 0.875rem; --text-base: 1rem;
  --text-lg: 1.125rem; --text-xl: 1.25rem; --text-2xl: 1.5rem;
  --font-medium: 500; --font-semibold: 600; --font-bold: 700;

  /* ─── BORDURES ET OMBRES ─── */
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --radius-xl: 16px; --radius-full: 9999px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);

  /* ─── TRANSITIONS ─── */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;

  /* ─── Z-INDEX ─── */
  --z-dropdown: 100; --z-modal: 300; --z-toast: 400;
}

/* ─── MODE SOMBRE ─── */
[data-theme="dark"] {
  --bg-app:       var(--color-neutral-900);
  --bg-card:      var(--color-neutral-800);
  --text-primary: var(--color-neutral-50);
  --border-default: var(--color-neutral-700);
}
```

---

### 5️⃣ CLASSES CSS UTILITAIRES GLOBALES

**`shared/design/utilities.css`**
```css
/* ─── BADGES DE STATUT ─── */
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
}
.badge--success { background: var(--color-success-light); color: var(--color-success-dark); }
.badge--warning { background: var(--color-warning-light); color: var(--color-warning-dark); }
.badge--danger  { background: var(--color-danger-light);  color: var(--color-danger-dark);  }
.badge--info    { background: var(--color-info-light);    color: var(--color-info-dark);    }

/* ─── CARDS ─── */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-base);
}
.card:hover { box-shadow: var(--shadow-md); }

/* ─── SKELETON LOADING ─── */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-neutral-100) 25%,
    var(--color-neutral-200) 50%,
    var(--color-neutral-100) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ─── BOUTONS ─── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn--primary { background: var(--color-brand-500); color: var(--text-on-brand); }
.btn--primary:hover:not(:disabled) {
  background: var(--color-brand-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.btn--danger  { background: var(--color-danger); color: #fff; }
.btn--ghost   { background: transparent; color: var(--text-primary); border: 1px solid var(--border-default); }

/* ─── GRILLE RESPONSIVE ─── */
.grid-responsive {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-4);
}
```

---

### 6️⃣ UTILITAIRES TYPESCRIPT STATUT

```typescript
// shared/utils/statut.utils.ts
import { STATUT_ECHEANCE, StatutEcheance } from '@/shared/constants';
import { PAYMENT_MESSAGES } from '@/shared/messages';

export function getBadgeClass(statut: StatutEcheance): string {
  const map: Record<StatutEcheance, string> = {
    [STATUT_ECHEANCE.PAYEE]:      'badge badge--success',
    [STATUT_ECHEANCE.EN_ATTENTE]: 'badge badge--info',
    [STATUT_ECHEANCE.EN_RETARD]:  'badge badge--danger',
    [STATUT_ECHEANCE.ANNULEE]:    'badge badge--warning',
  };
  return map[statut] ?? 'badge';
}

export function getStatutLabel(statut: StatutEcheance): string {
  return PAYMENT_MESSAGES.statut[statut] ?? statut;
}
```

**Dans le composant :**
```tsx
// ❌ INTERDIT
<span style={{ color: echeance.statut === 'PAYEE' ? 'green' : 'red' }}>
  {echeance.statut}
</span>

// ✅ OBLIGATOIRE
import { getBadgeClass, getStatutLabel } from '@/shared/utils/statut.utils';
<span className={getBadgeClass(echeance.statut)}>
  {getStatutLabel(echeance.statut)}
</span>
```

---

## 🗂️ STRUCTURE SHARED/ COMPLÈTE

```
shared/
│
├── components/           # Composants UI réutilisables
│   ├── Button.tsx        # Bouton (variants: primary, ghost, danger)
│   ├── Input.tsx         # Input avec label + message d'erreur
│   ├── Modal.tsx         # Modale accessible
│   ├── Badge.tsx         # Badge de statut générique
│   ├── PageSkeleton.tsx  # Skeleton de chargement de page
│   └── AlerteErreur.tsx  # Affichage erreur uniforme
│
├── hooks/
│   ├── useDebounce.ts    # Délai avant de déclencher
│   ├── useToggle.ts      # true/false simple
│   └── useTheme.ts       # Basculement dark/light mode
│
├── utils/
│   ├── formatDate.ts     # "2024-06-20" → "20 juin 2024"
│   ├── formatMontant.ts  # 1000000 → "1 000 000 FCFA"
│   ├── statut.utils.ts   # getBadgeClass, getStatutLabel
│   └── cn.ts             # Fusion de classes CSS
│
├── constants/
│   ├── payment.enums.ts  # STATUT_ECHEANCE, MOYEN_PAIEMENT
│   ├── stock.enums.ts    # STATUT_STOCK, TYPE_PRODUIT
│   ├── user.enums.ts     # ROLE_UTILISATEUR, STATUT_ETUDIANT
│   ├── routes.constants.ts # ROUTES centralisées
│   └── index.ts          # Export unique
│
├── messages/
│   └── fr/
│       ├── payment.messages.ts
│       ├── stock.messages.ts
│       ├── errors.messages.ts
│       ├── common.messages.ts
│       └── index.ts
│
├── lib/
│   ├── apiClient.ts      # Instance Axios + interceptors
│   └── queryClient.ts    # TanStack Query config
│
└── design/
    ├── tokens.css        # Variables CSS (couleurs, espaces, typo)
    ├── utilities.css     # Classes utilitaires globales
    └── reset.css         # Reset CSS minimal
```

---

## ✅ RÈGLE DE CENTRALISATION — RÉSUMÉ

| Ce qu'on centralise | Où | Exemple |
|---|---|---|
| Valeurs d'énumération | `shared/constants/*.enums.ts` | `STATUT_ECHEANCE.PAYEE` |
| Textes / Labels | `shared/messages/fr/*.messages.ts` | `PAYMENT_MESSAGES.btn.payer` |
| Couleurs | `shared/design/tokens.css` | `var(--color-brand-500)` |
| Classes de statut | `shared/utils/statut.utils.ts` | `getBadgeClass(statut)` |
| URLs des routes | `shared/constants/routes.constants.ts` | `ROUTES.paiements` |
| Config API | `shared/lib/apiClient.ts` | `apiClient.get(...)` |

**La question à se poser avant d'écrire une valeur :**
> *"Si cette valeur change demain, combien de fichiers dois-je modifier ?"*
> Si la réponse est **plus d'un**, elle doit être centralisée.

---

## 🔴 PIÈCES MANQUANTES CRITIQUES

---

### 🔌 1 — `shared/lib/apiClient.ts`

```typescript
import axios from 'axios';
import { env } from '@/core/config/env';
import { ROUTES } from '@/shared/constants';

export const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// Injecter le token JWT sur chaque requête
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Gérer les erreurs globalement
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = ROUTES.login;
    }
    if (status === 403) {
      try {
        const { data } = await axios.post(`${env.VITE_API_URL}/auth/refresh`, {
          refreshToken: localStorage.getItem('refresh_token'),
        });
        localStorage.setItem('access_token', data.accessToken);
        error.config.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(error.config);
      } catch {
        localStorage.clear();
        window.location.href = ROUTES.login;
      }
    }
    return Promise.reject(error);
  },
);
```

---

### 🔌 2 — `shared/lib/queryClient.ts`

```typescript
import { QueryClient } from '@tanstack/react-query';
import { toast } from '@/shared/lib/toast';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:            1000 * 60 * 5,
      gcTime:               1000 * 60 * 10,
      retry:                2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error: unknown) => {
        const msg = error instanceof Error ? error.message : 'Erreur inattendue';
        toast.error(msg);
      },
    },
  },
});
```

---

### 🔌 3 — `shared/lib/toast.ts`

```typescript
type ToastType = 'success' | 'error' | 'warning' | 'info';

function creerToast(type: ToastType) {
  return (message: string, duration = 4000) => {
    window.dispatchEvent(new CustomEvent('app:toast', {
      detail: { type, message, duration },
    }));
  };
}

export const toast = {
  success: creerToast('success'),
  error:   creerToast('error'),
  warning: creerToast('warning'),
  info:    creerToast('info'),
};
```

---

### 🔌 4 — `core/providers/AppProviders.tsx`

```tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ReactNode } from 'react';
import { queryClient } from '@/shared/lib/queryClient';
import { store } from '@/core/store';
import { ToastContainer } from '@/shared/components/ToastContainer';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ReduxProvider store={store}>
          <QueryClientProvider client={queryClient}>
            {children}
            <ToastContainer />
          </QueryClientProvider>
        </ReduxProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
```

---

### 🔌 5 — `main.tsx`

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProviders } from '@/core/providers/AppProviders';
import { AppRouter } from '@/core/router/AppRouter';
import '@/shared/design/reset.css';
import '@/shared/design/tokens.css';
import '@/shared/design/utilities.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </StrictMode>,
);
```

---

### 🔌 6 — Routes Protégées (`ProtectedRoute.tsx` + `AppRouter.tsx`)

```tsx
// core/router/ProtectedRoute.tsx — < 30 lignes
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/core/store/hooks';
import { ROUTES, ROLE_UTILISATEUR, RoleUtilisateur } from '@/shared/constants';

interface Props { rolesAutorises?: RoleUtilisateur[]; }

export function ProtectedRoute({ rolesAutorises }: Props) {
  const { estConnecte, utilisateur } = useAppSelector((s) => s.auth);

  if (!estConnecte) return <Navigate to={ROUTES.login} replace />;

  if (rolesAutorises && utilisateur) {
    const aLeDroit = rolesAutorises.includes(utilisateur.role as RoleUtilisateur);
    if (!aLeDroit) return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <Outlet />;
}
```

```tsx
// core/router/AppRouter.tsx — < 50 lignes
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { ROUTES, ROLE_UTILISATEUR } from '@/shared/constants';
import { PageSkeleton } from '@/shared/components/PageSkeleton';

const LoginPage     = lazy(() => import('@/features/auth').then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('@/features/dashboard').then(m => ({ default: m.DashboardPage })));
const PaymentPage   = lazy(() => import('@/features/payment').then(m => ({ default: m.PaymentPage })));
const AdminPage     = lazy(() => import('@/features/admin').then(m => ({ default: m.AdminPage })));

export function AppRouter() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path={ROUTES.login} element={<LoginPage />} />

        <Route element={<ProtectedRoute rolesAutorises={[ROLE_UTILISATEUR.ETUDIANT]} />}>
          <Route path={ROUTES.dashboard}  element={<DashboardPage />} />
          <Route path={ROUTES.paiements}  element={<PaymentPage />} />
        </Route>

        <Route element={<ProtectedRoute rolesAutorises={[ROLE_UTILISATEUR.ADMIN]} />}>
          <Route path={ROUTES.admin.dashboard} element={<AdminPage />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
      </Routes>
    </Suspense>
  );
}
```

---

### 🔌 7 — `shared/components/Button.tsx`

```tsx
// < 50 lignes
import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'danger' | 'success';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?:    Size;
  loading?: boolean;
  children: ReactNode;
}

const VARIANT: Record<Variant, string> = {
  primary: 'btn btn--primary',
  ghost:   'btn btn--ghost',
  danger:  'btn btn--danger',
  success: 'btn btn--success',
};
const SIZE: Record<Size, string> = { sm: 'btn--sm', md: '', lg: 'btn--lg' };

export function Button({ variant='primary', size='md', loading=false, disabled, children, ...props }: ButtonProps) {
  return (
    <button
      className={`${VARIANT[variant]} ${SIZE[size]}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <span className="spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}
```

---

### 🔌 8 — `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@':          resolve(__dirname, 'src'),
      '@/core':     resolve(__dirname, 'src/core'),
      '@/features': resolve(__dirname, 'src/features'),
      '@/shared':   resolve(__dirname, 'src/shared'),
      '@/assets':   resolve(__dirname, 'src/assets'),
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, '') },
    },
  },
});
```

---

### 🔌 9 — `package.json` Scripts

```json
{
  "scripts": {
    "dev":        "vite",
    "mock":       "json-server --watch db.json --port 3001 --delay 300",
    "dev:full":   "concurrently \"npm run mock\" \"npm run dev\"",
    "build":      "tsc --noEmit && vite build",
    "lint":       "eslint src --ext .ts,.tsx --max-warnings 0",
    "test:unit":  "vitest run",
    "test:watch": "vitest",
    "test:e2e":   "cypress open"
  }
}
```

---

### 🔌 10 — `.env.example`

```bash
# ─── API Backend ───
VITE_API_URL=http://localhost:8080/api
VITE_APP_ENV=development

# ─── Mock (true = json-server | false = vrai backend) ───
VITE_USE_MOCK=true

# ─── Paiements ───
VITE_WAVE_PUBLIC_KEY=wave_pk_test_xxxxxx
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxxx

# ─── Monitoring ───
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## 🚦 `PROJECT_STATUS.md` — Université App

```markdown
# 🚦 État du Projet — Université App
> Règle : Lire EN PREMIER avant de toucher au code.

## ✅ Validé (NE PAS TOUCHER)
| # | Élément | Testé le |
|---|---|---|
| 1 | ✅ vite.config.ts + alias @/ | 2024-06-21 |
| 2 | ✅ tokens.css Design System | 2024-06-21 |
| 3 | ✅ shared/constants/ (enums, routes) | 2024-06-21 |
| 4 | ✅ shared/messages/ FR | 2024-06-21 |
| 5 | ✅ apiClient.ts + interceptors JWT | 2024-06-21 |
| 6 | ✅ AppProviders.tsx câblage global | 2024-06-21 |
| 7 | ✅ AppRouter.tsx + ProtectedRoute | 2024-06-21 |

## 🟡 En Cours (Reprendre ici)
| # | Feature | Prochaine étape |
|---|---|---|
| 1 | 🟡 features/auth/ | Créer useLogin.ts + LoginPage.tsx |

## 🔴 Bugs
Aucun pour l'instant.

## 🔲 Backlog
| # | Feature | Priorité |
|---|---|---|
| 1 | 🔲 features/payment/ | HAUTE |
| 2 | 🔲 features/schedule/ | HAUTE |
| 3 | 🔲 features/exam/ | HAUTE |
| 4 | 🔲 features/admin/ | MOYENNE |
```

