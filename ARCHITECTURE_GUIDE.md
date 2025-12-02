# Architecture Guide

This project follows a feature-based architecture for better scalability and maintainability.

## Directory Structure

- **/src/assets**: Static assets like images and icons.
- **/src/components**: Shared UI components.
  - **/ui**: Generic UI components (Buttons, Cards, etc.).
- **/src/context**: React Context providers for global state.
- **/src/features**: Feature-specific code (components, hooks, services).
- **/src/hooks**: Shared custom React hooks.
- **/src/layouts**: Layout components (wrappers for pages).
- **/src/pages**: Route components (views).
- **/src/services**: API and external service integrations.
- **/src/styles**: Global styles and design system configuration.
- **/src/utils**: Helper functions and utilities.

## Guidelines

1. **Feature-First**: Keep code related to a specific feature within that feature's directory.
2. **Shared Components**: Put reusable UI components in `/src/components`.
3. **State Management**: Use React Context for global state, located in `/src/context`.
4. **Separation of Concerns**: Logic should be separated from UI where possible, using hooks.
