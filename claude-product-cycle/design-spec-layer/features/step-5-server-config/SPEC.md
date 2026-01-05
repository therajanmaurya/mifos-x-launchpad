# Step 5: Server Configuration - Specification

> Configure API endpoints and server settings

**Feature ID**: `step-5-server-config`
**Priority**: P0 (Critical Path)
**Status**: 📋 Planned

---

## Overview

Step 5 allows users to configure API endpoints for different environments (development, staging, production) and connection settings.

---

## Functional Requirements

### FR-1: Environment Configuration

Configure multiple environments:

| Environment | Fields |
|-------------|--------|
| Development | Base URL, API path, tenant |
| Staging | Base URL, API path, tenant |
| Production | Base URL, API path, tenant |

### FR-2: Server Settings

| Field | Type | Default |
|-------|------|---------|
| Protocol | https/http | https |
| Base URL | text | - |
| API Path | text | /fineract-provider/api/v1 |
| Port | number | 443 |
| Tenant ID | text | default |

### FR-3: Connection Settings

| Field | Default |
|-------|---------|
| Connection Timeout | 30000ms |
| Read Timeout | 30000ms |
| Certificate Pinning | false |
| Offline Mode | false |

### FR-4: Connection Testing

- Test button for each environment
- Shows connection status (success/fail)
- Displays response time

---

## State Management

```typescript
interface Step5State {
  environments: {
    development: ServerEnvironment;
    staging: ServerEnvironment;
    production: ServerEnvironment;
  };
  connectionTimeout: number;
  readTimeout: number;
  certificatePinning: boolean;
  offlineMode: boolean;
}

interface ServerEnvironment {
  name: string;
  protocol: 'https' | 'http';
  baseUrl: string;
  apiPath: string;
  port: number;
  tenantId: string;
}
```

---

## UI Components

| Component | Purpose |
|-----------|---------|
| EnvironmentCard | Configure one environment |
| ConnectionTester | Test API connection |
| TimeoutSlider | Configure timeouts |

---

## Related Files

- [MOCKUP.md](./MOCKUP.md)
- [API.md](./API.md)
- [STATUS.md](./STATUS.md)
