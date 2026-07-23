import { prisma } from "../../database/client.js";
import { SubCommand } from "../../types/UnifiedCommand.js";
import { logger } from "../../utils/logger.js";

export default {
  name: "run",
  description: "Setup the server's configuration",
  execute: async (ctx) => {
    await ctx.defer();

    const guildConfig = await prisma.guildConfig.findUniqueOrThrow({
      where: { guildId: ctx.guild?.id },
    });

    const isSuperAdmin = ctx.user.id === process.env.SUPER_ADMIN_ID;

    const canRunRoles = [
      ...(guildConfig.directiveRoles || []),
      ...(guildConfig.seniorHrRoles || []),
      ...(guildConfig.managementRoles || []),
      ...(guildConfig.supervisorRoles || []),
    ];

    const hasRunPerms =
      isSuperAdmin ||
      ctx.member?.roles?.cache.some((role) => canRunRoles.includes(role.id));

    logger.info(
      `Is Super Admin: ${isSuperAdmin}, can run roles ${canRunRoles}, has run perms ${hasRunPerms}`,
    );

    await ctx.editReply({
      content: `Is Super Admin: ${isSuperAdmin}, can run roles ${canRunRoles}, has run perms ${hasRunPerms}`,
    });
  },
} satisfies SubCommand;
