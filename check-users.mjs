import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const uri = process.env.MONGODB_URI || "mongodb+srv://sa798027:sa798027@cluster0.bgatlhp.mongodb.net/?appName=Cluster0";

mongoose.connect(uri).then(async () => {
  console.log("Connected to DB");
  const db = mongoose.connection.db;
  if (!db) { console.error("No db"); process.exit(1); }
  const users = await db.collection('users').find({}).toArray();
  console.log("USERS:");
  users.forEach(u => console.log(`- Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`));
  process.exit(0);
}).catch(console.error);
