# MusicLab

Веб-приложение для прослушивания музыки: каталог треков, плейлисты, фильтрация по исполнителю / жанру / году, плеер с управлением воспроизведением, избранное, авторизация и регистрация, переключение светлой/тёмной темы.

## Быстрый старт

```bash
nvm use $(cat .nvmrc)
npm install
npm run dev
```

## Скрипты

| Команда           | Описание                                  |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Запуск dev-сервера                        |
| `npm run build`   | Сборка проекта                            |
| `npm run preview` | Превью production-сборки                  |

## Запуск в Docker

Из корня репозитория:

```bash
docker compose up --build
```

Приложение будет доступно на http://localhost:8080.

Чтобы собирать образ с той же мажорной версией Node, что и в `.nvmrc`:

```bash
NODE_VERSION=$(cat .nvmrc | cut -d. -f1) docker compose up --build
```

## Git хуки

- **pre-commit**: автоматически запускает ESLint на изменённых файлах (только staged)
- **commit-msg**: проверяет формат сообщения коммита по commitlint.config.js

## Бекенды

| Команда                                      | Описание                    |
| -------------------------------------------- | --------------------------- |
| `npm run dev -w backends/nitro`              | Запуск Nitro dev-сервера    |
| `npm run build -w backends/nitro`            | Сборка Nitro                |
| `npm run dev -w backends/json-server`        | Запуск json-server          |
