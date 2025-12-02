# Components Guide

This guide documents the reusable UI components available in `/src/components`.

## UI Components

### Badge
Displays a small status indicator or label.
- **Props**: `variant` (default, success, warning, error), `children`.

### Card
A container for grouped content.
- **Props**: `children`, `className`.

### Section
A semantic section wrapper with an optional title.
- **Props**: `title`, `children`, `className`.

## Best Practices

- Components should be functional and stateless where possible.
- Use `props` for configuration.
- Avoid business logic in UI components; pass data and callbacks instead.
