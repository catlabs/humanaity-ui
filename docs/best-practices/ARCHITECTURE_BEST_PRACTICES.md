# Architecture Best Practices

## Architecture Overview

This project uses **Angular v17+ with standalone components, feature-based architecture, TailwindCSS, and Angular Material with token overrides**.

The application is organized as follows:

```
src/
├── app/
│   ├── core/               # Global services, guards, interceptors
│   ├── shared/             # Shared UI components, pipes, directives
│   │   └── ui/             # Reusable UI components (button, card, panel, etc.)
│   ├── features/           # Feature folders
│   │   ├── feature-name/
│   │   ├── another-feature/
│   │   └── ...
│   ├── app.config.ts
│   └── app.component.ts
└── assets/
```

**Key Principles:**
- Standalone components everywhere (no NgModules for features)
- Feature-based organization with self-contained modules
- Signals for state management (no BehaviorSubject)
- TailwindCSS for styling (SCSS only for global styles and mixins)
- Angular Material with design tokens (not CSS overrides)
- Strict TypeScript mode with strong typing
- Maximum 300 lines per file

## Project Structure

### Standard Feature Layout

```
{feature}/
├── pages/               # UI pages (route components)
├── components/          # Smaller reusable UI units within feature
├── services/            # API services specific to the feature
├── {feature}.routes.ts  # Lazy-loaded routes
└── index.ts            # Public API exports
```

### Directory Responsibilities

**Core** (`core/`)
- Global services (auth, config, etc.)
- Guards and interceptors
- Global utilities
- **Never** put feature-specific code here

**Shared** (`shared/`)
- Reusable UI components (`shared/ui/`)
- Shared pipes and directives
- Shared types/interfaces
- **Never** put services here unless truly global

**Features** (`features/`)
- Self-contained feature modules
- Each feature has its own pages, components, services, routes
- Features can import from `shared/` and `core/`
- Features should not depend on other features directly

**Rules:**
- Every feature folder must contain standalone components + services + routes
- Services never live in "shared/" unless they are truly global
- No NgModules unless required by Angular Material or 3rd-party libs
- Do not exceed 300 lines per file → split components/services if needed

## Path Aliases and Barrel Exports

### Overview

Use TypeScript path aliases combined with barrel exports (`index.ts` files) to create clean, maintainable import patterns. This approach eliminates deep relative paths and provides a consistent API for each module.

### Setup Pattern

The pattern consists of three steps:

1. **Create a barrel export** (`index.ts`) that exports the module's public API
2. **Configure path aliases** in `tsconfig.json` (and `tsconfig.app.json`) with both:
   - A direct alias pointing to the barrel export (e.g., `@core` → `src/app/core/index.ts`)
   - A wildcard alias for sub-paths (e.g., `@core/*` → `src/app/core/*`)
3. **Use the aliases** in imports instead of relative paths

### TypeScript Configuration

Configure path aliases in both `tsconfig.json` and `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@features/*": ["src/app/features/*"],
      "@core": ["src/app/core/index.ts"],
      "@core/*": ["src/app/core/*"],
      "@shared": ["src/app/shared/index.ts"],
      "@shared/*": ["src/app/shared/*"],
      "@api": ["src/app/api/index.ts"],
      "@api/*": ["src/app/api/*"]
    }
  }
}
```

**Key Points:**
- `baseUrl: "./"` is required for path aliases to work
- Use direct aliases (e.g., `@core`) for barrel exports
- Use wildcard aliases (e.g., `@core/*`) for sub-path access if needed
- Configure in both `tsconfig.json` and `tsconfig.app.json` for consistency

### Barrel Export Examples

#### Feature Module

**Step 1: Create `index.ts`**
```typescript
// features/auth/index.ts
export { AuthService } from './auth.service';
```

**Step 2: Configure alias** (already done in `tsconfig.json`)
```json
"@features/*": ["src/app/features/*"]
```

**Step 3: Use in imports**
```typescript
// ✅ CORRECT
import { AuthService } from '@features/auth';

// ❌ WRONG
import { AuthService } from '../../../features/auth/auth.service';
```

#### Core Module

**Step 1: Create `index.ts`**
```typescript
// core/index.ts
export { authGuard } from './guards/auth.guard';
export { authInterceptor } from './interceptors/auth.interceptor';
```

