# Werto project (Vite + React Router)

This project is built on **Vite + React 18 + TypeScript + React Router v6 + Zustand**.
Tailwind runs in CDN mode — no build step is needed.

## Run locally

```bash
npm install
npm run dev
```

In the browser: http://localhost:5173

## Structure

```
index.html              Tailwind CDN + the Inter font
src/main.tsx            entry point
src/App.tsx             BrowserRouter + every Route
src/pages/              one file per page
src/components/layout/  Navbar, Footer
src/lib/mockData.ts     mock data
src/store/              Zustand global state
```

## Rules

- Imports are **relative** (`../components/layout/Navbar`); the `@/` alias is not used.
- Allowed packages: `react`, `react-dom`, `react-router-dom`, `zustand`,
  `lucide-react`. No other package is installed.
- Images: `https://picsum.photos/seed/<word>/<w>/<h>`.
