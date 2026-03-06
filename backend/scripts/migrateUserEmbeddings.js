//not worked not migrated

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/user.model.js";
import generateEmbeddings from "../utils/Embeddings.js";

/**
 * Build rich natural-language profile text
 * (this is what makes embeddings GOOD)
 */
function buildProfileText(user){
    return   `bio : ${user.bio}
    skills : ${user.skills.join(", ")}`
}

/**
 * Check if embeddings are invalid
 */
function isInvalidEmbedding(embeddings) {
  return (
    !embeddings ||
    !Array.isArray(embeddings) ||
    embeddings.length !== 768
  );
}

async function migrate() {
  console.log("🔌 Connecting to DB...");
  await mongoose.connect(process.env.MONGODB_URI);

  console.log("🔍 Finding users with invalid embeddings...");

  const users = await User.find({
    $or: [
      { embeddings: { $exists: false } },
      { embeddings: null },
      { embeddings: { $size: 0 } },
      { embeddings: { $not: { $size: 768 } } }
    ]
  });

  console.log(`🧨 Found ${users.length} users to migrate`);

  let success = 0;
  let failed = 0;

  for (const user of users) {
    try {
      const text = buildProfileText(user);

      // Skip users with literally no usable data
      if (!text.trim()) {
        console.log(`⚠️ Skipping empty profile: ${user._id}`);
        failed++;
        continue;
      }

      const embedding = await generateEmbeddings(text);

      await User.updateOne(
        { _id: user._id },
        { embeddings: embedding }
      );

      success++;

      console.log(`✅ Updated: ${user.fullName || user._id}`);
    } catch (err) {
      failed++;
      console.error(`❌ Failed for user ${user._id}`, err.message);
    }
  }

  console.log("🎉 Migration complete");
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);

  await mongoose.disconnect();
  process.exit(0);
}

migrate();
