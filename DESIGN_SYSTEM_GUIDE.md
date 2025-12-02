# Design System Guide

This project uses a centralized design system located in `/src/styles/design-system`.

## Tokens

The design system uses tokens for consistency:

- **Colors**: Defined in `theme.colors`.
- **Spacing**: Defined in `theme.spacing` (xs, sm, md, lg, xl).
- **Typography**: Defined in `theme.typography`.

## Usage

Import the theme object to use tokens in your components or styled-components logic.

```javascript
import { theme } from '@/styles/design-system';
```

## CSS / Styling

We use [CSS Modules / Tailwind / Styled Components - *Specify your choice here*] for styling components.
Ensure all new components adhere to the defined tokens.
