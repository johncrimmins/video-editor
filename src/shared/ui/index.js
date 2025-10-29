/**
 * Shared UI components barrel export
 * Provides unified access to all shared UI components
 */

// Core UI components
export { default as Button } from './Button';
export { default as ErrorMessage } from './ErrorMessage';
export { default as StatusMessage } from './StatusMessage';
export { default as VideoElement } from './VideoElement';
export * from './darkTheme';

// shadcn/ui components (Card replaces Container)
export * from './shadcn';

