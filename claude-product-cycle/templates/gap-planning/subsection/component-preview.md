# Preview Component Planning

> Planning template for preview component implementation

---

## Component Overview

| Component | Status | Priority | Effort | Dependencies |
|-----------|--------|----------|--------|--------------|
| DeviceMockup | {{STATUS}} | {{PRIORITY}} | {{EFFORT}} | {{DEPS}} |
| ThemePreview | {{STATUS}} | {{PRIORITY}} | {{EFFORT}} | {{DEPS}} |
| IconPreview | {{STATUS}} | {{PRIORITY}} | {{EFFORT}} | {{DEPS}} |
| ConfigSummary | {{STATUS}} | {{PRIORITY}} | {{EFFORT}} | {{DEPS}} |
| CodePreview | {{STATUS}} | {{PRIORITY}} | {{EFFORT}} | {{DEPS}} |

---

## Implementation Plan

### DeviceMockup

**Purpose**: Display content in realistic device frames

**Props Interface**:
```typescript
interface DeviceMockupProps {
  device: 'iphone-14' | 'pixel-7' | 'ipad-pro' | 'android-tablet';
  children: React.ReactNode;
  scale?: number;
  showStatusBar?: boolean;
  darkMode?: boolean;
  orientation?: 'portrait' | 'landscape';
}
```

**Implementation Tasks**:
| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create component | 1h | {{STATUS}} | {{NOTES}} |
| iPhone frame SVG | 2h | {{STATUS}} | {{NOTES}} |
| Android frame SVG | 2h | {{STATUS}} | {{NOTES}} |
| iPad frame SVG | 2h | {{STATUS}} | {{NOTES}} |
| Status bar component | 2h | {{STATUS}} | {{NOTES}} |
| Dark mode chrome | 1h | {{STATUS}} | {{NOTES}} |
| Scale/zoom support | 1h | {{STATUS}} | {{NOTES}} |
| Landscape orientation | 2h | {{STATUS}} | {{NOTES}} |
| Write tests | 2h | {{STATUS}} | {{NOTES}} |

### ThemePreview

**Purpose**: Live preview of color theme on sample UI

**Props Interface**:
```typescript
interface ThemePreviewProps {
  colors: ColorPalette;
  darkMode?: boolean;
  showComponents?: ('button' | 'card' | 'input' | 'nav')[];
  animated?: boolean;
}
```

**Implementation Tasks**:
| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create component | 1h | {{STATUS}} | {{NOTES}} |
| Sample button component | 1h | {{STATUS}} | {{NOTES}} |
| Sample card component | 1h | {{STATUS}} | {{NOTES}} |
| Sample input component | 1h | {{STATUS}} | {{NOTES}} |
| Sample navigation | 1h | {{STATUS}} | {{NOTES}} |
| Color application | 2h | {{STATUS}} | {{NOTES}} |
| Dark/light toggle | 1h | {{STATUS}} | {{NOTES}} |
| Contrast checker | 2h | {{STATUS}} | {{NOTES}} |
| Animation on change | 1h | {{STATUS}} | {{NOTES}} |
| Write tests | 2h | {{STATUS}} | {{NOTES}} |

### IconPreview

**Purpose**: Display generated icons at all sizes

**Props Interface**:
```typescript
interface IconPreviewProps {
  iconDataUrl: string | null;
  shape: 'circle' | 'rounded' | 'squircle' | 'square';
  backgroundColor: string;
  platforms?: ('android' | 'ios' | 'web')[];
  showSizes?: boolean;
  interactive?: boolean;
}
```

