# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Documentation-First Approach

**ALWAYS refer to the relevant documentation files in the `/docs` directory BEFORE generating any code.**

When implementing features, fixing bugs, or making any code changes:
1. Check if there is relevant documentation in `/docs` for the technology, library, or pattern you're working with
2. Read and follow the guidelines, best practices, and examples from those docs
3. Ensure your generated code aligns with the patterns and recommendations in the documentation
4. If no relevant docs exist, use standard best practices for the technology stack

The `/docs` directory contains project-specific documentation and guidelines that should be your primary reference for code generation:
- /docs/ui.md
- /docs/data-fetching.md

## Project Overview

This is a Next.js 16 application built with TypeScript, React 19, and Tailwind CSS 4. The project uses the Next.js App Router architecture.

## Development Commands

### Running the Development Server
```bash
npm run dev
```
The app runs at http://localhost:3000

### Building for Production
```bash
npm run build
```

### Starting Production Server
```bash
npm start
```

### Linting
```bash
npm run lint
```

## Code Architecture

### App Router Structure
- Uses Next.js App Router (app directory)
- `app/layout.tsx` - Root layout with Geist font configuration
- `app/page.tsx` - Home page component
- `app/globals.css` - Global Tailwind CSS styles

### TypeScript Configuration
- Strict mode enabled
- Path alias: `@/*` maps to project root
- JSX: `react-jsx` (new JSX transform)
- Module resolution: `bundler`

### Styling
- Tailwind CSS 4 with PostCSS
- Custom fonts: Geist Sans and Geist Mono via `next/font/google`
- Dark mode support via Tailwind's `dark:` classes

### ESLint Configuration
- Uses Next.js ESLint config for both core web vitals and TypeScript
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`
- Configuration in `eslint.config.mjs` using flat config format

## Key Dependencies
- Next.js 16.1.1
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
