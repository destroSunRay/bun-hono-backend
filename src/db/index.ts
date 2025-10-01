import { drizzle } from "drizzle-orm/node-postgres";

import env from "@/config/env";
import * as schema from "./schema";

// Create the database instance
export const db = drizzle(env.DATABASE_URL, {
  schema,
});
