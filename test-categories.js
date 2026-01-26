import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// Usage: node test-categories.js [startId] [endId]
// If no arguments provided, defaults to 4000-4300
import { checkAllCategoryProducts } from "./src/lib/api-checker.ts";

const startId =
  process.argv[2] !== undefined ? parseInt(process.argv[2]) : 4000;
const endId = process.argv[3] !== undefined ? parseInt(process.argv[3]) : 4300;

console.log(`Starting test with range: ${startId} to ${endId}`);

checkAllCategoryProducts(startId, endId);
