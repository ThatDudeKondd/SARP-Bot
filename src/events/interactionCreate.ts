import { ChatInputCommandInteraction } from "discord.js";
import { logger } from "../utils/logger.js";
import { SlashCommandType } from "../types/SlashCommand.js";

export async function onInteractionCreate(
  interaction: ChatInputCommandInteraction,
  slashCommands: Map<string, SlashCommandType>,
) {
  if (!interaction.isChatInputCommand()) return;

  const command = slashCommands.get(interaction.commandName);

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

  try {
    logger.info(
      `⚡ Executing slash command: /${interaction.commandName} by ${interaction.user.tag}`,
    );
    await command.execute(interaction);
  } catch (error) {
    logger.error(
      `Error executing slash command ${interaction.commandName}:`,
      error,
    );

    const errorReply = {
      content: "❌ An error occurred while executing the command",
      ephemeral: true,
    };

    if (interaction.replied) {
      await interaction.followUp(errorReply).catch(() => {});
    } else if (interaction.deferred) {
      await interaction.editReply(errorReply).catch(() => {});
    } else {
      await interaction.reply(errorReply).catch(() => {});
    }
  }
}