**Step 2: Configure aliases**
```json
"@core": ["src/app/core/index.ts"],
"@core/*": ["src/app/core/*"]
```

**Step 3: Use in imports**
```typescript
// ✅ CORRECT
import { authGuard, authInterceptor } from '@core';

// ❌ WRONG
import { authGuard } from '../../core/guards/auth.guard';
```

#### Shared Components

**Step 1: Create `components/index.ts`**
```typescript
// shared/components/index.ts
export { TimelineNodeComponent } from './timeline-node/timeline-node.component';
export { EventItemComponent } from './event-item/event-item.component';
export type { EventType } from './event-item/event-item.component';
export { EntityPanelComponent } from './entity-panel/entity-panel.component';
export type { EntityData } from './entity-panel/entity-panel.component';
export { SimulationCardComponent } from './simulation-card/simulation-card.component';
export type { SimulationCardData, SimulationStatus } from './simulation-card/simulation-card.component';
```

**Step 2: Create `shared/index.ts`**
```typescript
// shared/index.ts
export * from './components';
```

**Step 3: Configure alias**
```json
"@shared": ["src/app/shared/index.ts"],
"@shared/*": ["src/app/shared/*"]
```

**Step 4: Use in imports**
```typescript
// ✅ CORRECT
import { SimulationCardComponent, SimulationCardData, SimulationStatus } from '@shared';

// ❌ WRONG
import { SimulationCardComponent } from '../../../../shared/components/simulation-card/simulation-card.component';
```

#### API Module

**Step 1: Create/Update `index.ts`**
```typescript
// api/index.ts
export * from './api/api';           // All services
export * from './model/models';      // All models
export * from './variables';        // BASE_PATH, etc.
export * from './provide-api';      // provideApi function
```

**Step 2: Configure aliases**
```json
"@api": ["src/app/api/index.ts"],
"@api/*": ["src/app/api/*"]
```

**Step 3: Use in imports**
```typescript
// ✅ CORRECT
import { CitiesService, CityOutput, HumanOutput, BASE_PATH, provideApi } from '@api';

// ❌ WRONG
import { CitiesService } from '../../api/api/cities.service';
import { CityOutput } from '../../api/model/models';
```

### Type Exports with `isolatedModules`

When using `isolatedModules: true` (required for Angular), separate type exports from value exports:

```typescript
// ✅ CORRECT - Separate type exports
export { EventItemComponent } from './event-item/event-item.component';
export type { EventType } from './event-item/event-item.component';

// ❌ WRONG - Mixed exports cause errors with isolatedModules
export { EventItemComponent, EventType } from './event-item/event-item.component';
```

### Complete Example: Feature with Multiple Exports

```typescript
// features/city/index.ts
export { CityService } from './city.service';
export { cityRoutes } from './city.route';
export { cityListResolver, cityDetailsResolver, myCitiesResolver } from './city.resolver';

// Usage across the app
import { CityService, cityRoutes } from '@features/city';
import { cityListResolver } from '@features/city';
```

### When to Use Path Aliases

- **Always** use path aliases for cross-feature imports
- **Always** use path aliases for core, shared, and API imports
- **Optional** for imports within the same feature (relative imports are acceptable for internal feature code)

### Angular Material Buttons & Icons

- Do not wrap `mat-icon-button` content in extra `div` wrappers; place the icon/image directly inside the button to preserve Material sizing/spacing
- Size avatars/icons with utility classes on the button or icon itself (e.g., `h-8 w-8 rounded-full overflow-hidden`)

### Benefits

- **Cleaner imports**: `@features/auth` instead of `../../../features/auth/auth.service`
- **Easier refactoring**: Moving files doesn't break imports
- **Consistent patterns**: Same import style across the entire codebase
- **Better encapsulation**: Features control their public API via `index.ts`
- **Type safety**: TypeScript resolves paths correctly with full IDE support
- **Maintainability**: Changes to internal structure don't affect consumers

## Modern Angular Syntax (Mandatory)

### Standalone Components

**Always** use standalone components:

```typescript
@Component({
  standalone: true,
  selector: 'app-example',
  templateUrl: './example.component.html',
  imports: [CommonModule]
})
export class ExampleComponent {}
```

