# Testing Guide for FilmGuide

This document outlines the testing approach and guidelines for the FilmGuide application.

## Testing Framework

We use [Vitest](https://vitest.dev/) as our testing framework, which provides a modern and fast testing experience with native TypeScript support.

## Running Tests

You can run the tests using the following commands:

```bash
# Run all tests
pnpm test

# Run tests in watch mode (recommended during development)
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Generate coverage report
pnpm coverage
```

## Test Structure

Tests are organized following these principles:

1. **Folder Structure**: Test files are placed in a `__tests__` directory adjacent to the modules they test.
2. **Naming Convention**: Test files are named with a `.test.ts` or `.test.tsx` extension.
3. **Test Pattern**: Tests follow the Arrange-Act-Assert pattern for clarity and maintainability.

## Testing Best Practices

### Component Testing

When testing React components:

- Focus on testing the component's behavior, not its implementation details
- Use React Testing Library to interact with components as a user would
- Test different states and edge cases (loading, error, empty data)
- Mock dependencies to isolate the component being tested

### API and Service Testing

When testing API services:

- Mock external API calls to avoid actual network requests
- Test error handling and edge cases
- Ensure proper parameter handling

### State Management Testing

When testing state management (Zustand stores):

- Test initial state
- Test state transitions
- Test error handling

## Mocking

For effective testing, we use mocking to isolate units under test:

```typescript
// Example of mocking a module
vi.mock("../path/to/module", () => ({
  someFunction: vi.fn().mockReturnValue("mocked value"),
}));

// Example of mocking fetch
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ data: "mocked data" }),
});
```

## Coverage Goals

We aim for meaningful test coverage rather than 100% code coverage. Focus on testing:

- Critical business logic
- Edge cases and error handling
- User interactions
- Complex state transitions

## Example Test

Here's an example test following our guidelines:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  // Arrange
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render successfully with data', () => {
    // Arrange
    const testData = { name: 'Test' };

    // Act
    render(<MyComponent data={testData} />);

    // Assert
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should handle null data gracefully', () => {
    // Arrange & Act
    render(<MyComponent data={null} />);

    // Assert
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});
```

## Continuous Integration

Tests are automatically run as part of our CI pipeline on each pull request and merge to main/master branch.
