# 🎵 Lyrifix API

Fix the Lyrics. Feel the Music. Lyrifix is your all-in-one global lyrics platform — made for music lovers, lyric hunters, and community contributors.

Lyrifix API is the backend of Lyrifix.com.

Read the complete explanation on the main repo: <https://github.com/lyrifix/lyrifix>

## REST API Specification

- Production: `https://api.lyrifix.com`
- Local: `http://localhost:3000`

Songs:

| Endpoint       | HTTP     | Description       |
| -------------- | -------- | ----------------- |
| `/songs`       | `GET`    | Get all songs     |
| `/songs/:slug` | `GET`    | Get song by slug  |
| `/songs`       | `POST`   | Add new song      |
| `/songs/:id`   | `DELETE` | Delete song by id |
| `/songs/:id`   | `PUT`    | Update song by id |

Auth:

| Endpoint           | HTTP     | Permission    |
| ------------------ | -------- | ------------- |
| `/users`           | `GET`    | Public        |
| `/users/:username` | `GET`    | Public        |
| `/auth/register`   | `POST`   | Public        |
| `/auth/login`      | `POST`   | Public        |
| `/auth/me`         | `GET`    | Authenticated |
| `/auth/logout`     | `POST`   | Authenticated |

## Getting Started

### Installation

Install the dependencies:

```bash
bun install
```

### Development

Setup database:

Copy and edit `.env` file:

```bash
bun docker:up
```

Generate Prisma Client and migrate database:

```bash
bun db:gen
```

```bash
bun db:migrate
```

Seed initial songs:

```bash
bun db:seed
```

Start the development server:

```bash
bun dev
```

Your application will be available at `http://localhost:3000`.
