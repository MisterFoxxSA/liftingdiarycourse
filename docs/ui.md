# UI Coding Standards

This document outlines the mandatory UI coding standards for this project. All developers must adhere to these guidelines.

---

## Component Library

### shadcn/ui Components - MANDATORY

**IMPORTANT**: This project uses **ONLY** [shadcn/ui](https://ui.shadcn.com/) components for all UI elements.

### Rules

1. ✅ **DO**: Use shadcn/ui components exclusively for all UI needs
2. ❌ **DO NOT**: Create custom components from scratch
3. ❌ **DO NOT**: Build UI elements manually with raw HTML/Tailwind
4. ✅ **DO**: Install new shadcn/ui components as needed using the CLI

### Installing shadcn/ui Components

Use the shadcn/ui CLI to add components to the project:

```bash
npx shadcn@latest add [component-name]
```

**Examples:**
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog
npx shadcn@latest add calendar
```

### Available Components

Refer to the [shadcn/ui documentation](https://ui.shadcn.com/docs/components) for the complete list of available components:

- Buttons
- Forms (Input, Textarea, Select, Checkbox, Radio, etc.)
- Cards
- Dialogs/Modals
- Tables
- Navigation (Tabs, Menus, etc.)
- Data Display (Avatar, Badge, etc.)
- Feedback (Alert, Toast, etc.)
- Overlays (Popover, Tooltip, etc.)
- And many more...

### Composition Over Creation

If you need a component that doesn't exist in shadcn/ui:
1. Check if you can compose it from existing shadcn/ui components
2. If absolutely necessary, request approval before creating custom components
3. Custom components should only wrap or compose shadcn/ui primitives

---

## Date Formatting

### Library: date-fns

All date formatting in this project **MUST** use [date-fns](https://date-fns.org/).

### Standard Date Format

Dates should be formatted using the following pattern:

**Format**: `Do MMM yyyy`

**Examples:**
- `1st Sep 2025`
- `2nd Aug 2025`
- `3rd Jan 2026`
- `4th Feb 2026`

### Implementation

```typescript
import { format } from 'date-fns';

// Formatting a date
const formattedDate = format(new Date('2025-09-01'), 'do MMM yyyy');
// Output: "1st Sep 2025"
```

### Additional Date Utilities

While the standard format is `do MMM yyyy`, you may use other date-fns utilities as needed:

```typescript
import {
  format,
  parseISO,
  addDays,
  subDays,
  differenceInDays,
  isAfter,
  isBefore
} from 'date-fns';

// Parse ISO date string
const date = parseISO('2025-09-01');

// Format with standard pattern
const formatted = format(date, 'do MMM yyyy');

// Date arithmetic
const tomorrow = addDays(date, 1);
const yesterday = subDays(date, 1);

// Comparisons
const daysBetween = differenceInDays(date1, date2);
```

---

## Summary

### Quick Reference

| Category | Standard | Library/Tool |
|----------|----------|--------------|
| UI Components | shadcn/ui ONLY | [shadcn/ui](https://ui.shadcn.com/) |
| Custom Components | ❌ NOT ALLOWED | N/A |
| Date Formatting | `do MMM yyyy` | [date-fns](https://date-fns.org/) |

### Before Writing Any UI Code

1. ✅ Check if shadcn/ui has the component you need
2. ✅ Install it via `npx shadcn@latest add [component-name]`
3. ✅ Use the component from `@/components/ui/`
4. ❌ Never build custom UI from scratch

### Before Formatting Any Date

1. ✅ Import `format` from `date-fns`
2. ✅ Use the pattern `'do MMM yyyy'`
3. ✅ Result: `1st Sep 2025`, `2nd Aug 2025`, etc.

---

## Enforcement

These standards are **mandatory** and will be enforced through:
- Code reviews
- Automated linting (where applicable)
- Pull request checks

**Violations of these standards will require code changes before merge.**