**Implementation Tasks**:
| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create component | 1h | {{STATUS}} | {{NOTES}} |
| Android icon grid | 2h | {{STATUS}} | {{NOTES}} |
| iOS icon grid | 2h | {{STATUS}} | {{NOTES}} |
| Web favicon preview | 1h | {{STATUS}} | {{NOTES}} |
| Canvas icon rendering | 3h | {{STATUS}} | {{NOTES}} |
| Shape mask preview | 2h | {{STATUS}} | {{NOTES}} |
| Adaptive icon preview | 2h | {{STATUS}} | {{NOTES}} |
| Size labels | 1h | {{STATUS}} | {{NOTES}} |
| Download buttons | 1h | {{STATUS}} | {{NOTES}} |
| Write tests | 2h | {{STATUS}} | {{NOTES}} |

### ConfigSummary

**Purpose**: Display all wizard configuration in review step

**Props Interface**:
```typescript
interface ConfigSummaryProps {
  config: WizardState;
  sections?: string[];
  expandable?: boolean;
  onEdit?: (step: number) => void;
  showValidation?: boolean;
}
```

**Implementation Tasks**:
| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create component | 1h | {{STATUS}} | {{NOTES}} |
| Section grouping | 2h | {{STATUS}} | {{NOTES}} |
| Collapsible sections | 1h | {{STATUS}} | {{NOTES}} |
| Edit links | 1h | {{STATUS}} | {{NOTES}} |
| Validation warnings | 2h | {{STATUS}} | {{NOTES}} |
| Visual formatting | 2h | {{STATUS}} | {{NOTES}} |
| Export to JSON | 1h | {{STATUS}} | {{NOTES}} |
| Copy to clipboard | 1h | {{STATUS}} | {{NOTES}} |
| Write tests | 2h | {{STATUS}} | {{NOTES}} |

### CodePreview

**Purpose**: Display generated code with syntax highlighting

**Props Interface**:
```typescript
interface CodePreviewProps {
  code: string;
  language: 'kotlin' | 'swift' | 'xml' | 'yaml' | 'json' | 'toml';
  filename?: string;
  highlightLines?: number[];
  showLineNumbers?: boolean;
  maxHeight?: number;
}
```

**Implementation Tasks**:
| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create component | 1h | {{STATUS}} | {{NOTES}} |
| Syntax highlighting | 3h | {{STATUS}} | {{NOTES}} |
| Line numbers | 1h | {{STATUS}} | {{NOTES}} |
| Line highlighting | 1h | {{STATUS}} | {{NOTES}} |
| Copy button | 1h | {{STATUS}} | {{NOTES}} |
| Filename header | 1h | {{STATUS}} | {{NOTES}} |
| Scroll handling | 1h | {{STATUS}} | {{NOTES}} |
| Theme support | 1h | {{STATUS}} | {{NOTES}} |
| Write tests | 2h | {{STATUS}} | {{NOTES}} |

---

## Performance Optimization

### Real-time Updates

| Component | Debounce | Memoization | Virtual | Notes |
|-----------|----------|-------------|---------|-------|
| ThemePreview | 100ms | useMemo | No | {{NOTES}} |
| IconPreview | 200ms | useMemo | No | {{NOTES}} |
| CodePreview | 300ms | useMemo | Yes | {{NOTES}} |

### Bundle Size Targets

| Component | Current | Target | Strategy |
|-----------|---------|--------|----------|
| DeviceMockup | - | <20KB | SVG optimization |
| ThemePreview | - | <15KB | Component splitting |
| IconPreview | - | <25KB | Canvas lazy load |
| CodePreview | - | <50KB | Highlight.js chunks |
| ConfigSummary | - | <10KB | Simple components |

---

## Timeline

| Component | Week 1 | Week 2 | Week 3 |
|-----------|--------|--------|--------|
| DeviceMockup | ████░░ | ░░░░░░ | ░░░░░░ |
| ThemePreview | ░░██░░ | ██░░░░ | ░░░░░░ |
| IconPreview | ░░░░░░ | ░░████ | ░░░░░░ |
| ConfigSummary | ░░░░░░ | ░░░░░░ | ██░░░░ |
| CodePreview | ░░░░░░ | ░░░░░░ | ░░████ |

---

*Last Updated: {{TIMESTAMP}}*
