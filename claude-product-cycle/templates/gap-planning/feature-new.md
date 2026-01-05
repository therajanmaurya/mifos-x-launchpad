# New Feature Planning Template

> Planning template for implementing new wizard features

---

## Feature Overview

| Attribute | Value |
|-----------|-------|
| Feature Name | {{FEATURE_NAME}} |
| Feature ID | {{FEATURE_ID}} |
| Wizard Step | {{STEP_NUMBER}} |
| Priority | {{PRIORITY}} |
| Estimated Effort | {{EFFORT}} |
| Target Sprint | {{SPRINT}} |

---

## Description

### Summary
{{FEATURE_SUMMARY}}

### User Story
As a **{{USER_ROLE}}**,
I want to **{{USER_GOAL}}**,
So that **{{USER_BENEFIT}}**.

### Background
{{BACKGROUND_CONTEXT}}

---

## Requirements

### Functional Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-1 | {{REQUIREMENT}} | {{PRIORITY}} | {{NOTES}} |
| FR-2 | {{REQUIREMENT}} | {{PRIORITY}} | {{NOTES}} |
| FR-3 | {{REQUIREMENT}} | {{PRIORITY}} | {{NOTES}} |

### Non-Functional Requirements

| ID | Requirement | Target | Notes |
|----|-------------|--------|-------|
| NFR-1 | Performance | {{TARGET}} | {{NOTES}} |
| NFR-2 | Accessibility | {{TARGET}} | {{NOTES}} |
| NFR-3 | Responsiveness | {{TARGET}} | {{NOTES}} |

---

## Technical Design

### State Interface

```typescript
interface {{FEATURE_NAME}}State {
  {{FIELD_1}}: {{TYPE_1}};
  {{FIELD_2}}: {{TYPE_2}};
  {{FIELD_3}}: {{TYPE_3}};
}
```

### Validation Schema

```typescript
const {{FEATURE_NAME}}Schema = z.object({
  {{FIELD_1}}: z.{{VALIDATOR_1}}(),
  {{FIELD_2}}: z.{{VALIDATOR_2}}(),
  {{FIELD_3}}: z.{{VALIDATOR_3}}(),
});
```

### Component Structure

```
{{FEATURE_NAME}}/
├── {{FEATURE_NAME}}.tsx        # Main component
├── {{FEATURE_NAME}}.test.tsx   # Tests
├── use{{FEATURE_NAME}}.ts      # Custom hook (optional)
└── {{FEATURE_NAME}}.types.ts   # Type definitions
```

---

## Implementation Plan

### Phase 1: Foundation

| Task | Effort | Dependencies | Assignee |
|------|--------|--------------|----------|
| Create component file | {{EFFORT}} | - | {{ASSIGNEE}} |
| Define TypeScript interfaces | {{EFFORT}} | - | {{ASSIGNEE}} |
| Add Zustand slice | {{EFFORT}} | - | {{ASSIGNEE}} |

### Phase 2: UI Implementation

| Task | Effort | Dependencies | Assignee |
|------|--------|--------------|----------|
| Build main layout | {{EFFORT}} | Phase 1 | {{ASSIGNEE}} |
| Implement form fields | {{EFFORT}} | Phase 1 | {{ASSIGNEE}} |
| Add validation | {{EFFORT}} | Phase 1 | {{ASSIGNEE}} |

### Phase 3: Integration

| Task | Effort | Dependencies | Assignee |
|------|--------|--------------|----------|
| Connect to store | {{EFFORT}} | Phase 2 | {{ASSIGNEE}} |
| Add preview integration | {{EFFORT}} | Phase 2 | {{ASSIGNEE}} |
| Implement navigation logic | {{EFFORT}} | Phase 2 | {{ASSIGNEE}} |

### Phase 4: Testing & Polish

| Task | Effort | Dependencies | Assignee |
|------|--------|--------------|----------|
| Write unit tests | {{EFFORT}} | Phase 3 | {{ASSIGNEE}} |
| Write integration tests | {{EFFORT}} | Phase 3 | {{ASSIGNEE}} |
| Accessibility audit | {{EFFORT}} | Phase 3 | {{ASSIGNEE}} |
| Documentation | {{EFFORT}} | Phase 3 | {{ASSIGNEE}} |

---

## Acceptance Criteria

- [ ] {{AC_1}}
- [ ] {{AC_2}}
- [ ] {{AC_3}}
- [ ] {{AC_4}}
- [ ] {{AC_5}}

---

## Dependencies

### Depends On

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| {{DEP_1}} | {{TYPE}} | {{STATUS}} | {{IMPACT}} |
| {{DEP_2}} | {{TYPE}} | {{STATUS}} | {{IMPACT}} |

### Blocking

| Feature | Type | Impact |
|---------|------|--------|
| {{FEATURE}} | {{TYPE}} | {{IMPACT}} |

---

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| {{RISK_1}} | {{PROB}} | {{IMPACT}} | {{MITIGATION}} |
| {{RISK_2}} | {{PROB}} | {{IMPACT}} | {{MITIGATION}} |

---

## Testing Strategy

### Unit Tests

| Test Case | Priority | Status |
|-----------|----------|--------|
| Renders correctly | P0 | {{STATUS}} |
| Handles user input | P0 | {{STATUS}} |
| Validates input | P0 | {{STATUS}} |
| Updates store | P0 | {{STATUS}} |

### Integration Tests

| Test Case | Priority | Status |
|-----------|----------|--------|
| Navigation flow | P0 | {{STATUS}} |
| Data persistence | P0 | {{STATUS}} |
| Preview updates | P1 | {{STATUS}} |

---

## Documentation Updates

- [ ] Update SPEC.md with final requirements
- [ ] Update MOCKUP.md with actual screenshots
- [ ] Update API.md with final interfaces
- [ ] Update STATUS.md with completion status
- [ ] Add component to Storybook

---

## Review Checklist

- [ ] Code review completed
- [ ] Tests passing
- [ ] A11y audit passed
- [ ] Performance budget met
- [ ] Documentation complete
- [ ] Design review approved

---

*Created: {{CREATED_DATE}}*
*Last Updated: {{TIMESTAMP}}*
