import { EmbedBuilder } from "discord.js";
import { prisma } from "../../database/client.js";
import { defineCommand } from "../../utils/defineCommand.js";
import { logger } from "../../utils/logger.js";
import { CONSTANTS } from "../../config/constants.js";

/** Update the progress embed every N members, so we don't hammer Discord's rate limits on large guilds. */
const UPDATE_INTERVAL = 10;

export default defineCommand({
  name: "sync",
  description: "Syncronise the Database with current users and guild.",
  cooldown: 3000,
  execute: async (ctx) => {
    await ctx.defer();

    const guild = ctx.guild;
    if (!guild) return;

    const members = await guild.members.fetch(); // full fetch, not cache
    const humanMembers = [...members.values()].filter((m) => !m.user.bot);
    const total = humanMembers.length;

    let synced = 0;
    let failed = 0;

    const progressEmbed = () =>
      new EmbedBuilder()
        .setTitle("🔄 Syncing members...")
        .setDescription(
          `Progress: **${synced + failed}/${total}**\n✅ Synced: ${synced}\n❌ Failed: ${failed}`,
        )
        .setColor(CONSTANTS.EMBED_COLOR)
        .setTimestamp();

    await ctx.reply({ embeds: [progressEmbed()] });

    for (const member of humanMembers) {
      try {
        const roleIds = member.roles.cache
          .filter((role) => role.id !== guild.id) // drop @everyone
          .map((role) => role.id);

        await prisma.user.upsert({
          where: { userId: member.id },
          update: { roles: roleIds, username: member.user.username },
          create: {
            userId: member.id,
            roles: roleIds,
            username: member.user.username,
          },
        });

        synced++;
      } catch (error) {
        failed++;
        logger.error(`Failed to sync member ${member.id}:`, error);
      }

      const processed = synced + failed;
      if (processed % UPDATE_INTERVAL === 0 || processed === total) {
        await ctx.editReply({ embeds: [progressEmbed()] });
      }
    }

    const resultEmbed =
      failed === 0
        ? new EmbedBuilder()
            .setTitle("✅ Sync complete")
            .setDescription(
              `Successfully synced **${synced}/${total}** members.`,
            )
            .setColor(CONSTANTS.EMBED_SUCCESS_COLOR)
            .setTimestamp()
        : new EmbedBuilder()
            .setTitle(
              synced === 0 ? "❌ Sync failed" : "⚠️ Sync completed with errors",
            )
            .setDescription(
              `✅ Synced: **${synced}/${total}**\n❌ Failed: **${failed}/${total}**\n\nCheck the logs for details on failed members.`,
            )
            .setColor(CONSTANTS.EMBED_ERROR_COLOR)
            .setTimestamp();

    await ctx.editReply({ embeds: [resultEmbed] });
  },
});
