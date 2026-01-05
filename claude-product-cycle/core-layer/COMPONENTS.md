# Core Components Registry

> Design system component registry and lookup

---

## UI Components (shadcn/ui)

| Component | Import | Usage |
|-----------|--------|-------|
| Button | `@/components/ui/button` | Primary actions |
| Card | `@/components/ui/card` | Content containers |
| Input | `@/components/ui/input` | Text inputs |
| Label | `@/components/ui/label` | Form labels |
| Select | `@/components/ui/select` | Dropdowns |
| Switch | `@/components/ui/switch` | Toggles |
| Tabs | `@/components/ui/tabs` | Tab navigation |
| Progress | `@/components/ui/progress` | Progress bars |
| Badge | `@/components/ui/badge` | Status badges |
| Popover | `@/components/ui/popover` | Floating content |
| Dialog | `@/components/ui/dialog` | Modal dialogs |
| Textarea | `@/components/ui/textarea` | Multi-line input |
| Slider | `@/components/ui/slider` | Range inputs |
| Checkbox | `@/components/ui/checkbox` | Checkboxes |
| RadioGroup | `@/components/ui/radio-group` | Radio buttons |

---

## Custom Components

| Component | Path | Purpose |
|-----------|------|---------|
| WizardLayout | `@/components/wizard/wizard-layout` | Wizard container |
| ColorPicker | `@/components/forms/color-picker` | Color selection |
| FileUpload | `@/components/forms/file-upload` | File drag-drop |
| DevicePreview | `@/components/preview/device-preview` | Phone mockup |

---

## Component Variants

### Button

```tsx
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>
```

### Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

---

## Icon Library

Using Lucide React icons:

```tsx
import { ArrowLeft, Check, Settings, Download } from 'lucide-react';
```

Common icons:
- Navigation: ArrowLeft, ArrowRight, ChevronDown
- Actions: Check, X, Plus, Minus, Edit, Trash
- Status: CheckCircle, AlertCircle, Info
- Objects: File, Folder, Image, Settings
