import { ChatInputCommandInteraction } from "discord.js";
import { CommandHandler } from "../services/CommandHandler.js";
import { UnifiedCommand } from "../types/UnifiedCommand.js";

export async function onInteractionCreate(
  interaction: ChatInputCommandInteraction,
  commands: Map<string, UnifiedCommand>,
) {
  if (!interaction.isChatInputCommand()) return;
  await CommandHandler.handleSlashCommand(interaction, commands);
}
