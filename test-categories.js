import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// Usage: node test-categories.js [startId] [endId]
import { checkAllCategoryProducts } from "./src/lib/api-checker.ts";

const startId = parseInt(process.argv[2]);
const endId = parseInt(process.argv[3]);

checkAllCategoryProducts(startId, endId);
