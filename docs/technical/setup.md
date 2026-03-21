# Setup

## Prerequisites

- **Node.js** — v18 LTS or later (`node -v` to check)
- **npm** — Included with Node.js (`npm -v` to check)

## Install Dependencies

```bash
npm install
```

## Environment Configuration

The app requires a media provider API access token to fetch movie and TV data.

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/signup).
2. Go to **Settings → API** in your account dashboard.
3. Copy the **API Read Access Token** (not the API Key).
4. Create a `.env` file in the project root:

```env
VITE_MEDIA_PROVIDER_TOKEN=your_media_provider_read_access_token_here
```

The `VITE_` prefix is required — Vite only exposes environment variables with this prefix to client-side code.

`src/env.d.ts` declares `ImportMetaEnv` with `VITE_MEDIA_PROVIDER_TOKEN: string` so the token is typed when accessed via `import.meta.env.VITE_MEDIA_PROVIDER_TOKEN`.

## TypeScript Configuration

The project uses three tsconfig files with project references:

- **`tsconfig.json`** — Root config with project references to `tsconfig.app.json` and `tsconfig.node.json`.
- **`tsconfig.app.json`** — App source code. `strict: true`, `target: "ES2022"`, `module: "ESNext"`, `moduleResolution: "bundler"`, path alias `@/* → ./src/*`, `include: ["src/**/*"]`.
- **`tsconfig.node.json`** — Tooling config files. Covers `vite.config.ts`, `vitest.config.ts`, `eslint.config.js`.

## Commands

| Command                | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Start the Vite dev server with hot module reload |
| `npm run build`        | Production build to `dist/`                      |
| `npm run preview`      | Preview the production build locally             |
| `npm run lint`         | Run ESLint across the project                    |
| `npm run lint:fix`     | Run ESLint with auto-fix                         |
| `npm run format`       | Format all files with Prettier                   |
| `npm run format:check` | Check formatting without writing changes         |
| `npm run test`         | Run Vitest test suite                            |
| `npm run test:coverage`| Run Vitest with coverage report                  |
| `npm run type-check`   | Run `vue-tsc` for TypeScript type checking       |

## Editor Setup

### VS Code

`.vscode/settings.json` configures:

- Format on save (Prettier)
- ESLint auto-fix on save
- Tailwind CSS IntelliSense
