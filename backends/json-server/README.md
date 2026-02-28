# Бекенд json-server

Сервер для отладки: REST API (json-server) и JWT-авторизация (подсистема json-server-auth) без Nitro.

## Запуск

```bash
npm run dev:json-server
```

Сервер: **http://localhost:3002** (или `JSON_SERVER_PORT` из .env).

## Схема

- **db.json** — данные: `users`, `posts`.
- **routes.json** — права доступа (600 = только владелец, 664 = запись только для залогиненных).

## API (json-server-auth)

- **POST /register** (или /signup, /users) — регистрация: `{ "email": "...", "password": "..." }` → 201 `{ "accessToken": "jwt..." }`
- **POST /login** (или /signin) — вход: `{ "email": "...", "password": "..." }` → 200 `{ "accessToken": "jwt..." }`
- Защищённые ресурсы: заголовок `Authorization: Bearer <accessToken>`
- **GET/POST/PUT/PATCH/DELETE** для `/users`, `/posts` и т.д. по правилам из routes.json
