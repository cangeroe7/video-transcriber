import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { env } from "~/env";

import * as schema from "./schema";

const sql = neon(env.DATABASE_URL_UNPOOLED);

export const db = drizzle(sql, { schema });
