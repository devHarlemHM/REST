import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required. Define it in the root .env file.');
}

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    // drizzle-kit soporta connectionString para driver 'pg'
    connectionString: databaseUrl,
  },
} satisfies Config;
