# Humanaity Frontend

Application Angular moderne avec système d'authentification complet, API REST avec OpenAPI et architecture réactive.

## Stack Technique

- **Angular 20** - Framework moderne avec standalone components
- **TypeScript 5.8** - Typage strict
- **Angular Material** - Composants UI Material Design
- **RxJS 7.8** - Programmation réactive
- **REST API** - Communication avec backend Spring Boot
- **OpenAPI Generator** - Génération automatique de types et services TypeScript
- **Tailwind CSS** - Utility-first CSS
- **Angular SSR** - Server-Side Rendering
- **Pixi.js** - Rendu graphique 2D pour les visualisations

## Fonctionnalités d'Authentification

### Pages d'Authentification

- **Login** (`/login`) - Connexion avec validation de formulaire
- **Signup** (`/signup`) - Inscription avec confirmation de mot de passe
- Navigation conditionnelle selon l'état d'authentification

### Reactive Forms

- Validation en temps réel (email, password, confirmPassword)
- Messages d'erreur contextuels
- Désactivation du bouton submit si formulaire invalide
- Gestion des erreurs serveur avec affichage utilisateur

### AuthGuard

- Protection des routes sensibles (`canActivate`)
- Redirection automatique vers `/login` si non authentifié
- Préservation de l'URL de destination (`returnUrl`)
- Vérification de validité du token (expiration)

### HTTP Interceptor

**Fonctionnalités avancées :**
- Ajout automatique du header `Authorization: Bearer <token>` sur toutes les requêtes
- Exclusion des endpoints `/auth/**` (pas de token nécessaire)
- **Refresh automatique** : en cas de 401, tentative de refresh du token
- Retry automatique de la requête originale avec le nouveau token
- Déconnexion et redirection si le refresh échoue
- Gestion des erreurs HTTP centralisée

### AuthService

- Gestion centralisée de l'authentification
- Stockage sécurisé des tokens (localStorage avec vérification SSR)
- Méthodes typées : `login()`, `signup()`, `refreshToken()`, `logout()`
- Vérification d'authentification avec décodage JWT côté client
- Support SSR (vérification `isPlatformBrowser`)

## Architecture

### Structure Modulaire

```
app/
├── api/               # Modèles et services générés depuis OpenAPI
│   ├── api/           # Services REST générés
│   │   ├── authController.service.ts
│   │   ├── cities.service.ts
│   │   └── humans.service.ts
│   ├── model/         # Modèles TypeScript générés
│   │   ├── authRequest.ts
│   │   ├── cityOutput.ts
│   │   └── ...
│   └── configuration.ts
├── auth/              # Module d'authentification
│   ├── auth.service.ts
│   ├── auth.guard.ts
│   ├── auth.interceptor.ts
│   └── pages/         # Login & Signup components
├── city/              # Feature module
└── core/              # Services partagés
```

### Standalone Components

- Tous les composants sont standalone (pas de NgModules)
- Imports explicites pour la tree-shaking optimale
- Configuration moderne avec `app.config.ts`

### Services Typés

- **Modèles générés automatiquement** depuis la spécification OpenAPI du backend
- Services REST typés générés (`AuthControllerService`, `CitiesService`, `HumansService`, etc.)
- Services injectables avec `inject()` (nouvelle API Angular)
- Observable-based pour les opérations asynchrones
- Typage strict garanti par la génération OpenAPI

### Routing

- Routes protégées avec `canActivate: [authGuard]`
- Lazy loading des feature modules
- Navigation programmatique avec préservation d'état

## Compétences Démontrées

✅ **Angular Moderne**
- Standalone components (Angular 14+)
- Signals pour la réactivité (`signal()`)
- Injection moderne avec `inject()`
- SSR-ready avec vérifications platform

✅ **Gestion d'État Réactive**
- RxJS pour les flux asynchrones
- Interceptors pour la logique cross-cutting
- Guards pour la protection des routes
- Services centralisés pour la logique métier

✅ **Sécurité Frontend**
- Validation côté client et serveur
- Gestion sécurisée des tokens (SSR-safe)
- Refresh automatique transparent pour l'utilisateur
- Protection XSS avec Angular sanitization

✅ **UX/UI**
- Reactive Forms avec validation en temps réel
- Messages d'erreur contextuels
- Material Design pour la cohérence visuelle
- Navigation fluide avec états de chargement

✅ **Intégration Backend**
- Communication REST avec HttpClient
- **Génération automatique** de modèles et services depuis OpenAPI
- Typage strict garanti entre frontend et backend
- Gestion d'erreurs HTTP centralisée
- Synchronisation tokens frontend/backend
- Support CORS configuré

## Configuration

### Interceptor HTTP

```typescript
// app.config.ts
provideHttpClient(
  withFetch(),
  withInterceptors([authInterceptor])
)
```

### Routes Protégées

```typescript
{
  path: 'cities',
  children: cityRoutes,
  canActivate: [authGuard]
}
```

## Démarrage

### Installation

```bash
npm install
```

### Génération des modèles API

Les modèles TypeScript et services Angular sont générés automatiquement depuis la spécification OpenAPI du backend.

**Prérequis :**
1. Démarrer le backend Spring Boot sur `http://localhost:8080`
2. Vérifier que l'OpenAPI est accessible : `http://localhost:8080/v3/api-docs`

**Génération :**
```bash
npm run api:generate
```

Cette commande va :
- Récupérer la spécification OpenAPI depuis le backend
- Générer les modèles TypeScript dans `src/app/api/model/`
- Générer les services Angular dans `src/app/api/api/`

**Note :** Régénérez les modèles après chaque modification de l'API backend.

### Lancement de l'application

```bash
ng serve
```

L'application est accessible sur `http://localhost:4200`

## Build Production

```bash
ng build
```

Build optimisé avec SSR disponible dans `dist/`
