# LevelUp Life PWA

Gamified personal tracking app to level up every area of your life.

## Secciones

| Tab | Contenido |
|-----|-----------|
| Inicio | Dashboard, versículo del día, peso, calorías, rutina, horario |
| Hábitos | 8 hábitos diarios, racha, rutina de ejercicio |
| Comida | Tracker de calorías, recetas paso a paso |
| Metas | 6 áreas de vida, tracker de deudas, plan de lectura |
| Más | Rutina semanal, ideas de ingresos, hitos mensuales |

## Stack

- HTML + CSS + JavaScript (vanilla)
- LocalStorage para datos
- Service Worker para offline
- PWA instalable

## Desarrollo local

```bash
# Abrir en navegador
open index.html

# O con servidor local (recomendado para PWA)
npx serve .
```

## CI/CD

- **CI**: Validación de JSON, lint JS, check PWA en cada PR
- **Deploy**: Automático a Netlify en cada push a `main`
- **Release**: Crear tag `v1.x.x` para release con deploy production

## Cómo contribuir

1. Crear un branch: `git checkout -b feature/mi-mejora`
2. Hacer cambios y commit: `git commit -m "feat: descripción"`
3. Push: `git push origin feature/mi-mejora`
4. Crear Pull Request

## Convención de commits

```
feat: nueva funcionalidad
fix: corrección de bug
content: nuevo contenido (recetas, versos, etc.)
style: cambios visuales
refactor: refactorización
ci: cambios en CI/CD
docs: documentación
```
