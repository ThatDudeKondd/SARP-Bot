import { Message } from "discord.js";
import { CommandHandler } from "../services/CommandHandler.js";
import { UnifiedCommand } from "../types/UnifiedCommand.js";

export async function onMessageCreate(
  message: Message,
  commands: Map<string, UnifiedCommand>,
  aliases: Map<string, UnifiedCommand>,
) {
  await CommandHandler.handlePrefixCommand(message, commands, aliases);
}
