import { prisma } from "./db";
import { readFileSync } from "fs";
import { join } from "path";

const sql = readFileSync(join(__dirname, "../baseline.sql"), "utf-8");

const statements = sql
  .split(";")
  .map(s => s.trim())
  .filter(s => s.length > 0);

for (const statement of statements) {
   try {
    await prisma.$executeRawUnsafe(statement);
    console.log("✅ OK:", statement.slice(0, 60))
  } catch (e: any) {
    if (e.message?.includes("already exists")) {
      console.log("⏭ Skip (sudah ada):", statement.slice(0, 60))
    } else {
      throw e 
    }
  }
}
 
await prisma.$disconnect();
console.log("🎉 Migrate selesai!")