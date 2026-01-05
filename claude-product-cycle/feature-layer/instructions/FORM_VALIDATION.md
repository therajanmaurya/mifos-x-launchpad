# Form Validation Patterns

> Validation with Zod

---

## Schema Definition

```typescript
import { z } from 'zod';

const step2Schema = z.object({
  organizationName: z.string()
    .min(2, 'Must be at least 2 characters')
    .max(50, 'Must be at most 50 characters'),

  packageName: z.string()
    .regex(/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/,
      'Must be in format com.example.app'),

  versionName: z.string()
    .regex(/^\d+\.\d+\.\d+$/, 'Must be in format X.Y.Z'),

  versionCode: z.number()
    .int('Must be an integer')
    .positive('Must be positive'),
});
```

---

## Validation Hook

```typescript
function useValidation<T>(schema: z.ZodSchema<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((data: unknown) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }, [schema]);

  return { errors, validate, clearError };
}
```

---

## Real-time Validation

```typescript
const handleBlur = (field: string) => {
  const fieldSchema = schema.shape[field];
  const result = fieldSchema.safeParse(data[field]);
  if (!result.success) {
    setErrors(prev => ({
      ...prev,
      [field]: result.error.errors[0].message
    }));
  } else {
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }
};
```
