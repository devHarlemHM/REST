import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

// Función para parsear DATABASE_URL o usar variables individuales
function getDatabaseConfig() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }

  const url = new URL(databaseUrl);
  return {
    host: url.hostname,
    port: parseInt(url.port),
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1),
  };
}

// Create PostgreSQL connection pool
const pool = new Pool(getDatabaseConfig());

// Create Drizzle instance with our schema
export const db = drizzle(pool, { schema });

// Export schema for use elsewhere
export { schema };
