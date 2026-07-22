import { readdirSync } from "fs";
import { resolve } from "path";
import { pathToFileURL } from "url";
import { Command } from "../types/Command.js";
import { logger } from "../utils/logger.js";

export class CommandLoader {
  static async loadPrefixCommands(
    baseDir: string,
  ): Promise<Map<string, Command>> {
    const commands = new Map<string, Command>();

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
            // Dynamic import for TypeScript/JavaScript modules
            const fileUrl = pathToFileURL(filePath).href;
            const module = await import(fileUrl);
            const command: Command = module.default || Object.values(module)[0];

            if (command && command.name) {
              commands.set(command.name, command);
              logger.info(`✅ Loaded prefix command: ${command.name}`);
            } else {
              logger.warn(`Skipped invalid command in ${filePath}`);
            }
          } catch (error) {
            logger.error(`Failed to load command from ${filePath}:`, error);
          }
        }
      }

      logger.success(`Loaded ${commands.size} prefix commands`);
      return commands;
    } catch (error) {
      logger.error("Failed to load prefix commands:", error);
      return commands;
    }
  }
}
