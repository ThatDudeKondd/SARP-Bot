import { prisma } from "../database/client.js";
import { logger } from "../utils/logger.js";

export class GuildConfigService {
  /**
   * Get or create guild config
   */
  static async getConfig(guildId: string) {
    try {
      let config = await prisma.guildConfig.findUnique({
        where: { guildId },
      });

      if (!config) {
        config = await prisma.guildConfig.create({
          data: { guildId },
        });
        logger.info(`Created new guild config for ${guildId}`);
      }

      return config;
    } catch (error) {
      logger.error(`Failed to get guild config for ${guildId}:`, error);
      throw error;
    }
  }

  /**
   * Update guild config
   */
  static async updateConfig(
    guildId: string,
    data: { prefix?: string; modLogChannelId?: string },
  ) {
    try {
      const config = await prisma.guildConfig.upsert({
        where: { guildId },
        update: data,
        create: { guildId, ...data },
      });

      logger.info(`Updated guild config for ${guildId}`);
      return config;
    } catch (error) {
      logger.error(`Failed to update guild config for ${guildId}:`, error);
      throw error;
    }
  }

  /**
   * Get guild prefix
   */
  static async getPrefix(guildId: string): Promise<string> {
    const config = await this.getConfig(guildId);
    return config.prefix;
  }

  /**
   * Set guild prefix
   */
  static async setPrefix(guildId: string, prefix: string) {
    return this.updateConfig(guildId, { prefix });
  }

  /**
   * Get mod log channel
   */
  static async getModLogChannel(guildId: string): Promise<string | null> {
    const config = await this.getConfig(guildId);
    return config.modLogChannelId;
  }

  /**
   * Set mod log channel
   */
  static async setModLogChannel(guildId: string, channelId: string) {
    return this.updateConfig(guildId, { modLogChannelId: channelId });
  }
}
