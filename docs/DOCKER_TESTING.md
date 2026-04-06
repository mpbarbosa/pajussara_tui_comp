# Docker Testing Guide

> **Reusable template** — this guide was written for `pajussara_tui_comp` but is designed to be adapted to any Node.js / TypeScript project that uses Jest.

---

## Table of Contents

1. [Why run tests in Docker?](#why-run-tests-in-docker)
2. [Prerequisites](#prerequisites)
3. [Project files overview](#project-files-overview)
4. [Dockerfile.test walkthrough](#dockerfiletest-walkthrough)
5. [.dockerignore walkthrough](#dockerignore-walkthrough)
6. [Shell script walkthrough](#shell-script-walkthrough)
7. [Running the tests](#running-the-tests)
8. [Extracting coverage reports](#extracting-coverage-reports)
9. [CI/CD integration (GitHub Actions)](#cicd-integration-github-actions)
10. [Adapting to your project](#adapting-to-your-project)
11. [Troubleshooting](#troubleshooting)

---

## Why run tests in Docker?

| Benefit | Details |
|---|---|
| **Isolation** | Tests run in a clean OS every time — no leftover state, no host machine differences |
| **Reproducibility** | Same image = same result on any machine or CI runner |
| **CI parity** | What passes locally in Docker will pass in CI |
| **Dependency pinning** | The exact Node.js version is locked to the image tag |
| **Safe multi-project setups** | Different projects can use conflicting Node versions without virtual-env headaches |

---

## Prerequisites

### Docker

| Platform | Install |
|---|---|
| **macOS / Windows** | [Docker Desktop](https://docs.docker.com/desktop/) |
| **Linux** | [Docker Engine](https://docs.docker.com/engine/install/) |

Verify installation:

```bash
docker --version      # Docker version 26.x.x or later
docker info           # confirms the daemon is running
```

### Node.js (host only)

The host machine needs Node.js **only** for the `npm run test:docker` convenience script (it resolves the package version). The actual tests run inside Docker.

```bash
node --version   # v18.0.0 or later
```

---

## Project files overview

The Docker test setup consists of three files:

```
project-root/
├── Dockerfile.test          ← image definition for the test runner
├── .dockerignore            ← files excluded from the build context
└── scripts/
    └── run-tests-docker.sh  ← orchestration script (build → run → report)
```

`package.json` also exposes a convenience script:

```json
"scripts": {
  "test:docker": "bash scripts/run-tests-docker.sh"
}
```

---

## Dockerfile.test walkthrough

```dockerfile
FROM node:22-alpine
```

- Uses the **official Node.js Alpine image** — roughly 60 MB vs 900 MB for the Debian image.
- Pin a specific version (e.g., `node:22-alpine`) rather than `node:alpine` or `node:latest` so builds are reproducible.
- The version must satisfy the project's `engines.node` field in `package.json`.

---

```dockerfile
RUN apk add --no-cache python3 make g++
```

- Some npm packages have native bindings that require a C++ compiler and Python (via `node-gyp`).
- `--no-cache` avoids saving the Alpine package index layer, keeping the image lean.
- **Remove this line** if your project has no native dependencies.

---

```dockerfile
WORKDIR /app
```

- Sets `/app` as the working directory for all subsequent commands.
- Creates the directory if it does not exist.

---

```dockerfile
COPY package.json package-lock.json ./
```

- Copies **only the dependency manifests** first.
- Docker caches each layer; if neither file changed since the last build, the next `RUN npm ci` layer is also cached — saving minutes on subsequent builds.

---

```dockerfile
RUN npm ci --ignore-scripts
```

- `npm ci` does a clean install from `package-lock.json`. It is faster and stricter than `npm install` and never modifies `package-lock.json`.
- `--ignore-scripts` skips lifecycle scripts (`preinstall`, `postinstall`, etc.) that may fail inside Alpine (e.g., scripts that assume a graphical environment or a different shell).
- **devDependencies are installed** because `ENV NODE_ENV=test` is set in the Dockerfile before this step. This is required — the `node:22-alpine` base image ships with `NODE_ENV=production`, which causes `npm ci` to silently skip devDependencies (Jest, ts-jest, react, ink, type definitions, etc.). Overriding it ensures the full dependency tree is installed.
- ⚠️ **Anti-pattern to avoid:** Do NOT add `RUN npm install -g npm@latest` before this step. The base image ships a working npm; self-upgrading can break if the installed npm's internal modules are incomplete or mis-linked:
  ```
  npm error Cannot find module 'promise-retry'   # ← symptom of the anti-pattern
  ```

---

```dockerfile
COPY . .
```

- Copies the remaining project files **after** `npm ci` so that source-code changes do not invalidate the dependency cache layer.
- The `.dockerignore` file controls what is excluded (see next section).

---

```dockerfile
CMD ["npm", "test"]
```

- Default command when the container is run with no arguments.
- Uses JSON array form (`["npm", "test"]`) to avoid spawning an intermediate shell, which makes signal handling (e.g., `Ctrl-C`) more reliable.

---

## .dockerignore walkthrough

`.dockerignore` uses the same syntax as `.gitignore`. It tells Docker which files to exclude from the **build context** — the directory tree sent to the Docker daemon before the build starts.

A smaller build context means faster builds and smaller images.

```dockerignore
# Installed packages — npm ci installs these fresh inside the container
node_modules/

# TypeScript compilation output — not needed for tests (ts-jest compiles on the fly)
dist/

# Previous coverage output — tests produce their own inside the container
coverage/

# Git metadata — not needed at runtime
.git/

# Logs
*.log
npm-debug.log*
.npm/

# OS artefacts
.DS_Store
*.tsbuildinfo
```

**Key rules:**
- Always exclude `node_modules/` — copying it in would override the clean `npm ci` install and dramatically bloat the build context.
- Exclude `dist/` — tests run against source files through ts-jest, not pre-built output.
- Exclude `.git/` — no need for version history inside the container.

---

## Shell script walkthrough

`scripts/run-tests-docker.sh` is a convenience wrapper with three steps:

### Step 1 — Build the image

```bash
docker build \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  -t pajussara_tui_comp-test \
  -f Dockerfile.test \
  "${PROJECT_ROOT}"
```

- `-f Dockerfile.test` — uses the dedicated test Dockerfile instead of a generic `Dockerfile`.
- `-t pajussara_tui_comp-test` — tags the image for easy reference.
- `--build-arg BUILDKIT_INLINE_CACHE=1` — embeds cache metadata in the image layers (useful for registry-based caching in CI).

### Step 2 — Run the container

```bash
docker run \
  --rm \
  --name pajussara_tui_comp-test-run \
  -e CI=true \
  pajussara_tui_comp-test \
  sh -c "npm test"
```

- `--rm` — removes the container automatically after it exits.
- `-e CI=true` — signals to Jest (and other tools) that the run is non-interactive; disables watch mode and colour animations in some reporters.
- The exit code of `docker run` mirrors the exit code of the test process.

### Step 3 — Report

The script captures the container's exit code and prints a pass/fail summary, then exits with the same code. This makes it compatible with CI pipelines that check `$?`.

### Passing extra Jest arguments

Extra arguments after `--` are forwarded to the test command:

```bash
bash scripts/run-tests-docker.sh -- --coverage
bash scripts/run-tests-docker.sh -- --testPathPattern=ListPanel
bash scripts/run-tests-docker.sh -- --verbose --detectOpenHandles
```

---

## Running the tests

### Basic run

```bash
npm run test:docker
# or directly:
bash scripts/run-tests-docker.sh
```

### With specific test file

```bash
bash scripts/run-tests-docker.sh -- --testPathPattern=ListPanel
```

### With verbose output

```bash
bash scripts/run-tests-docker.sh -- --verbose
```

### With coverage threshold enforcement

```bash
bash scripts/run-tests-docker.sh -- --coverage
```

### One-liner without the script

```bash
docker build -f Dockerfile.test -t pajussara_tui_comp-test . && \
docker run --rm -e CI=true pajussara_tui_comp-test
```

---

## Extracting coverage reports

By default, coverage output stays inside the container and is lost when `--rm` removes it. Mount the `coverage/` directory as a volume to persist it on the host:

```bash
docker run --rm \
  -e CI=true \
  -v "$(pwd)/coverage:/app/coverage" \
  pajussara_tui_comp-test \
  npm test -- --coverage
```

After the run, `./coverage/` on the host contains the full HTML and LCOV reports.

Or use the convenience script with coverage flag:

```bash
bash scripts/run-tests-docker.sh -- --coverage
# then open coverage/lcov-report/index.html
```

---

## CI/CD integration (GitHub Actions)

The workflow below builds the image, runs the tests, and optionally uploads the coverage report as an artifact.

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build test image
        run: |
          docker build \
            --cache-from type=gha \
            --cache-to type=gha,mode=max \
            -t test-image \
            -f Dockerfile.test \
            .

      - name: Run tests
        run: |
          docker run --rm \
            -e CI=true \
            -v "${{ github.workspace }}/coverage:/app/coverage" \
            test-image \
            npm test -- --coverage

      - name: Upload coverage report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
          retention-days: 7
```

**Key points:**
- `--cache-from / --cache-to type=gha` — uses GitHub Actions cache for Docker layers, dramatically reducing build time after the first run.
- `-v "${{ github.workspace }}/coverage:/app/coverage"` — extracts coverage from the container into the runner's workspace so the upload-artifact step can find it.
- `if: always()` on the upload step — uploads the report even when tests fail, which is when you need it most.

---

## Adapting to your project

Use this checklist when setting up Docker testing in a new project:

### 1. Choose the right Node image

Check `engines.node` in `package.json`. Match the major version:

```dockerfile
FROM node:20-alpine   # if engines.node >= 20
FROM node:18-alpine   # if engines.node >= 18
```

### 2. Decide on Alpine vs Debian

| Base | Image size | Use when |
|---|---|---|
| `node:22-alpine` | ~60 MB | No native binaries, or you can install build tools with `apk` |
| `node:22-slim` | ~200 MB | Need glibc (some native modules require it) |
| `node:22` | ~900 MB | Need full Debian toolchain |

### 3. Handle native dependencies

If any npm package compiles native code, include:

```dockerfile
RUN apk add --no-cache python3 make g++   # Alpine
# or
RUN apt-get install -y python3 make g++   # Debian
```

Common packages that need this: `bcrypt`, `sharp`, `canvas`, `node-gyp`-based packages.

### 4. ESM vs CJS

If your project uses `"type": "module"` in `package.json` (ES Modules):
- Ensure Jest is invoked with `node --experimental-vm-modules` (Node < 22) or use native ESM support (Node 22+).
- Use `jest.unstable_mockModule()` instead of `jest.mock()` for mocking ES modules (static imports cannot be intercepted by `jest.mock()` in ESM mode).
- Use dynamic `import()` in `beforeAll` for any module that depends on an ESM mock.

If your project is CJS (`require`-based):
- `jest.mock()` works as expected.
- No `--experimental-vm-modules` flag needed.

### 5. devDependencies

Tests almost always need devDependencies (Jest, testing libraries, TypeScript types). The `node:22-alpine` base image (and all official Node.js Docker images) ship with `NODE_ENV=production`, which causes `npm ci` to silently skip devDependencies. Override `NODE_ENV` **before** running `npm ci`:

```dockerfile
# Set NODE_ENV=test before npm ci so devDependencies are installed ✓
ENV NODE_ENV=test
RUN npm ci --ignore-scripts

# The node:22-alpine image sets NODE_ENV=production by default, which would
# skip devDependencies — do NOT rely on the default ✗
RUN npm ci --ignore-scripts   # ← missing ENV NODE_ENV override; devDeps skipped
```

### 6. Test command

Update the `CMD` to match your project's test script:

```dockerfile
CMD ["npm", "test"]                           # standard
CMD ["npx", "jest", "--passWithNoTests"]      # explicit Jest
CMD ["npx", "vitest", "run"]                  # Vitest
```

### 7. Update image name in the script

In `scripts/run-tests-docker.sh`, change:

```bash
IMAGE_NAME="your-project-name-test"
```

---

## Troubleshooting

### `Cannot find module 'react'` (or `'ink'`) when tests run inside Docker

**Cause:** The `node:22-alpine` base image (like all official Node.js Docker images) sets `NODE_ENV=production`. When `NODE_ENV=production`, `npm ci` silently skips `devDependencies` — so packages like `react`, `ink`, `jest`, and `ts-jest` are never installed inside the container, even though they appear in `package.json`.

**Fix:** Add `ENV NODE_ENV=test` in `Dockerfile.test` **before** the `npm ci` step:

```dockerfile
ENV NODE_ENV=test
RUN npm ci --ignore-scripts
```

---

### `Cannot find module 'promise-retry'` (or similar) during `npm install -g npm@latest`

**Cause:** The base image ships an npm that is internally broken or partially unpacked. Self-upgrading with `npm install -g npm@latest` causes it to fail.

**Fix:** Remove the `RUN npm install -g npm@latest` line entirely. The image's npm is sufficient for `npm ci`.

---

### `MODULE_NOT_FOUND` errors for project files inside the container

**Cause:** The module path in an import does not resolve inside the container. Often caused by `.js` extension mismatches (ESM requires explicit extensions).

**Fix:** Use explicit `.js` extensions in all relative imports (even when the source file is `.ts`):

```ts
import { foo } from './foo.js';         // ✓
import { foo } from './foo';            // ✗ in ESM
```

---

### `jest.mock()` has no effect (module not mocked in ESM projects)

**Cause:** In ESM mode (`"type": "module"`), static imports are evaluated before any JavaScript runs — including hoisted `jest.mock()` calls. The mock is registered too late.

**Fix:** Use `jest.unstable_mockModule()` with a dynamic import:

```ts
// 1. Register mock BEFORE importing the module that depends on it
jest.unstable_mockModule('./helpers/index.js', () => ({
  helperFn: () => 'mocked value',
}));

// 2. Use dynamic import (runs AFTER mock is registered)
let myModule: typeof import('./myModule.js');
beforeAll(async () => {
  myModule = await import('./myModule.js');
});
```

---

### `ReferenceError: You are trying to import a file after the Jest environment has been torn down`

**Cause:** A component with a timer (`setInterval` / `setTimeout`) was rendered but not explicitly unmounted before the test ended. When `jest.useRealTimers()` fires in `afterEach`, the still-live interval callback runs — and because the Jest VM context is already being torn down, any module access (including ESM imports captured in the closure) throws this error.

This affects Ink components that own an internal interval (e.g., a chronometer tick) when the test omits an explicit `unmount()` call.

**Fix:** Track the `unmount` function returned by `render()` and call it (inside `act()`) in `afterEach`, _before_ switching back to real timers:

```ts
describe('MyComponent', () => {
  let cleanup: (() => void) | null = null;

  beforeEach(() => {
    jest.useFakeTimers();
    cleanup = null;
  });

  afterEach(() => {
    jest.clearAllTimers();
    if (cleanup) {
      act(() => { cleanup!(); });
      cleanup = null;
    }
    jest.useRealTimers();
  });

  const renderMyComponent = (props = {}) => {
    const result = render(React.createElement(MyComponent, props));
    cleanup = result.unmount;   // ← register for afterEach cleanup
    return result;
  };
});
```

Wrapping `unmount()` in `act()` ensures React processes all pending state updates before the VM is torn down, preventing the "import after teardown" error.

---

### Tests time out or hang inside Docker

**Cause:** Tests that rely on network access, file watchers, or real timers may behave differently in the container environment.

**Fix:**
- Use `jest.useFakeTimers()` / `jest.useRealTimers()` in `beforeEach` / `afterEach`.
- Always call `unmount()` in `afterEach` for Ink components (see entry above).
- Add `--forceExit` to the Jest command if tests do not exit cleanly.
- Run with `--detectOpenHandles` to identify leaking resources:
  ```bash
  bash scripts/run-tests-docker.sh -- --detectOpenHandles
  ```

---

### `EACCES: permission denied` when mounting the coverage volume

**Cause:** The container runs as `root` and creates files owned by root; the host user cannot read them.

**Fix:** Add `--user "$(id -u):$(id -g)"` to the `docker run` command:

```bash
docker run --rm \
  -e CI=true \
  --user "$(id -u):$(id -g)" \
  -v "$(pwd)/coverage:/app/coverage" \
  pajussara_tui_comp-test \
  npm test -- --coverage
```

---

### Docker daemon is not running

**macOS / Windows:** Open Docker Desktop from the Applications menu or system tray.

**Linux:**

```bash
sudo systemctl start docker
# verify:
docker info
```

---

### Build context is very large (slow `docker build`)

**Cause:** Large directories (e.g., `node_modules/`, `.git/`, `dist/`) are being sent to the Docker daemon.

**Fix:** Ensure `.dockerignore` exists at the project root and includes at minimum:

```dockerignore
node_modules/
dist/
.git/
coverage/
```

Check the actual context size:

```bash
docker build -f Dockerfile.test . 2>&1 | head -5
# Sending build context to Docker daemon  XX.X MB  ← should be < 5 MB
```
