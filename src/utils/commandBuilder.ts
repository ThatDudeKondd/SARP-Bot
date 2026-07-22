import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types/Command";
import { logger } from "../utils/logger";

export async function commandBuilder(data: Command) {
  if (!data.name || !data.execute) {
    logger.error(`Invalid command: ${data.name}`);
    return null;
  }

  // Slash command making

  let slashCommand = new Map();

  slashCommand.set(
    data.name,
    new SlashCommandBuilder()
      .setName(data.name)
      .setDescription(data.description),
  );
}
