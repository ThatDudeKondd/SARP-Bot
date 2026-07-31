import { EmbedBuilder, MessageFlags } from "discord.js";
import { defineCommand } from "../../utils/defineCommand.js";
import { CONSTANTS } from "../../config/constants.js";
import { getCommandRegistry } from "../../loaders/commandRegistry.js";
import { UnifiedCommand } from "../../types/UnifiedCommand.js";

/** Renders one command's line in the help embed, including its subcommands if any. */
function formatCommand(command: UnifiedCommand): string {
  if (command.subcommands?.length) {
    return command.subcommands
      .map((sub) => `\`/${command.name} ${sub.name}\` - ${sub.description}`)
      .join("\n");
  }

  return `\`/${command.name}\` - ${command.description}`;
}

export default defineCommand({
  name: "help",
  description:
    "Help command, shows information about the bot and it's commands.",
  aliases: [],
  cooldown: 1000,
  execute: async (ctx) => {
    const commands = getCommandRegistry().sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    const commandList = commands.map(formatCommand).join("\n");

    const helpEmbed = new EmbedBuilder()
      .setTitle("ERLC Bot Help")
      .setDescription(
        "Browse every available command for ERLC Bot. Commands can be used through slash commands or the configured prefix.",
      )
      .setColor(CONSTANTS.EMBED_COLOR)
      .addFields(
        {
          name: "Commands",
          value: commandList,
          inline: false,
        },
        {
          name: "Notes",
          value:
            "Some commands require specific server role permissions. Only supervisors+ or configured ERLC roles can manage server setup and run ERLC actions.",
          inline: false,
        },
      )
      .setFooter({ text: "ERLC Bot • Use commands for more details" })
      .setTimestamp();

    await ctx.reply({ embeds: [helpEmbed], flags: MessageFlags.Ephemeral });
  },
});
