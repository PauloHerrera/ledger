import { defineConfig } from "drizzle-kit";
import { env } from "./src/config/env";

export default defineConfig({
  schema: "./src/infrastructure/db/schemas/*.ts",
  out: "./src/infrastructure/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});