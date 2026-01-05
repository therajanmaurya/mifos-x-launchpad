# Step 5: Server Configuration - API Reference

---

## Type Definitions

```typescript
type Protocol = 'https' | 'http';
type EnvironmentType = 'development' | 'staging' | 'production';

interface ServerEnvironment {
  name: string;
  protocol: Protocol;
  baseUrl: string;
  apiPath: string;
  port: number;
  tenantId: string;
}

interface Step5State {
  environments: Record<EnvironmentType, ServerEnvironment>;
  connectionTimeout: number;
  readTimeout: number;
  certificatePinning: boolean;
  offlineMode: boolean;
}

interface Step5Actions {
  updateEnvironment: (env: EnvironmentType, data: Partial<ServerEnvironment>) => void;
  testConnection: (env: EnvironmentType) => Promise<ConnectionResult>;
  setConnectionSettings: (settings: Partial<ConnectionSettings>) => void;
}

interface ConnectionResult {
  success: boolean;
  responseTime?: number;
  error?: string;
}
```

---

## Default Values

```typescript
const DEFAULT_ENVIRONMENT: ServerEnvironment = {
  name: '',
  protocol: 'https',
  baseUrl: '',
  apiPath: '/fineract-provider/api/v1',
  port: 443,
  tenantId: 'default',
};

const DEFAULT_CONNECTION = {
  connectionTimeout: 30000,
  readTimeout: 30000,
  certificatePinning: false,
  offlineMode: false,
};
```

---

## Validation

```typescript
const serverEnvironmentSchema = z.object({
  protocol: z.enum(['https', 'http']),
  baseUrl: z.string().min(1).regex(/^[a-zA-Z0-9.-]+$/),
  apiPath: z.string().startsWith('/'),
  port: z.number().min(1).max(65535),
  tenantId: z.string().min(1),
});

function buildServerUrl(env: ServerEnvironment): string {
  const port = env.port === 443 ? '' : `:${env.port}`;
  return `${env.protocol}://${env.baseUrl}${port}${env.apiPath}`;
}
```

---

## Component Props

```typescript
interface EnvironmentCardProps {
  environment: EnvironmentType;
  data: ServerEnvironment;
  onChange: (data: Partial<ServerEnvironment>) => void;
  onTest: () => void;
  testResult?: ConnectionResult;
}

interface ConnectionTesterProps {
  url: string;
  onTest: () => void;
  result?: ConnectionResult;
  loading?: boolean;
}
```
