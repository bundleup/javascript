# BundleUp JavaScript SDK

[![npm version](https://img.shields.io/npm/v/@bundleup/sdk.svg)](https://www.npmjs.com/package/@bundleup/sdk)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Official JavaScript/TypeScript SDK for the [BundleUp](https://bundleup.io) API. Connect to 100+ integrations with a single, unified API.

## Installation

```bash
npm install @bundleup/sdk
```

Or with yarn:

```bash
yarn add @bundleup/sdk
```

Or with pnpm:

```bash
pnpm add @bundleup/sdk
```

## Requirements

- Node.js 16 or higher
- TypeScript 5.0+ (for TypeScript projects)

## Features

- **TypeScript First** - Built with TypeScript, includes full type definitions
- **Modern JavaScript** - ESM and CommonJS support for maximum compatibility
- **Promise-based API** - Uses native fetch for all HTTP requests
- **Comprehensive Coverage** - Full support for Connections, Integrations, Webhooks, Proxy, and Unify APIs
- **Lightweight** - Zero dependencies beyond native fetch API

## Quick Start

```javascript
import { BundleUp } from '@bundleup/sdk';

// Initialize the client with your API key
const client = new BundleUp(process.env.BUNDLEUP_API_KEY);

// List all connections
const connections = await client.connections.list();
console.log(connections);
```

## Authentication

The BundleUp SDK uses API keys for authentication. You can obtain your API key from the [BundleUp Dashboard](https://app.bundleup.io).

```javascript
import { BundleUp } from '@bundleup/sdk';

// Initialize with API key
const client = new BundleUp('your_api_key_here');

// Or use environment variable (recommended)
const client = new BundleUp(process.env.BUNDLEUP_API_KEY);
```

**Security Best Practice:** Never commit your API keys to version control. Use environment variables or a secure credential management system.

## Usage

### Connections

Manage your integration connections:

```javascript
// List all connections
const connections = await client.connections.list();

// List with query parameters
const connections = await client.connections.list({ status: 'active', limit: '10' });

// Retrieve a specific connection
const connection = await client.connections.retrieve('conn_123');

// Delete a connection
await client.connections.del('conn_123');
```

### Integrations

Work with available integrations:

```javascript
// List all integrations
const integrations = await client.integrations.list();

// Retrieve a specific integration
const integration = await client.integrations.retrieve('int_123');
```

### Webhooks

Manage webhook subscriptions:

```javascript
// List all webhooks
const webhooks = await client.webhooks.list();

// Create a webhook
const webhook = await client.webhooks.create({
  url: 'https://example.com/webhook',
  events: {
    'connection.created': true,
    'connection.deleted': true
  }
});

// Retrieve a webhook
const webhook = await client.webhooks.retrieve('webhook_123');

// Update a webhook
const updated = await client.webhooks.update('webhook_123', {
  url: 'https://example.com/new-webhook'
});

// Delete a webhook
await client.webhooks.del('webhook_123');
```

### Proxy API

Make direct calls to the underlying integration APIs:

```javascript
// Create a proxy instance
const proxy = client.proxy('conn_123');

// Make GET request
const users = await proxy.get('/api/users');
const data = await users.json();

// Make POST request
const response = await proxy.post('/api/users', JSON.stringify({
  name: 'John Doe',
  email: 'john@example.com'
}));
const newUser = await response.json();

// Make PUT request
const response = await proxy.put('/api/users/123', JSON.stringify({
  name: 'Jane Doe'
}));

// Make PATCH request
const response = await proxy.patch('/api/users/123', JSON.stringify({
  email: 'jane@example.com'
}));

// Make DELETE request
await proxy.delete('/api/users/123');
```

### Unify API

Access unified, normalized data across different integrations.

#### Chat (Slack, Discord, Microsoft Teams, etc.)

```javascript
// Get unified API instance for a connection
const unify = client.unify('conn_123');

// List channels
const channels = await unify.chat.channels({ limit: 100 });

// List channels with pagination
const channels = await unify.chat.channels({
  limit: 50,
  after: 'cursor_token'
});

// Include raw response from the integration
const channels = await unify.chat.channels({
  limit: 100,
  includeRaw: true
});
```

#### Git (GitHub, GitLab, Bitbucket, etc.)

```javascript
const unify = client.unify('conn_123');

// List repositories
const repos = await unify.git.repos({ limit: 50 });

// List pull requests for a repository
const pulls = await unify.git.pulls({
  repoName: 'owner/repo',
  limit: 20
});

// List tags for a repository
const tags = await unify.git.tags({ repoName: 'owner/repo' });

// List releases for a repository
const releases = await unify.git.releases({
  repoName: 'owner/repo',
  limit: 10
});

// Include raw response
const repos = await unify.git.repos({ includeRaw: true });
```

#### Project Management (Jira, Linear, Asana, etc.)

```javascript
// Get issues
const issues = await client.unify('conn_123').pm.issues({ limit: 100 });

// List with pagination
const issues = await client.unify('conn_123').pm.issues({
  limit: 50,
  after: 'cursor_token'
});

// Include raw response
const issues = await client.unify('conn_123').pm.issues({
  includeRaw: true
});
```

## Error Handling

The SDK throws standard JavaScript errors. You can catch and handle them as needed:

```javascript
try {
  const client = new BundleUp('your-api-key');
  const connections = await client.connections.list();
} catch (error) {
  if (error.message.includes('401')) {
    console.error('Authentication failed: Invalid API key');
  } else if (error.message.includes('404')) {
    console.error('Resource not found');
  } else if (error.message.includes('429')) {
    console.error('Rate limit exceeded');
  } else {
    console.error('API error:', error.message);
  }
}
```

## Advanced Usage

### Query Parameters

The `list()` method supports query parameters:

```javascript
// List with filters
const connections = await client.connections.list({
  status: 'active',
  limit: '50',
  page: '1'
});
```

### Custom Headers

When using the Proxy API, you can pass custom headers:

```javascript
const proxy = client.proxy('conn_123');
const response = await proxy.get('/api/users', {
  'X-Custom-Header': 'value'
});
```

### TypeScript Support

The SDK is written in TypeScript and includes comprehensive type definitions:

```typescript
import { BundleUp } from '@bundleup/sdk';

const client = new BundleUp(process.env.BUNDLEUP_API_KEY!);

// Types are inferred automatically
const connections = await client.connections.list();
const webhook = await client.webhooks.create({
  url: 'https://example.com/webhook',
  events: {
    'connection.created': true
  }
});
```

## Development

After cloning the repository, install dependencies:

```bash
npm install
```

Build the package:

```bash
npm run build
```

Run tests:

```bash
npm test
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/bundleup/javascript.

## License

This package is available as open source under the terms of the [ISC License](https://opensource.org/licenses/ISC).

## Support

- Documentation: [https://docs.bundleup.io](https://docs.bundleup.io)
- Email: [support@bundleup.io](mailto:support@bundleup.io)
- GitHub Issues: [https://github.com/bundleup/javascript/issues](https://github.com/bundleup/javascript/issues)

## Code of Conduct

Everyone interacting in the BundleUp project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/bundleup/javascript/blob/main/CODE_OF_CONDUCT).
