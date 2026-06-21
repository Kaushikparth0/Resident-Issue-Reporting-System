import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function main() {
  console.log("Seeding database...");

  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const residentPasswordHash = await bcrypt.hash("resident123", 10);

  // Clean existing data
  await db.delete(schema.comments);
  await db.delete(schema.issues);
  await db.delete(schema.users);

  // Create Admin
  const [admin] = await db.insert(schema.users).values({
    name: "System Admin",
    email: "admin@example.com",
    passwordHash: adminPasswordHash,
    role: "admin",
  }).returning();

  // Create Resident
  const [resident] = await db.insert(schema.users).values({
    name: "John Resident",
    email: "resident@example.com",
    passwordHash: residentPasswordHash,
    role: "resident",
  }).returning();

  // Create Sample Issues
  await db.insert(schema.issues).values([
    {
      title: "Broken elevator in Block A",
      description: "The main elevator in Block A has been stuck since this morning. Needs urgent repair.",
      category: "Maintenance",
      status: "pending",
      residentId: resident.id,
    },
    {
      title: "Street light flickering",
      description: "The street light near the playground is flickering and making a buzzing noise.",
      category: "Electrical",
      status: "in-progress",
      residentId: resident.id,
    }
  ]);

  console.log("Seeding completed successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