**Never** use NgModules for features. Only use NgModules if required by Angular Material or third-party libraries.

### Signals (Not BehaviorSubject)

**Always** use signals for reactive state:

```typescript
// ✅ CORRECT
count = signal(0);
items = signal<Item[]>([]);
selected = signal<Item | null>(null);

// ❌ WRONG
count$ = new BehaviorSubject(0);
items$ = new BehaviorSubject<Item[]>([]);
```

**When to use signals:**
- Component state
- Derived/computed values
- Reactive UI updates

**When to use Observables:**
- HTTP requests (services return Observables)
- Event streams
- Router events

### Dependency Injection with `inject()`

**Always** use `inject()` instead of constructor injection:

```typescript
// ✅ CORRECT
export class FeatureListPage {
  private featureService = inject(FeatureService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
}

// ❌ WRONG
export class FeatureListPage {
  constructor(
    private featureService: FeatureService,
    private router: Router
  ) {}
}
```

### New Control Flow Syntax

**Always** use the new Angular control flow syntax:

```typescript
// ✅ CORRECT
@if (items(); as list) {
  @for (item of list; track item.id) {
    <app-item-card [item]="item" />
  } @empty {
    <p>No items available</p>
  }
} @else {
  <p>Loading items...</p>
}

@switch (status()) {
  @case ('active') {
    <span>Active</span>
  }
  @case ('inactive') {
    <span>Inactive</span>
  }
  @default {
    <span>Unknown</span>
  }
}

// ❌ WRONG
<div *ngIf="items$ | async as list">
  <div *ngFor="let item of list">
    <app-item-card [item]="item" />
  </div>
</div>
```

### Modern Input/Output API

**Always** use the new input/output API:

```typescript
// ✅ CORRECT
export class ItemCardComponent {
  item = input.required<Item>();
  selected = output<Item>();
  
  onClick() {
    this.selected.emit(this.item());
  }
}

// ❌ WRONG
export class ItemCardComponent {
  @Input() item!: Item;
  @Output() selected = new EventEmitter<Item>();
}
```

## Styling Rules

### TailwindCSS First

**TailwindCSS is the primary styling system.** Use Tailwind for:
- Spacing (`p-4`, `m-2`, `gap-4`)
- Layout (`flex`, `grid`, `container`)
- Responsive behavior (`md:`, `lg:`, `xl:`)
- Typography (`text-lg`, `font-bold`)
- Colors (unless Material tokens provide them)
- Borders, shadows, etc.

```html
<!-- ✅ CORRECT -->
<div class="flex flex-col gap-4 p-6 bg-gray-100 rounded-lg">
  <h2 class="text-2xl font-bold text-gray-900">Items</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- content -->
  </div>
</div>

<!-- ❌ WRONG -->
<div class="item-container">
  <h2 class="item-title">Items</h2>
</div>
```

**Never** create new CSS classes unless absolutely necessary. If you need a reusable pattern, create a component instead.

### SCSS Files

SCSS files are **only allowed** for:
- Global styles (`styles.scss`, `theme.scss`)
- Reusable mixins
- Theme-related helpers
- Complex animations that Tailwind cannot handle

**Never** write component-specific styles in `.scss` files. Use Tailwind classes in templates instead.

## 🆕 Tailwind Usage Rules and Component Creation Guidelines

1. When Tailwind utilities are enough

Use Tailwind directly in the template when:

- you only need spacing, layout, alignment, or typography utilities
- the pattern is simple and not repeated across many components
- the code remains understandable without abstraction
- the utilities describe the intent clearly (e.g., flex gap-4 items-center)
- no logic, state, or UI structure needs to be encapsulated

Tailwind is ideal for:

- spacing and padding
- grids and flex layouts
- responsive breakpoints
- typography and colors
- borders, shadows, backgrounds
- hover/focus styles

Do not create Angular components just to hide Tailwind utilities.

2. When to create a reusable Angular component

Create an Angular component only when:

- the pattern is reused in multiple places
- you would have created a component even without Tailwind
- the element carries semantic meaning (e.g., page container, section header)
- there is UI logic or structure to encapsulate
- the HTML block is large or complex
- the pattern involves multiple nested elements or repeated logic

Good examples:

- <app-container> for consistent page width and padding
- <app-section-header> used across multiple feature screens
- layout or structural wrappers that belong to the design system

