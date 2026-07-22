import { Message } from "discord.js";
import { logger } from "../utils/logger.js";
import { checkCooldown } from "../middleware/cooldown.js";
import { GuildConfigService } from "../services/GuildConfigService.js";
import { Command } from "../types/Command.js";
import { CONSTANTS } from "../config/constants.js";

export async function onMessageCreate(
  message: Message,
  commands: Map<string, Command>,
) {
  // Ignore bot messages
  if (message.author.bot) return;

  // Get guild config for custom prefix
  let prefix: string = CONSTANTS.PREFIX;
  if (message.guild) {
    try {
      prefix = await GuildConfigService.getPrefix(message.guild.id);
    } catch (error) {
      logger.warn(
        `Failed to get prefix for guild ${message.guild.id}, using default`,
      );
    }
  }

  // Check if message starts with prefix
  if (!message.content.startsWith(prefix)) return;

  // Parse command and arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();

  if (!commandName) return;

  const command = commands.get(commandName);

  if (!command) {
    // Optional: reply to unknown command
    // await message.reply("❌ Unknown command");
    return;
  }

  try {
    // Check cooldown
    const cooldownMs = command.cooldown || 3000;
    const canExecute = await checkCooldown(message, commandName, cooldownMs);

    if (!canExecute) return;

    logger.info(
      `📝 Executing prefix command: ${commandName} by ${message.author.tag}`,
    );
    await command.execute(message, args);
  } catch (error) {
    logger.error(`Error executing command ${commandName}:`, error);
    await message
      .reply("❌ An error occurred while executing the command")
      .catch(() => {});
  }
}
