---
name: levelup-life-dev
description: Use when working on the LevelUp Life PWA project. Covers adding features, fixing bugs, updating content (recipes, verses, exercises, books), modifying UI/UX, and managing CI/CD. Trigger on mentions of "LevelUp", "mi-transformacion", "levelup-life", or when editing files in the mi-transformacion project directory.
---

# LevelUp Life - Development Guide

## Project Overview

LevelUp Life is a gamified personal growth PWA (Progressive Web App). It tracks habits, weight, meals, goals, debts, exercise routines, and Bible verses across 5 tabs.

**Location:** `/Users/aleja/Documents/mi-transformacion/`

**Live URL:** https://fabulous-vacherin-b0f768.netlify.app

**GitHub:** https://github.com/AlejaMundo30/levelup-life

## Tech Stack

- **Pure HTML + CSS + JavaScript** (no frameworks, no build step)
- **LocalStorage** for data persistence (prefix: `lvl_`)
- **Service Worker** for offline support and update notifications
- **PWA** installable on mobile devices
- **Netlify** for hosting (auto-deploy from GitHub `main` branch)

## File Structure

```
mi-transformacion/
├── index.html              # Main entry point, nav, layout
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker (cache + update strategy)
├── netlify.toml            # Netlify config (headers, redirects)
├── css/
│   └── styles.css          # All styles (dark/light theme via data-theme attribute)
├── js/
│   ├── storage.js          # Storage abstraction (localStorage with lvl_ prefix)
│   ├── app.js              # Main app: routing, init, all tab renderers, schedule data
│   ├── habits.js           # Habit tracker (8 habits, streak counter)
│   ├── weight.js           # Weight log + canvas chart rendering
│   ├── meals.js            # Calorie tracker + recipe renderer
│   ├── goals.js            # 6 life areas with checklist items
│   ├── debt.js             # Debt tracker (27M + 2M COP)
│   ├── verse.js            # Daily verse from verses.json
│   └── routine.js          # Exercise routine from exercises.json
├── data/
│   ├── recipes.json        # 6 recipes (id, nombre, ingredientes, pasos, calorias, proteina)
│   ├── verses.json         # 120+ Bible verses
│   ├── exercises.json      # 7-day exercise routine (Lunes-Domingo)
│   └── books.json          # 12-month + 6 extra book recommendations
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── .github/
    ├── workflows/
    │   ├── ci.yml           # CI: JSON validation, PWA checks, HTML structure
    │   ├── deploy.yml       # Auto-deploy to Netlify on push to main
    │   └── release.yml      # Auto-release on version tags (v1.x.x)
    ├── ISSUE_TEMPLATE/      # Feature, bug, content templates
    └── pull_request_template.md
```

## Architecture Pattern

Each module (habits, weight, meals, etc.) follows this pattern:

```javascript
const ModuleName = {
  render() {
    // Returns HTML string
    // Reads from Storage.get()
  },
  someAction() {
    // Writes to Storage.set()
    // Calls App.refresh() to re-render
  }
};
```

`App.refresh()` re-renders the current tab by calling the appropriate render method.

## Key Conventions

### Data Storage
- All keys prefixed with `lvl_` in localStorage
- Daily data uses date-based keys: `lvl_habits_2025-06-04`
- Persistent data uses fixed keys: `lvl_goals`, `lvl_debt`, `lvl_theme`

### Adding a New Habit
In `js/habits.js`, add to `HABITS_DEF` array:
```javascript
{ key: 'new_habit', name: 'Name', desc: 'Description', emoji: '🔥' }
```
Also add the key with default `false` in `storage.js` → `getHabits()`.

### Adding a New Recipe
In `data/recipes.json`, append:
```json
{
  "id": "recipe-id",
  "nombre": "Recipe Name",
  "tiempo": "10 min",
  "calorias": 300,
  "proteina": 20,
  "dificultad": "Fácil",
  "categoria": "almuerzo",
  "ingredientes": ["item1", "item2"],
  "pasos": ["step1", "step2"]
}
```

### Adding a New Verse
Append to `data/verses.json` array. Format: `"Quote text - Book Chapter:Verse"`

### Adding a New Book
In `data/books.json`, append. Use `mes` number (1-12) for plan, or `"extra-N"` for extras.

### Adding a New Exercise Day
In `data/exercises.json`. Day names must match Spanish: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo.

### Adding a New Goal Area
In `js/goals.js`, add to `GOALS_DEF` object with emoji, name, color, and items array. Also add the key in `storage.js` → `getGoals()`.

### Theme
- Dark mode: default (`data-theme="dark"`)
- Light mode: `data-theme="light"`
- CSS uses CSS custom properties (`var(--bg)`, `var(--text)`, etc.)
- Toggle via header button, stored in `lvl_theme`

### Service Worker Updates
- When modifying files, bump `CACHE_NAME` in `sw.js` (e.g., `levelup-life-v3`)
- The app shows an update banner when a new SW is detected
- User taps "Actualizar" to apply

## CI/CD Flow

1. Push to `main` → GitHub Actions runs CI + Deploy
2. CI validates JSON, checks PWA requirements, validates HTML structure
3. Deploy uses Netlify CLI to push to production
4. To create a release: `git tag v1.x.x && git push origin v1.x.x`

## Commit Convention

```
feat: new feature
fix: bug fix
content: new content (recipes, verses, exercises, books)
style: UI/visual changes
refactor: code refactoring
ci: CI/CD changes
docs: documentation
```

## Common Tasks

### Test locally
```bash
open /Users/aleja/Documents/mi-transformacion/index.html
# or
npx serve /Users/aleja/Documents/mi-transformacion
```

### Deploy a change
```bash
cd /Users/aleja/Documents/mi-transformacion
git add -A
git commit -m "feat: description of change"
git push origin main
```

### Create a release
```bash
git tag v1.1.0
git push origin v1.1.0
```

### Update Netlify secrets
```bash
echo "NEW_TOKEN" | gh secret set NETLIFY_AUTH_TOKEN
echo "NEW_SITE_ID" | gh secret set NETLIFY_SITE_ID
```

## User Context

- **Name:** Aleja
- **Location:** Medellín, Colombia
- **Age:** 32
- **Career:** Software Engineering student (semester 8)
- **Role:** Tech Lead
- **Married:** Yes
- **Goals:** Weight loss (76→58kg), learn English, graduate, pay debts, grow spiritually, become tech expert
- **App language:** Spanish UI, English name
