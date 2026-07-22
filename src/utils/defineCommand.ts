import { SlashCommandBuilder } from "discord.js";
import { UnifiedCommand } from "../types/UnifiedCommand";
import { CommandOption } from "../types/UnifiedCommand";

/**
 * Identity helper — exists purely so command files get full type-checking
 * and autocomplete when authoring a command:
 *
 *   export default defineCommand({ name: "ping", ... });
 */
export function defineCommand(command: UnifiedCommand): UnifiedCommand {
  return command;
}

/**
 * Adds an option to either a SlashCommandBuilder or SlashCommandSubcommandBuilder.
 * Used for both normal commands and subcommands.
 */
function addOption(builder: any, option: CommandOption) {
  const required = !!option.required;

  switch (option.type) {
    case "string":
      builder.addStringOption((opt: any) => {
        opt
          .setName(option.name)
          .setDescription(option.description)
          .setRequired(required);

        if (option.choices) {
          opt.addChoices(
            ...(option.choices as { name: string; value: string }[]),
          );
        }

        return opt;
      });
      break;

    case "integer":
      builder.addIntegerOption((opt: any) => {
        opt
          .setName(option.name)
          .setDescription(option.description)
          .setRequired(required);

        if (option.choices) {
          opt.addChoices(
            ...(option.choices as { name: string; value: number }[]),
          );
        }

        return opt;
      });
      break;

    case "number":
      builder.addNumberOption((opt: any) => {
        opt
          .setName(option.name)
          .setDescription(option.description)
          .setRequired(required);

        if (option.choices) {
          opt.addChoices(
            ...(option.choices as { name: string; value: number }[]),
          );
        }

        return opt;
      });
      break;

    case "boolean":
      builder.addBooleanOption((opt: any) =>
        opt
          .setName(option.name)
          .setDescription(option.description)
          .setRequired(required),
      );
      break;

    case "user":
      builder.addUserOption((opt: any) =>
        opt
          .setName(option.name)
          .setDescription(option.description)
          .setRequired(required),
      );
      break;

    case "channel":
      builder.addChannelOption((opt: any) =>
        opt
          .setName(option.name)
          .setDescription(option.description)
          .setRequired(required),
      );
      break;

    case "role":
      builder.addRoleOption((opt: any) =>
        opt
          .setName(option.name)
          .setDescription(option.description)
          .setRequired(required),
      );
      break;

    case "mentionable":
      builder.addMentionableOption((opt: any) =>
        opt
          .setName(option.name)
          .setDescription(option.description)
          .setRequired(required),
      );
      break;

    case "attachment":
      builder.addAttachmentOption((opt: any) =>
        opt
          .setName(option.name)
          .setDescription(option.description)
          .setRequired(required),
      );
      break;
  }
}

/**
 * Builds the SlashCommandBuilder for a UnifiedCommand.
 */
export function buildSlashCommandData(
  command: UnifiedCommand,
): SlashCommandBuilder {
  const builder = new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description);

  // Build /command subcommand
  if (command.subcommands) {
    for (const subcommand of command.subcommands) {
      builder.addSubcommand((sub) => {
        sub.setName(subcommand.name).setDescription(subcommand.description);

        for (const option of subcommand.options ?? []) {
          addOption(sub, option);
        }

        return sub;
      });
    }

    return builder;
  }

  // Build normal /command options
  for (const option of command.options ?? []) {
    addOption(builder, option);
  }

  return builder;
}
