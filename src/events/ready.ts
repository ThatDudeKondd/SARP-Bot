import { Client } from "discord.js";
import { logger } from "../utils/logger.js";
import { SlashCommandLoader } from "../loaders/slashCommandLoader.js";
import { GUILD_IDS } from "../config/constants.js";
import { SlashCommandType } from "../types/SlashCommand.js";

export async function onReady(
  client: Client<true>,
  slashCommands: Map<string, SlashCommandType>,
) {
  logger.success(`✅ Logged in as ${client.user.tag}`);
  logger.info(`📊 Serving ${client.guilds.cache.size} guilds`);

  // Register slash commands
  await SlashCommandLoader.registerSlashCommands(
    client,
    slashCommands,
    GUILD_IDS,
  );
}
