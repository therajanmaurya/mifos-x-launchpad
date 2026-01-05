# Step 10: Review & Generate - API Reference

```typescript
interface Step10State {
  isGenerating: boolean;
  generationProgress: number;
  generationStatus: string;
  downloadUrl: string | null;
  configJson: string;
  shareUrl: string | null;
  error: string | null;
}

interface Step10Actions {
  generateProject: () => Promise<void>;
  exportConfig: () => void;
  importConfig: (json: string) => void;
  shareConfig: () => Promise<string>;
  downloadProject: () => void;
  resetWizard: () => void;
}

interface GenerationProgress {
  step: number;
  total: number;
  status: string;
}

// Generation stages
type GenerationStage =
  | 'validating'
  | 'generating-gradle'
  | 'generating-theme'
  | 'processing-icons'
  | 'generating-cicd'
  | 'creating-zip'
  | 'complete';

// Project generator
async function generateProject(
  state: WizardState,
  onProgress: (progress: GenerationProgress) => void
): Promise<Blob> {
  const zip = new JSZip();
  const stages = [
    { name: 'validating', fn: validateConfig },
    { name: 'generating-gradle', fn: generateGradleFiles },
    { name: 'generating-theme', fn: generateThemeFiles },
    { name: 'processing-icons', fn: processIcons },
    { name: 'generating-cicd', fn: generateCICDFiles },
    { name: 'creating-zip', fn: createZip },
  ];

  for (let i = 0; i < stages.length; i++) {
    onProgress({
      step: i + 1,
      total: stages.length,
      status: stages[i].name,
    });
    await stages[i].fn(zip, state);
  }

  return zip.generateAsync({ type: 'blob' });
}

// Summary component props
interface SummarySectionProps {
  title: string;
  icon: string;
  content: React.ReactNode;
  stepNumber: number;
  onEdit: () => void;
}

interface FileTreeProps {
  files: GeneratedFile[];
}

interface GeneratedFile {
  path: string;
  type: 'file' | 'directory';
  size?: number;
  children?: GeneratedFile[];
}
```
