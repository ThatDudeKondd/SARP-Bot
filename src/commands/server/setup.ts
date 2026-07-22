import { PermissionsBitField } from "discord.js";
import { superAdminId } from "../../config/config.js";
import { defineCommand } from "../../utils/defineCommand.js";
import { prisma } from "../../database/client.js";
import { logger } from "../../utils/logger.js";

export default defineCommand({
  name: "setup",
  description: "Setup the server's configuration",
  category: "server",
  cooldown: 5000,
  execute: async (ctx) => {
    try {
      if (!ctx.guild) {
        throw new Error("Setup must be run inside a guild.");
      }

      const isSuperAdmin = ctx.user.id === superAdminId;
      const isAdmin = ctx.member?.permissions?.has(
        PermissionsBitField.Flags.Administrator,
      );
      if (!isSuperAdmin && !isAdmin) {
        throw new Error(
          "Only a server administrator or the super admin can run setup.",
        );
      }

      const guildConfig = await prisma.guildConfig.findUnique({
        where: { guildId: ctx.guild.id },
        include: {
          directiveRoles,
          seniorHrRoles,
          managementRoles,
          supervisorRoles,
          administratorRoles,
          moderatorRoles,
        },
      });

      logger.info("Guild config:", guildConfig);
    } catch (e) {
      logger.error("Setup command failed:", e);
      await ctx.reply("❌ Something went wrong running setup.").catch(() => {});
    }
  },
});
