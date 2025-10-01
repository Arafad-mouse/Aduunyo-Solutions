# Testing Guide

This document provides comprehensive information about the testing setup and practices for the Aduunyo Solutions Next.js application.

## 🧪 Testing Stack

- **Jest** - JavaScript testing framework
- **React Testing Library** - Testing utilities for React components
- **Playwright** - End-to-end testing framework
- **TypeScript** - Type safety for tests

## 📁 Project Structure

```
├── __tests__/
│   ├── unit/                 # Unit tests for individual components
│   │   └── Navbar.test.tsx
│   └── integration/          # Integration tests for component interactions
│       └── navigation.test.tsx
├── e2e/                      # End-to-end tests
│   └── user-journey.spec.ts
├── coverage/                 # Test coverage reports (generated)
├── playwright-report/        # Playwright test reports (generated)
├── jest.config.js           # Jest configuration
├── jest.setup.js            # Jest setup and mocks
├── playwright.config.ts     # Playwright configuration
└── audit-ci.json           # Security audit configuration
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Playwright Browsers

```bash
npm run playwright:install
```

## 🏃‍♂️ Running Tests

### Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage
```

### Integration Tests

```bash
# Run integration tests
npm run test:integration
```

### End-to-End Tests

```bash
# Run E2E tests (headless)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### All Tests

```bash
# Run all tests (unit, integration, and E2E)
npm run test:ci
```

## 📊 Test Coverage

Jest is configured to generate coverage reports in multiple formats:

- **Text**: Console output during test runs
- **LCOV**: For integration with CI/CD and code coverage tools
- **HTML**: Interactive coverage report in `coverage/lcov-report/index.html`

### Coverage Thresholds

The project maintains high code coverage standards:

- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

## 🔧 Configuration

### Jest Configuration (`jest.config.js`)

- **Environment**: jsdom for DOM testing
- **Setup**: Automatic mocking of Next.js components
- **Module Mapping**: Support for TypeScript path aliases (`@/`)
- **Coverage**: Comprehensive reporting with exclusions for config files

### Playwright Configuration (`playwright.config.ts`)

- **Browsers**: Chrome, Firefox, Safari, and mobile variants
- **Base URL**: `http://localhost:3012`
- **Reporters**: HTML, JSON, and JUnit formats
- **Features**: Screenshots on failure, video recording, trace collection

## 📝 Writing Tests

### Unit Tests

Unit tests focus on individual components in isolation:

```typescript
import { render, screen } from '@testing-library/react'
import Navbar from '@/components/Navbar'

describe('Navbar Component', () => {
  it('renders navigation links correctly', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
  })
})
```

### Integration Tests

Integration tests verify component interactions:

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Navigation Integration', () => {
  it('navigates between pages', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    await user.click(screen.getByRole('link', { name: /products/i }))
    expect(screen.getByText('Products Page')).toBeInTheDocument()
  })
})
```

### E2E Tests

End-to-end tests simulate real user interactions:

```typescript
import { test, expect } from '@playwright/test'

test('user can navigate through the application', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Products')
  await expect(page).toHaveURL('/products')
})
```

## 🎯 Testing Best Practices

### 1. Test Structure

- **Arrange**: Set up test data and conditions
- **Act**: Execute the functionality being tested
- **Assert**: Verify the expected outcomes

### 2. Naming Conventions

- Use descriptive test names that explain the expected behavior
- Group related tests using `describe` blocks
- Use `it` or `test` for individual test cases

### 3. Mocking

- Mock external dependencies and API calls
- Use Jest mocks for Next.js components (Image, Link, etc.)
- Mock browser APIs when necessary

### 4. Accessibility Testing

- Test keyboard navigation
- Verify ARIA attributes
- Check focus management

### 5. Responsive Testing

- Test mobile and desktop viewports
- Verify responsive behavior in E2E tests

## 🔄 Continuous Integration

### GitHub Actions Workflow

The project includes a comprehensive CI/CD pipeline (`.github/workflows/test.yml`):

1. **Unit & Integration Tests**
   - Runs on Node.js 18.x and 20.x
   - Executes linting and tests with coverage
   - Uploads coverage reports to Codecov

2. **E2E Tests**
   - Runs after unit tests pass
   - Tests across multiple browsers
   - Generates and uploads test reports

3. **Security Audit**
   - Checks for vulnerable dependencies
   - Runs in parallel with other jobs

4. **Build Verification**
   - Ensures the application builds successfully
   - Runs for pull requests

### Triggering CI

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

## 🐛 Debugging Tests

### Jest Tests

```bash
# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Run specific test file
npm test -- Navbar.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="navigation"
```

### Playwright Tests

```bash
# Run with debug mode
npx playwright test --debug

# Run specific test file
npx playwright test user-journey.spec.ts

# Run with headed browser
npx playwright test --headed
```

## 📈 Test Reports

### Coverage Reports

- **Location**: `coverage/lcov-report/index.html`
- **Format**: Interactive HTML with line-by-line coverage
- **CI Integration**: Automatically uploaded to Codecov

### Playwright Reports

- **Location**: `playwright-report/index.html`
- **Features**: Screenshots, videos, traces for failed tests
- **CI Artifacts**: Available for download from GitHub Actions

## 🔍 Troubleshooting

### Common Issues

1. **Tests failing in CI but passing locally**
   - Check Node.js version compatibility
   - Verify environment variables
   - Review timing issues in async tests

2. **Playwright tests timing out**
   - Increase timeout in `playwright.config.ts`
   - Check if the dev server is starting correctly
   - Verify network conditions

3. **Jest module resolution errors**
   - Check `moduleNameMapping` in `jest.config.js`
   - Verify TypeScript path aliases in `tsconfig.json`
   - Ensure all dependencies are installed

### Getting Help

- Check the [Jest documentation](https://jestjs.io/docs/getting-started)
- Review [React Testing Library guides](https://testing-library.com/docs/react-testing-library/intro/)
- Consult [Playwright documentation](https://playwright.dev/docs/intro)

## 📚 Additional Resources

- [Testing Next.js Applications](https://nextjs.org/docs/testing)
- [React Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

---

Happy Testing! 🎉
