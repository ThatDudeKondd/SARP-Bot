import { EmbedBuilder, MessageFlags } from "discord.js";
import { defineCommand } from "../../utils/defineCommand.js";
import { CONSTANTS } from "../../config/constants.js";

export default defineCommand({
  name: "help",
  description:
    "Help command, shows information about the bot and it's commands.",
  category: "utility",
  aliases: [],
  cooldown: 1000,
  execute: async (ctx) => {
    const helpEmbed = new EmbedBuilder()
      .setTitle("ERLC Bot Help")
      .setDescription(
        "Browse every available command for ERLC Bot. Commands can be used through slash commands or the configured prefix.",
      )
      .setColor(CONSTANTS.EMBED_COLOR)
      .addFields(
        {
          name: "Utility Commands",
          value:
            "`/help` - Displays this help message.\n`/ping` - Replies with Pong!.\n`/echo` - Repeats the text you provide.",
          inline: false,
        },
        {
          name: "Server Commands",
          value:
            "`/server setup` - Start server role configuration for ERLC access.\n`/server configuration` - View or modify the current server configuration.",
          inline: false,
        },
        {
          name: "ERLC Commands",
          value:
            "`/erlc stats` - Fetch current ERLC server stats.\n`/erlc run <command>` - Execute a command on the ERLC server.\n`/erlc players` - List online ERLC players.",
          inline: false,
        },
        {
          name: "Notes",
          value:
            "Some commands require specific server role permissions. Only admins or configured ERLC roles can manage server setup and run ERLC actions.",
          inline: false,
        },
      )
      .setFooter({ text: "ERLC Bot • Use commands for more details" })
      .setTimestamp();

    await ctx.reply({ embeds: [helpEmbed], flags: MessageFlags.Ephemeral });
  },
});
