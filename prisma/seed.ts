import { prisma } from "../src/database/client";

async function main() {
  console.log("🌱 Seeding database...");

  // Example: Create default guild config
  const guildConfig = await prisma.guildConfig.upsert({
    where: { guildId: "example_guild_id" },
    update: {},
    create: {
      guildId: "example_guild_id",
      prefix: "!",
      modLogChannelId: null,
    },
  });

  console.log("✅ Seeded guild config:", guildConfig);

  // Example: Create test user
  const user = await prisma.user.upsert({
    where: { userId: "test_user_id" },
    update: {},
    create: {
      userId: "test_user_id",
      infractions: 0,
      warnings: 0,
    },
  });

  console.log("✅ Seeded test user:", user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("✅ Seeding complete!");
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
