FROM node:18.17-alpine
LABEL authors="yunus-acar"

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma ./prisma

RUN yarn install --frozen-lockfile
RUN yarn prisma generate

COPY . .

RUN yarn build

EXPOSE 4000

CMD ["yarn", "start"]