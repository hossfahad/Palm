import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const [protocol, rest] = connectionString.split('://');
const [credentials, hostAndDb] = rest.split('@');
const [username, password] = credentials.split(':');
const [hostAndPort, database] = hostAndDb.split('/');
const [host, port] = hostAndPort.split(':');

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host,
    port: parseInt(port),
    user: username,
    password,
    database,
    ssl: true,
  },
} satisfies Config; 