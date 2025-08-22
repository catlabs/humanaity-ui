# HumanaityUi

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## How Junie (Autonomous Programmer) can help you

Junie is an AI assistant integrated into your workflow to make incremental, minimal, and safe changes to this repository on request. Here are practical ways Junie can help within this Angular + Apollo GraphQL project:

- Explain code and architecture
  - Walk through Angular modules, routes, components, and services in this repo.
  - Summarize how Apollo GraphQL is configured (see src/app/core/graphql.config.ts) and how queries/mutations flow (e.g., CityService).

- Implement or modify features
  - Create or update Angular components, services, resolvers, and routes (e.g., city list, details, create/delete actions).
  - Wire new GraphQL queries/mutations in services using apollo-angular and update UI bindings.
  - Add input validation and error handling for GraphQL operations.

- Fix bugs and regressions
  - Reproduce issues, add minimal failing tests (when applicable), and implement targeted fixes.
  - Adjust TypeScript typings, RxJS streams, or Angular DI issues.

- Improve developer experience
  - Update scripts in package.json, Angular CLI configs, and environment settings.
  - Add or refine README documentation and usage instructions.

- Testing and quality
  - Add unit tests for services/components and set up helpful test scaffolding.
  - Suggest patterns for mocking Apollo and writing deterministic tests.

- Guidance and learning
  - Provide step-by-step instructions to run, build, or extend features.
  - Offer best practices for folder structure, change detection, and performance in Angular.

How to ask Junie effectively
- Be specific about the goal (e.g., "Add delete confirmation on city list and refresh the query afterwards").
- Share file paths you’ve been working in and any errors/logs you see.
- If possible, describe expected behavior and edge cases.

Examples of requests you can make
- "Refactor CityService.deleteCity to use GraphQL variables instead of string interpolation."
- "Add a route resolver that preloads city list data and show a loading state."
- "Create a unit test for CityService.getCities using ApolloTestingModule."
- "Explain how graphql.config.ts sets up Apollo and how to add an auth header."

Notes
- Junie aims for minimal, focused changes and will explain a plan before edits.
- If a change is risky or ambiguous, Junie will ask clarifying questions before proceeding.
