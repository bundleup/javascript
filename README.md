# BundleUp JavaScript Monorepo

Official JavaScript repository for BundleUp - A Turbo Monorepo containing framework-specific plugins.

## Packages

This monorepo contains the following packages:

- **[@bundleup/core](./packages/core)** - Core library for BundleUp
- **[@bundleup/react](./packages/react)** - React plugin with hooks and components
- **[@bundleup/nextjs](./packages/nextjs)** - Next.js plugin with webpack integration

## Development

### Prerequisites

- Node.js 16+
- npm 9+

### Installation

```bash
npm install
```

### Building

Build all packages:

```bash
npm run build
```

### Development

Start development mode for all packages:

```bash
npm run dev
```

### Testing

Run tests for all packages:

```bash
npm test
```

### Linting

Lint all packages:

```bash
npm run lint
```

## Usage

Each package provides framework-specific integration for BundleUp. See individual package READMEs for detailed usage instructions.

## License

ISC
