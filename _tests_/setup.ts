// test/setup.ts
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

afterEach(() => {
  cleanup();
});
// This ensures that after each test, the DOM is cleaned up, preventing memory leaks and ensuring a fresh state for the next test.