// Replace the complex import with a standard process.env check
import "dotenv/config";

// Export the config as a plain object. 
// Prisma CLI accepts this perfectly without needing 'defineConfig'
export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL,
  },
};