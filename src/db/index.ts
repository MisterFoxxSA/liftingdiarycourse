import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Create Neon HTTP connection
const sql = neon(process.env.DATABASE_URL!);

// Export Drizzle instance with schema for typed queries
export const db = drizzle(sql, { schema });