Avoid creating components only to hide 5–10 Tailwind classes.

A component should represent structure, logic, semantics, or reusability, not cosmetic abstraction.

3. When to use SCSS instead of Tailwind

Use SCSS when:

- the style is complex, custom, or not expressible with utilities
- you need CSS variables, mixins, or multi-layered styling
- the style is not meant to appear directly in the template
- the component needs unique or domain-specific visual rules
- you are overriding Angular Material tokens or theming rules

SCSS is ideal for:

- advanced animations
- deeply customized Material components
- theme variables
- map visuals, markers, and custom shapes
- non-standard UI components

Do not duplicate Tailwind and SCSS for the same purpose.

If Tailwind covers it, prefer Tailwind.

If the style is unique or complex, prefer SCSS.

4. Rule of thumb

If the abstraction would exist even without Tailwind → create a component.

If the abstraction exists only because Tailwind classes feel too long → keep Tailwind and do not create a component.

This keeps the component tree clean, avoids over-abstraction, and ensures the project scales without accumulating unnecessary wrappers.

### Angular Material

**Always** customize Material via design tokens, NOT CSS overrides:

```typescript
// ✅ CORRECT - in app.config.ts
import { provideMaterialDesignConfig } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideMaterialDesignConfig({
      colorScheme: {
        primary: '#4F46E5',
        surface: '#1F2937',
      }
    })
  ]
};

// ❌ WRONG - in component.scss
.mat-button {
  background-color: #4F46E5 !important;
}
```

Only use SCSS for Material customization when tokens cannot control the behavior.

## Shared UI Components

### Location

Put reusable UI components under:
```
src/app/shared/ui/
```

Examples:
- `button/`
- `card/`
- `panel/`
- `badge/`
- `list/`
- `modal/`

### Requirements

Each shared UI component must be:
- **Standalone**
- **Fully typed** (strict TypeScript)
- **Tailwind-first styling**
- **Optionally enhanced** with Material directives
- **Documented** with clear input/output contracts

### Example

```typescript
// shared/ui/button/button.component.ts
@Component({
  standalone: true,
  selector: 'app-button',
  template: `
    <button 
      [class]="buttonClasses()"
      [disabled]="disabled()"
      (click)="clicked.emit()">
      <ng-content />
    </button>
  `,
  imports: [CommonModule]
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  disabled = input(false);
  clicked = output<void>();

  buttonClasses = computed(() => {
    const base = 'font-semibold rounded-lg transition-colors';
    const variants = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300'
    };
    const sizes = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };
    return `${base} ${variants[this.variant()]} ${sizes[this.size()]}`;
  });
}
```

## Feature Organization

### Creating a New Feature

#### Step-by-Step: Example "notification" Feature

1. **Create feature directory structure**
   ```
   features/notification/
   ├── pages/
   ├── components/
   ├── services/
   ├── notification.routes.ts
   └── index.ts
   ```

