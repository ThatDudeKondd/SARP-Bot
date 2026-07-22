import { Guild, PermissionsBitField } from "discord.js";
import { superAdminId } from "../../config/config";
import { defineCommand } from "../../utils/defineCommand";
import { prisma } from "../../database/client";
import { logger } from "../../utils/logger";

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
      if (!isSuperAdmin || !isAdmin) {
        throw new Error(
          "Only a server administrator or the super admin can run setup.",
        );
      }

      const guildConfig = await prisma.guildConfig.findUnique({
        where: { guildId },
      });

      logger.info(guildConfig);
    } catch (e) {}
  },
});
