import { Client, SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { CommandLoader } from "../loaders/unifiedCommandLoader.js";
import { GUILD_IDS } from "../config/constants.js";

export async function onReady(
  client: Client<true>,
  slashData: SlashCommandBuilder[],
) {
  logger.success(`✅ Logged in as ${client.user.tag}`);
  logger.info(`📊 Serving ${client.guilds.cache.size} guilds`);

  // Register slash commands (auto-generated from the same command files as the prefix commands)
  await CommandLoader.registerSlashCommands(client, slashData, GUILD_IDS);
}
