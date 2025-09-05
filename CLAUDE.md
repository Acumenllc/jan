# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

Jan is a local AI assistant built as a cross-platform desktop app using Tauri (Rust backend) with a React TypeScript frontend. The architecture follows a modular design with a core library and extension system.

### Key Components

- **Core (`/core`)**: TypeScript library providing the foundational APIs and interfaces
- **Web App (`/web-app`)**: React frontend using Vite, Tailwind CSS, and Radix UI components
- **Extensions (`/extensions`)**: Modular plugins (assistant, conversational, download, llamacpp)
- **Extensions Web (`/extensions-web`)**: Web-specific extension implementations
- **Tauri Backend (`/src-tauri`)**: Rust backend with native system integrations and plugins
- **Website (`/website`)**: Documentation and marketing site

### State Management
- Uses Zustand for state management in the React frontend
- RxJS for reactive programming in the core library
- Tauri's IPC for frontend-backend communication

## Development Commands

### Prerequisites
- Node.js ≥ 20.0.0, Yarn ≥ 1.22.0, Make ≥ 3.81, Rust (for Tauri)
- Use `make dev` or `mise dev` for full setup and launch

### Essential Commands

**Development:**
```bash
make dev                    # Full development setup and launch (recommended)
yarn dev                    # Same as yarn dev:tauri
yarn dev:tauri             # Start Tauri development server
yarn dev:web-app           # Start web-only version
yarn dev:mobile            # Start mobile development server
```

**Building:**
```bash
make build                 # Production build
yarn build                 # Build web app and Tauri app  
yarn build:core           # Build core library
yarn build:extensions     # Build all extensions
yarn build:web            # Build web app only
yarn build:mobile         # Build mobile app
```

**Mobile Development:**
```bash
yarn mobile:android        # Start Android development
yarn mobile:ios            # Start iOS development (macOS only)
```

**Testing:**
```bash
make test                  # Run all tests and linting
yarn test                  # Run Vitest tests
yarn test:watch           # Watch mode for tests
yarn test:coverage        # Run tests with coverage
```

**Linting:**
```bash
yarn lint                  # Run ESLint on web app
```

**Cleaning:**
```bash
make clean                 # Delete all build artifacts and dependencies
```

### Build Process

The build requires specific order:
1. `yarn build:tauri:plugin:api` - Build Tauri plugins
2. `yarn build:core` - Build core library (creates package.tgz)
3. `yarn build:extensions` - Build extensions (depends on core)
4. `yarn build:web` or `yarn build:tauri` - Build frontend/app

### Workspace Structure

This is a Yarn workspace with four main packages:
- `@janhq/core` (core library)
- `@janhq/web-app` (React desktop frontend)
- `@jan/extensions-web` (web extensions)
- `@janhq/mobile-app` (mobile React frontend with Tauri)

Extensions are built separately and packaged as .tgz files in `/pre-install/`.

### Testing Strategy

- Vitest for unit tests across all TypeScript packages
- Cargo tests for Rust backend components
- Tests run automatically in CI/CD pipeline
- Use `yarn test:ui` for interactive test UI

### Extension Development

Extensions follow a plugin architecture:
- Each extension has its own package.json and build process
- Extensions communicate through the core API
- Web extensions provide browser-compatible implementations
- Extensions are dynamically loaded at runtime

## Key Technologies

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Radix UI
- **Backend**: Rust, Tauri v2
- **State**: Zustand, RxJS
- **Routing**: TanStack Router
- **Testing**: Vitest, ESLint
- **Build**: Rolldown, Vite
- **Package Management**: Yarn v4 with workspaces