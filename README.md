# Electricity Index API

This project includes a REST API that calculates energy consumption based on data from meters.

## Installation

1. Clone the repo
   ```bash
   git clone git@github.com:yunus-acar/electricity-api.git
   ```

2. Go to the project directory
   ```bash
   cd electricity-api
   ```

3. Copy `.env.example` to `.env.prod` and `.env`
   ```bash
       cp .env.example .env.prod && cp .env.example .env
   ```
4. Start the production with docker
      ```bash
      POSTGRES_USER=postgres POSTGRES_PASSWORD=postgres REDIS_PASSWORD=redis docker-compose up -d
      ```
   4.1. Ps: Docker Compose Hot Reload does not implemented (no need for case, volume binding can solve this issue)

5. Load the database schema
   ```bash
   yarn push
   ```

## Technologies

- Express.js
- Prisma Orm
- Redis
- Postgres SQL
- TypeScript

## Contact

E-mail: me@yunusacar.dev

