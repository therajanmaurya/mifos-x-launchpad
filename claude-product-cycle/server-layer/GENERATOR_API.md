# Generator API Reference

> Project generation API

---

## Main Generator

```typescript
interface GeneratorOptions {
  config: WizardState;
  onProgress?: (progress: GenerationProgress) => void;
}

interface GenerationProgress {
  stage: GenerationStage;
  percent: number;
  message: string;
}

type GenerationStage =
  | 'validating'
  | 'processing-templates'
  | 'generating-icons'
  | 'creating-archive'
  | 'complete';

async function generateProject(options: GeneratorOptions): Promise<Blob> {
  const { config, onProgress } = options;
  const zip = new JSZip();

  // Stage 1: Validate
  onProgress?.({ stage: 'validating', percent: 10, message: 'Validating configuration...' });
  validateConfig(config);

  // Stage 2: Templates
  onProgress?.({ stage: 'processing-templates', percent: 30, message: 'Processing templates...' });
  await processTemplates(zip, config);

  // Stage 3: Icons
  onProgress?.({ stage: 'generating-icons', percent: 60, message: 'Generating icons...' });
  await generateIcons(zip, config);

  // Stage 4: Archive
  onProgress?.({ stage: 'creating-archive', percent: 90, message: 'Creating ZIP...' });
  const blob = await zip.generateAsync({ type: 'blob' });

  onProgress?.({ stage: 'complete', percent: 100, message: 'Done!' });
  return blob;
}
```

---

## Icon Generator API

```typescript
interface IconGeneratorOptions {
  source: File | HTMLImageElement;
  shape: IconShape;
  backgroundColor: string;
  platforms: Platform[];
}

interface GeneratedIcons {
  android: Map<string, Blob>;
  ios: Map<string, Blob>;
  web: Map<string, Blob>;
}

async function generateIcons(options: IconGeneratorOptions): Promise<GeneratedIcons>;
```

---

## Template Generator API

```typescript
interface TemplateGeneratorOptions {
  appType: AppType;
  config: WizardState;
}

interface GeneratedFiles {
  path: string;
  content: string | Blob;
  type: 'text' | 'binary';
}

async function generateFromTemplates(
  options: TemplateGeneratorOptions
): Promise<GeneratedFiles[]>;
```

---

## Validation API

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  field: string;
  message: string;
  step: number;
}

function validateConfig(config: WizardState): ValidationResult;
```

---

## Export/Import API

```typescript
// Export configuration
function exportConfig(config: WizardState): string;

// Import configuration
function importConfig(json: string): WizardState;

// Validate imported config
function validateImportedConfig(json: string): ValidationResult;
```
