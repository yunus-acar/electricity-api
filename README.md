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

## API Documentation

[Postman](https://blue-station-975199.postman.co/workspace/Polyline-Works~e9ca6997-7686-4710-a279-fd25fd84171c/collection/24319999-04d73af4-0e4a-4fd6-bc3c-b871e4626016?action=share&creator=24319999&active-environment=24319999-d46e9902-a809-4d48-acb7-3a60bac4765f)

## Contact

E-mail: me@yunusacar.dev

