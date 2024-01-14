declare namespace NodeJS {
  export interface ProcessEnv extends NodeJS.ProcessEnv {
    PORT?: string;
    NODE_ENV: "development" | "production";
    JWT_SECRET_KEY: string;
    JWT_ACCESS_TOKEN_EXPIRES: string;
    JWT_REFRESH_TOKEN_EXPIRES: string;
    REDIS_PORT: string;
    REDIS_HOST: string;
    REDIS_PASSWORD: string;
    REDIS_USERNAME: string;
  }
}
