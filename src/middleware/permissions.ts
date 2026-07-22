import { Message, PermissionResolvable } from "discord.js";
import { logger } from "../utils/logger.js";

export function requirePermissions(...permissions: PermissionResolvable[]) {
  return async (message: Message) => {
    if (!message.member) {
      logger.warn("Could not check permissions: member not found");
      return false;
    }

    const hasPermissions = message.member.permissions.has(permissions);

    if (!hasPermissions) {
      logger.warn(
        `User ${message.author.tag} attempted to use restricted command`,
      );
      await message.reply("❌ You do not have permission to use this command.");
    }

    return hasPermissions;
  };
}
