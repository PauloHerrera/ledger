import dotenv from "dotenv";

dotenv.config();

interface Environment {
  PORT: number;
  ADMIN_URL: string;
  NODE_ENV: "development" | "production" | "test";
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  DATABASE_URL: string;
}

const getEnvVar = (name: string, required = true): string => {
  const value = process.env[name];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || "";
};

export const env: Environment = {
  SUPABASE_URL: getEnvVar("SUPABASE_URL"),
  ADMIN_URL: getEnvVar("ADMIN_URL"),
  SUPABASE_ANON_KEY: getEnvVar("SUPABASE_ANON_KEY"),
  SUPABASE_SERVICE_ROLE_KEY: getEnvVar("SUPABASE_SERVICE_ROLE_KEY"),
  DATABASE_URL: getEnvVar("DATABASE_URL"),
  PORT: parseInt(getEnvVar("PORT", false) || "3000"),
  NODE_ENV: (process.env.NODE_ENV as Environment["NODE_ENV"]) || "development",
};
