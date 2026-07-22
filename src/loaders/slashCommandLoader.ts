import { readdirSync } from "fs";
import { resolve } from "path";
import { pathToFileURL } from "url";
import { SlashCommandBuilder } from "discord.js";
import { SlashCommandType } from "../types/SlashCommand.js";
import { logger } from "../utils/logger.js";

export class SlashCommandLoader {
  static async loadSlashCommands(
    baseDir: string,
  ): Promise<Map<string, SlashCommandType>> {
    const commands = new Map<string, SlashCommandType>();

    try {
      const categories = readdirSync(baseDir);

      for (const category of categories) {
        const categoryPath = resolve(baseDir, category);
        const files = readdirSync(categoryPath).filter(
          (file) =>
            (file.endsWith(".js") || file.endsWith(".ts")) &&
            !file.endsWith(".d.ts"),
        );

        for (const file of files) {
          const filePath = resolve(categoryPath, file);

          try {
            const fileUrl = pathToFileURL(filePath).href;
            const module = await import(fileUrl);
            const command: SlashCommandType =
              module.default || Object.values(module)[0];

            if (command && command.data instanceof SlashCommandBuilder) {
              const commandName = command.data.name;
              commands.set(commandName, command);
              logger.info(`✅ Loaded slash command: /${commandName}`);
            } else {
              logger.warn(`Skipped invalid slash command in ${filePath}`);
            }
          } catch (error) {
            logger.error(
              `Failed to load slash command from ${filePath}:`,
              error,
            );
          }
        }
      }

      logger.success(`Loaded ${commands.size} slash commands`);
      return commands;
    } catch (error) {
      logger.error("Failed to load slash commands:", error);
      return commands;
    }
  }

  /**
   * Register slash commands with Discord
   */
  static async registerSlashCommands(
    client: any,
    commands: Map<string, SlashCommandType>,
    guildIds: string[],
  ) {
    try {
      const commandData = Array.from(commands.values()).map((cmd) => cmd.data);

      // Register to specific guilds (faster for testing)
      if (guildIds.length > 0) {
        for (const guildId of guildIds) {
          const guild = await client.guilds.fetch(guildId);
          if (guild) {
            await guild.commands.set(commandData);
            logger.info(
              `Registered ${commandData.length} commands to guild ${guildId}`,
            );
          }
        }
      } else {
        // Register globally (takes up to 1 hour to propagate)
        await client.application?.commands.set(commandData);
        logger.info(`Registered ${commandData.length} commands globally`);
      }

      logger.success("Slash commands registered successfully");
    } catch (error) {
      logger.error("Failed to register slash commands:", error);
    }
  }
}
