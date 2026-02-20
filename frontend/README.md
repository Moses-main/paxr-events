Frontend/UI & CI Focus (branch: feature/frontend-ui)

- Goals:
- Improve frontend performance, reliability, and test coverage; establish CI for frontend builds.

- Planned scope:
- 1) Code-splitting & lazy loading: split large routes, lazy-load heavy components.
- 2) Accessibility & typography: ensure legible typography and responsive, accessible UI.
- 3) Basic frontend tests: setup Vitest + React Testing Library scaffolds for core components.
- 4) E2E test skeleton: add Cypress/Playwright scaffolds for end-to-end flows (logged in, marketplace, event detail).
- 5) CI integration: ensure CI runs tests and builds on PRs; implement caching for npm dependencies.
- 6) Documentation: update README and ROADMAP with frontend milestones.

- Deliverables (initial):
- A minimal skeleton with:
- A new frontend-todo.md listing actionable tasks and owners.
- A sample test file under tests/frontend-sample.test.ts for quick smoke test.
- A simple GitHub Actions workflow for frontend test/build (optional, can be added later).

- How to use:
- When ready, run npm install; npm run dev to verify UI; npm run build for production check.

- Notes:
- This branch is focused on frontend/UI improvements and CI/testing scaffolds; it does not touch on-chain related features yet.
