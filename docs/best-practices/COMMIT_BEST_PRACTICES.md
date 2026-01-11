# Commit Message Guidelines

## Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

## Rules

- **Never mention "frontend" or "frontend features"** - this is a separate project
- Keep the subject line under 72 characters
- Use imperative mood ("Add feature" not "Added feature" or "Adds feature")
- First line should be a complete sentence
- Capitalize the first letter of the subject
- No period at the end of the subject line

## Types

### Core Types

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring (no behavior change)
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `docs`: Documentation changes
- `chore`: Maintenance tasks (dependencies, config, etc.)
- `style`: Code style changes (formatting, CSS, etc.)

### Special Types

- `build`: Build system or dependencies changes
- `ci`: CI/CD configuration changes
- `ui`: UI/UX improvements (visual changes)
- `ux`: User experience improvements
- `config`: Configuration changes

## Scopes

Use scopes to indicate the area of the codebase affected. **Scopes are flexible and should match your project structure.**

### How to Choose a Scope

1. **Feature Scopes**: Use the name of the feature module or page area

   - Examples: `auth`, `city`, `human`, `simulation`, `admin`
   - **New features automatically get their own scope** - just use the feature name
   - Look at your folder structure: `app/<feature>` → scope is `<feature>`

2. **Technical Scopes**: Use when the change affects a technical layer across features

   - Examples: `api`, `service`, `component`, `guard`, `interceptor`, `route`, `style`, `config`
   - Use for shared utilities, infrastructure, or cross-cutting concerns

3. **No Scope**: Omit scope if the change affects multiple areas or is project-wide
   - Example: `chore: update dependencies` (no scope needed)

### Scope Examples (Not Exhaustive)

These are just examples - your project may have different features:

- Feature modules: `auth`, `city`, `human`, `simulation`, `admin`, `<your-new-feature>`
- Technical layers: `api`, `service`, `component`, `guard`, `interceptor`, `route`, `style`, `config`

## Examples

### Simple Feature

```
feat(city): add city list page with search
```

### Simple Change (No Body Needed)

```
docs: add commit message best practices
```

**Note**: For simple changes (adding a file, small fixes, documentation), the subject line is sufficient. Only add a body for complex changes that need context.

### Feature with Scope

```
feat(auth): implement automatic token refresh on 401
```

### Bug Fix

```
fix(auth): resolve token storage issue in SSR context
```

### UI Improvement

```
ui(city): improve city card layout and spacing
```

### Refactoring

```
refactor(api): update API service to use generated types
```

### Multiple Changes

```
feat(auth): add login page with form validation

- Implement reactive forms with validators
- Add error message display
- Handle authentication errors
```

### Breaking Change

```
feat(route): restructure city routes with lazy loading

BREAKING CHANGE: City routes now require authentication
```

### Style Update

```
style: update theme colors for better contrast
```

### API Integration

```
feat(api): regenerate API models from OpenAPI spec
```

## Best Practices

1. **Always check changes first**: Before writing a commit message, run `git status` and `git diff` to review all changes. This ensures you don't miss any files or modifications. Our tooling should automatically run `git diff` when preparing a commit message—treat that as mandatory.
2. **Be specific**: Instead of "fix bug", use "fix(auth): resolve token refresh loop"
3. **Keep it concise and condensed**: The subject line should be clear and complete. Avoid detailed bullet lists in the body unless absolutely necessary for complex changes. Prefer a single, well-crafted subject line that captures the essence of the change. Only add a body when the change requires explanation of the "why" or context that isn't obvious from the code.
4. **One logical change per commit**: Don't mix unrelated changes
5. **Reference issues**: Use `Closes #123` or `Fixes #456` in footer when applicable
6. **Explain why, not what**: The code shows what changed; the commit message should explain why
7. **Avoid over-detailing**: Don't list every file changed or implementation steps. Focus on what was accomplished at a high level, not the detailed mechanics
8. **Component vs Page**: Use `component` for reusable components, use feature scope for pages

## Common Patterns

### Adding a Feature

```
feat(<module>): add <feature description>
```

### Fixing a Bug

```
fix(<module>): resolve <issue description>
```

### UI/UX Changes

```
ui(<module>): <visual improvement description>
```

### Refactoring

```
refactor(<module>): <refactoring description>
```

### Updating Dependencies

```
chore(deps): update Angular to 20.0.0
```

### Documentation

```
docs: update README with API generation steps
```

## Footer

Optional footer can include:

- Breaking changes: `BREAKING CHANGE: <description>`
- Issue references: `Closes #123`, `Fixes #456`
- Co-authors: `Co-authored-by: Name <email>`

## Examples for Current Project

### New Page

```
feat(city): add city details page with human visualization
```

### Component Update

```
feat(component): add city card component with hover effects
```

### Auth Feature

```
feat(auth): implement automatic token refresh interceptor
```

### Bug Fix

```
fix(auth): resolve localStorage access in SSR context
```

### API Update

```
chore(api): regenerate API models from latest OpenAPI spec
```

### UI Improvement

```
ui(city): improve city list grid layout and responsive design
```

### Route Update

```
feat(route): add lazy loading for city module
```

### Service Refactoring

```
refactor(service): extract city data transformation logic
```
