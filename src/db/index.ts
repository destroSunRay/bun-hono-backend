import { drizzle } from 'drizzle-orm/node-postgres';

import env from '@/config/env';
import * as schema from './schema';
import { sql } from 'drizzle-orm';

// Create the database instance
export const db = drizzle(env.DATABASE_URL, {
  schema,
});

(async () => {
  const result = await db.execute(sql`SELECT 1 as connected;`);
  if (result && result.rows.length > 0 && result.rows[0].connected === 1) {
    console.log('Database connection successful!');
  } else {
    console.error('Database connection failed: Unexpected query result.');
  }
})();