2. **Create service** (if needed)
   ```
   features/notification/services/notification.service.ts
   ```
   - Wrap generated OpenAPI services (see [API Communication Rules](#api-communication-rules))
   - Use `inject()` for dependency injection
   - Return typed Observables
   - No UI logic

3. **Create pages**
   ```
   features/notification/pages/list/notification-list.page.ts
   features/notification/pages/details/notification-details.page.ts
   ```
   - Standalone components
   - Use signals for state
   - Use new control flow syntax

4. **Create feature components** (if needed)
   ```
   features/notification/components/notification-item/notification-item.component.ts
   ```
   - Reusable within the feature
   - If reusable across features, move to `shared/ui/`

5. **Create routes**
   ```
   features/notification/notification.routes.ts
   ```
   - Lazy-loaded routes
   - Use `loadComponent` for standalone components

6. **Export public API**
   ```
   features/notification/index.ts
   ```
   - Export only what other features might need

### Routes

**Always** use lazy loading with standalone components:

```typescript
// ✅ CORRECT
import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/list/list.page').then(m => m.ListPage)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/details/details.page').then(m => m.DetailsPage)
  }
] satisfies Routes;

// ❌ WRONG
export const featureRoutes: Routes = [
  { path: '', component: ListPage },
  { path: ':id', component: DetailsPage }
];
```

### Services

Services must:
- **Wrap generated OpenAPI services** from `api/api/` (see [API Communication Rules](#api-communication-rules))
- Use `inject()` for dependency injection (not constructor injection)
- Return typed Observables (never `any`)
- Use generated types from `api/model/models`
- Not contain UI logic
- Be feature-specific (unless truly global, then put in `core/`)

```typescript
// ✅ CORRECT - Wraps generated service
import { ItemsService } from '../../api/api/items.service';
import { ItemOutput, ItemInput } from '../../api/model/models';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FeatureService {
  private itemsService = inject(ItemsService);

  getItems(): Observable<ItemOutput[]> {
    return this.itemsService.getAllItems().pipe(
      switchMap(response => this.blobToJson<ItemOutput[]>(response))
    );
  }

  getItem(id: string): Observable<ItemOutput> {
    return this.itemsService.getItemById(id).pipe(
      switchMap(response => this.blobToJson<ItemOutput>(response))
    );
  }

  private blobToJson<T>(response: any): Observable<T> {
    // Handle Blob responses (see API Communication Rules)
    if (response instanceof Blob) {
      return from(new Promise<T>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            resolve(JSON.parse(reader.result as string));
          } catch (e) {
            reject(new Error('Failed to parse JSON: ' + e));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read Blob'));
        reader.readAsText(response);
      }));
    }
    return of(response);
  }
}

// ❌ WRONG - Direct HttpClient calls
@Injectable({ providedIn: 'root' })
export class FeatureService {
  private http = inject(HttpClient);
  
  getItems(): Observable<any> {  // Never return any, use generated types
    return this.http.get('/api/items');  // Don't call API directly
  }
}
```

## API Communication Rules

### OpenAPI Generator

This project uses **OpenAPI Generator** to automatically generate typed API services and models from the backend OpenAPI specification.

**Generated Code Location:**
- Services: `src/app/api/api/` (e.g., `ItemsService`, `AuthControllerService`)
- Models: `src/app/api/model/` (e.g., `ItemOutput`, `ItemInput`)
- Configuration: `src/app/api/configuration.ts`, `src/app/api/variables.ts`

**Key Principles:**
- **Always use generated services** - Never make direct `HttpClient` calls to API endpoints
- **Use generated types** - Import and use types from `api/model/models`
- **Never edit generated files** - All files in `src/app/api/` are auto-generated
- **Wrap generated services** - Create feature-specific services that wrap generated services

### Using Generated Services

**Always** use the generated services from `src/app/api/api/`:

```typescript
// ✅ CORRECT - Use generated service
import { ItemsService } from '../api/api/items.service';
import { ItemOutput, ItemInput } from '../api/model/models';

@Injectable({ providedIn: 'root' })
export class FeatureService {
  private itemsService = inject(ItemsService);

  getItems(): Observable<ItemOutput[]> {
    return this.itemsService.getAllItems().pipe(
      // Handle Blob responses if using fetch API (see below)
      switchMap(response => this.blobToJson<ItemOutput[]>(response))
    );
  }

  createItem(input: ItemInput): Observable<ItemOutput> {
    return this.itemsService.createItem(input).pipe(
      switchMap(response => this.blobToJson<ItemOutput>(response))
    );
  }
}

// ❌ WRONG - Direct HttpClient calls
@Injectable({ providedIn: 'root' })
export class FeatureService {
  private http = inject(HttpClient);
  
  getItems(): Observable<any> {
    return this.http.get('/api/items');  // Don't do this!
  }
}
```

### Using Generated Types

**Always** import and use types from the generated models:

```typescript
// ✅ CORRECT
import { ItemOutput, ItemInput } from '../api/model/models';

export class FeatureListPage {
  items = signal<ItemOutput[]>([]);
  
  createItem(input: ItemInput) {
    // Use typed input
  }
}

// ❌ WRONG
export class FeatureListPage {
  items = signal<any[]>([]);  // Don't use any
  
  createItem(input: { name: string }) {  // Don't define types manually
    // ...
  }
}
```

### Feature Service Pattern

Create feature-specific services that wrap generated services. This allows you to:
- Use `inject()` instead of constructor injection
- Handle Blob responses (see below)
- Add feature-specific logic
- Provide a cleaner API for components

```typescript
// ✅ CORRECT - Feature service wrapping generated service
@Injectable({ providedIn: 'root' })
export class FeatureService {
  private itemsService = inject(ItemsService);

  getItems(): Observable<ItemOutput[]> {
    return this.itemsService.getAllItems().pipe(
      switchMap(response => this.blobToJson<ItemOutput[]>(response))
    );
  }

  getItem(id: string): Observable<ItemOutput> {
    return this.itemsService.getItemById(id).pipe(
      switchMap(response => this.blobToJson<ItemOutput>(response))
    );
  }

  // Handle Blob responses when using fetch API
  private blobToJson<T>(response: any): Observable<T> {
    if (response instanceof Blob) {
      return from(new Promise<T>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            const text = reader.result as string;
            resolve(JSON.parse(text));
          } catch (e) {
            reject(new Error('Failed to parse JSON response: ' + e));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read Blob'));
        reader.readAsText(response);
      }));
    }
    return of(response);
  }
}
```

### Blob Response Handling

When using `withFetch()` in `provideHttpClient()`, the generated services may return `Blob` responses instead of parsed JSON. **Always** handle this in your feature services:

```typescript
// ✅ CORRECT - Handle Blob responses
getItems(): Observable<ItemOutput[]> {
  return this.itemsService.getAllItems().pipe(
    switchMap(response => {
      if (response instanceof Blob) {
        return from(new Promise<ItemOutput[]>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            try {
              resolve(JSON.parse(reader.result as string));
            } catch (e) {
              reject(new Error('Failed to parse JSON: ' + e));
            }
          };
          reader.onerror = () => reject(new Error('Failed to read Blob'));
          reader.readAsText(response);
        }));
      }
      return of(response);
    })
  );
}
```

### Base Path Configuration

The base path is configured via `provideApi()` in `app.config.ts`:

```typescript
// ✅ CORRECT - In app.config.ts
import { provideApi } from './api/provide-api';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideApi('http://localhost:8080'),  // Base path for API
    // Or use Configuration object for more options
    provideApi({
      basePath: 'http://localhost:8080',
      // other configuration options
    })
  ]
};
```

To access the base path in services, inject `BASE_PATH`:

```typescript
import { BASE_PATH } from '../api/variables';

@Injectable({ providedIn: 'root' })
export class FeatureService {
  @Optional() @Inject(BASE_PATH) private basePath?: string;
  
  // Use basePath when needed
}
```

### Regenerating API Code

When the backend API changes, regenerate the API code:

1. **Ensure backend is running** and OpenAPI spec is available at `http://localhost:8080/v3/api-docs`
2. **Run the generator** (check `package.json` for the script):
   ```bash
   npm run generate:api
   # or
   npx @openapitools/openapi-generator-cli generate -c openapi-generator-config.json
   ```
3. **Review generated changes** - Check git diff to see what changed
4. **Update feature services** if needed - Adjust your feature services if API signatures changed
5. **Test thoroughly** - Ensure all API calls still work

**Configuration:** The generator config is in `openapi-generator-config.json`:
- Input spec: `http://localhost:8080/v3/api-docs`
- Output directory: `src/app/api`
- Generator: `typescript-angular`

### API Methods

**Always** create dedicated methods in feature services for each API endpoint:

```typescript
// ✅ CORRECT
@Injectable({ providedIn: 'root' })
export class FeatureService {
  private itemsService = inject(ItemsService);

  getItems(): Observable<ItemOutput[]> { }
  getItem(id: string): Observable<ItemOutput> { }
  createItem(input: ItemInput): Observable<ItemOutput> { }
  updateItem(id: string, input: ItemInput): Observable<ItemOutput> { }
  deleteItem(id: string): Observable<void> { }
}
```

**Never** put HTTP calls directly in components. Always use feature services that wrap generated services.

### Error Handling

Handle errors in components, not in services (unless you need global error handling):

```typescript
// ✅ CORRECT - Service returns Observable
getItems(): Observable<ItemOutput[]> {
  return this.itemsService.getAllItems().pipe(
    switchMap(response => this.blobToJson<ItemOutput[]>(response))
  );
}

// ✅ CORRECT - Component handles errors
loadItems() {
  this.featureService.getItems().subscribe({
    next: (items) => this.items.set(items),
    error: (error) => {
      console.error('Error loading items:', error);
      // Show error message to user
    }
  });
}
```

### Missing Endpoints

If a backend endpoint is not yet in the OpenAPI spec (and thus not generated):

1. **Temporarily use HttpClient directly** in your feature service
2. **Use the same base path** from `BASE_PATH` injection
3. **Use generated types** for request/response when possible
4. **Add a TODO comment** to regenerate API when endpoint is added to spec

```typescript
// ✅ CORRECT - Temporary workaround for missing endpoint
getMyItems(): Observable<ItemOutput[]> {
  // TODO: Regenerate API when /api/items/mine is added to OpenAPI spec
  const basePath = this.basePath || 'http://localhost:8080';
  return this.httpClient.get<ItemOutput[]>(`${basePath}/api/items/mine`);
}
```

## File Size Limit

**Maximum 300 lines per file.**

If a file exceeds 300 lines:
- Split components into smaller sub-components
- Extract logic into services
- Extract complex computed values into separate functions
- Break large templates into smaller template files

## Quick Reference

### Component Template

```typescript
@Component({
  standalone: true,
  selector: 'app-feature-name',
  templateUrl: './feature-name.component.html',
  imports: [CommonModule, /* other imports */]
})
export class FeatureNameComponent {
  // Use inject() for DI
  private service = inject(FeatureService);
  
  // Use signals for state
  items = signal<ItemOutput[]>([]);
  loading = signal(false);
  
  // Use new input/output API
  item = input.required<ItemOutput>();
  selected = output<ItemOutput>();
  
  // Use computed for derived state
  filteredItems = computed(() => 
    this.items().filter(item => item.active)
  );
}
```

### Service Template

```typescript
// ✅ CORRECT - Feature service wrapping generated service
import { ItemsService } from '../../api/api/items.service';
import { ItemOutput, ItemInput } from '../../api/model/models';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FeatureService {
  private itemsService = inject(ItemsService);

  getItems(): Observable<ItemOutput[]> {
    return this.itemsService.getAllItems().pipe(
      switchMap(response => this.blobToJson<ItemOutput[]>(response))
    );
  }

  getItem(id: string): Observable<ItemOutput> {
    return this.itemsService.getItemById(id).pipe(
      switchMap(response => this.blobToJson<ItemOutput>(response))
    );
  }

  createItem(input: ItemInput): Observable<ItemOutput> {
    return this.itemsService.createItem(input).pipe(
      switchMap(response => this.blobToJson<ItemOutput>(response))
    );
  }

  // Handle Blob responses when using fetch API
  private blobToJson<T>(response: any): Observable<T> {
    if (response instanceof Blob) {
      return from(new Promise<T>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            resolve(JSON.parse(reader.result as string));
          } catch (e) {
            reject(new Error('Failed to parse JSON: ' + e));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read Blob'));
        reader.readAsText(response);
      }));
    }
    return of(response);
  }
}
```

### Route Template

```typescript
import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => 
      import('./pages/list/list.page').then(m => m.ListPage)
  },
  {
    path: ':id',
    loadComponent: () => 
      import('./pages/details/details.page').then(m => m.DetailsPage)
  }
] satisfies Routes;
```

### File Locations

| Component | Location |
|-----------|----------|
| Feature Page | `features/{feature}/pages/{page-name}/{page-name}.page.ts` |
| Feature Component | `features/{feature}/components/{component-name}/{component-name}.component.ts` |
| Feature Service | `features/{feature}/services/{feature}.service.ts` |
| Feature Routes | `features/{feature}/{feature}.routes.ts` |
| Shared UI Component | `shared/ui/{component-name}/{component-name}.component.ts` |
| Global Service | `core/services/{service-name}.service.ts` |
| Guard | `core/guards/{guard-name}.guard.ts` |
| Interceptor | `core/interceptors/{interceptor-name}.interceptor.ts` |
| Generated API Service | `api/api/{service-name}.service.ts` |
| Generated API Model | `api/model/{model-name}.ts` |

## Common Mistakes to Avoid

1. **Using constructor() for DI** → Always use `inject()`
2. **Using NgModules for features** → Use standalone components
3. **Using `*ngIf` or `*ngFor`** → Use new control flow syntax (`@if`, `@for`)
4. **Writing styles in component `.scss` files** → Use Tailwind classes
5. **Returning `any` from services** → Always use proper types
6. **Putting API logic in components** → Use services
7. **Global services when they belong to a feature** → Put in feature folder
8. **Using `@Input()` and `@Output()`** → Use new `input()` and `output()` API
9. **Using BehaviorSubject for component state** → Use signals
10. **Hardcoding API URLs** → Use `BASE_PATH` from generated API
11. **Files exceeding 300 lines** → Split into smaller files
12. **CSS overrides for Material** → Use design tokens
13. **Direct HttpClient calls to API** → Always use generated services from `api/api/`
14. **Editing generated API files** → Never edit files in `src/app/api/`, regenerate instead
15. **Defining types manually** → Use generated types from `api/model/models`
16. **Not handling Blob responses** → Always handle Blob responses when using fetch API
17. **Not regenerating API after backend changes** → Run generator when API spec changes

## Migration Checklist

When refactoring existing code:

- [ ] Convert to standalone component
- [ ] Replace constructor injection with `inject()`
- [ ] Replace `@Input()`/`@Output()` with `input()`/`output()`
- [ ] Replace `*ngIf`/`*ngFor` with `@if`/`@for`
- [ ] Replace BehaviorSubject with signals (for component state)
- [ ] Move styles from `.scss` to Tailwind classes
- [ ] Ensure all types are explicit (no `any`)
- [ ] Verify file is under 300 lines
- [ ] Replace direct HttpClient calls with generated services from `api/api/`
- [ ] Use generated types from `api/model/models` instead of manual types
- [ ] Add Blob response handling if using fetch API
- [ ] Verify routes use lazy loading

## Examples

### Complete Feature Example

**Feature Structure:**
- **Service**: `features/items/services/items.service.ts` - Wraps generated API service
- **Pages**: `features/items/pages/list/list.page.ts`, `features/items/pages/details/details.page.ts`
- **Components**: `features/items/components/item-card/item-card.component.ts` (if feature-specific)
- **Routes**: `features/items/items.routes.ts` - Lazy-loaded routes
- **Shared Component**: `shared/ui/card/card.component.ts` (if reusable across features)

### Component Example

```typescript
@Component({
  standalone: true,
  selector: 'app-item-list',
  template: `
    <div class="flex flex-col gap-4 p-6">
      <h1 class="text-3xl font-bold">Items</h1>
      
      @if (loading()) {
        <p>Loading...</p>
      } @else if (items().length === 0) {
        <p>No items found</p>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (item of items(); track item.id) {
            <app-item-card [item]="item" (selected)="onItemSelected($event)" />
          }
        </div>
      }
    </div>
  `,
  imports: [CommonModule, ItemCardComponent]
})
export class ItemListPage {
  private itemService = inject(ItemService);
  
  items = signal<ItemOutput[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.loading.set(true);
    this.itemService.getItems().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading items:', error);
        this.loading.set(false);
      }
    });
  }

  onItemSelected(item: ItemOutput) {
    // Handle selection
  }
}
```

### Service Example

```typescript
import { inject, Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ItemsService } from '../../api/api/items.service';
import { ItemOutput, ItemInput } from '../../api/model/models';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private itemsService = inject(ItemsService);

  getItems(): Observable<ItemOutput[]> {
    return this.itemsService.getAllItems().pipe(
      switchMap(response => this.blobToJson<ItemOutput[]>(response))
    );
  }

  getItem(id: string): Observable<ItemOutput> {
    return this.itemsService.getItemById(id).pipe(
      switchMap(response => this.blobToJson<ItemOutput>(response))
    );
  }

  createItem(input: ItemInput): Observable<ItemOutput> {
    return this.itemsService.createItem(input).pipe(
      switchMap(response => this.blobToJson<ItemOutput>(response))
    );
  }

  // Handle Blob responses when using fetch API
  private blobToJson<T>(response: any): Observable<T> {
    if (response instanceof Blob) {
      return from(new Promise<T>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          try {
            resolve(JSON.parse(reader.result as string));
          } catch (e) {
            reject(new Error('Failed to parse JSON: ' + e));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read Blob'));
        reader.readAsText(response);
      }));
    }
    return of(response);
  }
}
```
