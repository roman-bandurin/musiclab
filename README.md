# MusicLab

Веб-приложение для прослушивания музыки: каталог треков, плейлисты, фильтрация по исполнителю / жанру / году, плеер с управлением воспроизведением, избранное, авторизация и регистрация, переключение светлой/тёмной темы.

## Быстрый старт

```bash
npm install
npm run dev
```

## Скрипты

| Команда           | Описание                                  |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Запуск dev-сервера (Vite)                 |
| `npm run build`   | Сборка проекта (TypeScript + Vite)        |
| `npm run preview` | Превью production-сборки                  |
| `npm run lint`    | Проверка кода линтером (ESLint)           |
| `npm run lint:fix`| Автоисправление ошибок линтера            |

## Стек

Vite 8 + React 19 SWC + TypeScript 5.9

## Git хуки

Проект использует **husky**, **lint-staged** и **commitlint** для автоматической проверки кода перед коммитом:

- **pre-commit**: автоматически запускает ESLint на изменённых файлах (только staged)
- **commit-msg**: проверяет формат сообщения коммита по [Conventional Commits](https://www.conventionalcommits.org/)

### Формат коммитов

| Тип       | Описание                                  | Пример                                    |
| --------- | ----------------------------------------- | ----------------------------------------- |
| `feat`    | Новая функциональность                    | `feat(player): add volume control`        |
| `fix`     | Исправление бага                          | `fix(auth): handle empty password`        |
| `docs`    | Документация                              | `docs(readme): add git hooks section`     |
| `style`   | Форматирование (не CSS!)                  | `style(eslint): fix indentation`          |
| `refactor`| Рефакторинг без изменения поведения       | `refactor(player): extract volume logic`  |
| `perf`    | Улучшение производительности              | `perf(tracks): optimize list rendering`   |
| `test`    | Тесты                                     | `test(auth): add login validation`        |
| `chore`   | Обслуживание (deps, configs)              | `chore(deps): update vite to 8.0.1`       |
| `ci`      | CI/CD                                     | `ci(github): add lint workflow`           |
| `revert`  | Откат коммита                             | `revert: "feat(player): add volume"`      |

**Обход хуков** (только в крайнем случае):
```bash
git commit --no-verify -m "message"
```
