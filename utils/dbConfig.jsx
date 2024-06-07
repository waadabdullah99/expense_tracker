import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'
const sql = neon('postgresql://tracker_owner:NY8JRyQkn5jr@ep-damp-cake-a5dsqvdx.us-east-2.aws.neon.tech/tracker?sslmode=require');
export const db = drizzle(sql,{schema});