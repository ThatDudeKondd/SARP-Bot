import { Message, ChatInputCommandInteraction } from "discord.js";
import { logger } from "../utils/logger.js";
import { checkCooldown } from "../middleware/cooldown.js";
import { GuildConfigService } from "../services/GuildConfigService.js";
import { Command, CommandContext } from "../types/Command.js";
import { CONSTANTS } from "../config/constants.js";

export class CommandHandler {
  /**
   * Handle prefix commands from messages
   */
  static async handlePrefixCommand(
    message: Message,
    commands: Map<string, Command>,
  ): Promise<void> {
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
      return;
    }

    await this.executeCommand(message, command, commandName, args);
  }

  /**
   * Handle slash commands from interactions
   */
  static async handleSlashCommand(
    interaction: ChatInputCommandInteraction,
    commands: Map<string, Command>,
  ): Promise<void> {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);

    if (!command) {
      logger.warn(`Slash command not found: ${interaction.commandName}`);
      await interaction
        .reply({
          content: "❌ This command is not available",
          ephemeral: true,
        })
        .catch(() => {});
      return;
    }

    await this.executeCommand(
      interaction,
      command,
      interaction.commandName,
      [],
    );
  }

  /**
   * Unified command execution handler
   */
  private static async executeCommand(
    context: CommandContext,
    command: Command,
    commandName: string,
    args: string[],
  ): Promise<void> {
    try {
      // Check cooldown
      const cooldownMs = command.cooldown || 3000;
      const canExecute = await checkCooldown(context, commandName, cooldownMs);

      if (!canExecute) return;

      const isMessage = context instanceof Message;
      const userTag = isMessage ? context.author.tag : context.user.tag;
      const commandType = isMessage ? "prefix" : "slash";
      const commandDisplay = isMessage
        ? `${CONSTANTS.PREFIX}${commandName}`
        : `/${commandName}`;

      logger.info(
        `📝 Executing ${commandType} command: ${commandDisplay} by ${userTag}`,
      );

      await command.execute(context, args);
    } catch (error) {
      logger.error(`Error executing command ${commandName}:`, error);

      if (context instanceof Message) {
        await context
          .reply("❌ An error occurred while executing the command")
          .catch(() => {});
      } else if (context.isChatInputCommand()) {
        await context
          .reply({
            content: "❌ An error occurred while executing the command",
            ephemeral: true,
          })
          .catch(() => {});
      }
    }
  }
}
