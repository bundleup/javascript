# BundleUp JavaScript Monorepo

Official JavaScript repository for BundleUp - A Turbo Monorepo containing framework-specific plugins.

## Packages

This monorepo contains the following packages:

- **[@bundleup/common](./packages/common)** - Common shared utilities and types
- **[@bundleup/react](./packages/react)** - React plugin with hooks and components
- **[@bundleup/nextjs](./packages/nextjs)** - Next.js plugin with webpack integration
- **[@bundleup/vue](./packages/vue)** - Vue.js plugin with composition API support
- **[@bundleup/remix](./packages/remix)** - Remix plugin with loader/action tracking
- **[@bundleup/express](./packages/express)** - Express.js middleware plugin

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

### Quick Start

```javascript
// React
import { useBundleUp } from '@bundleup/react';

// Next.js
import { withBundleUp } from '@bundleup/nextjs';

// Vue
import BundleUpPlugin from '@bundleup/vue';

// Remix
import { withBundleUpLoader } from '@bundleup/remix';

// Express
import { setupBundleUp } from '@bundleup/express';
```

## License

ISC
