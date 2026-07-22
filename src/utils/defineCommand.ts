import { SlashCommandBuilder } from "discord.js";
import { UnifiedCommand } from "../types/UnifiedCommand";

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
 * Builds the SlashCommandBuilder for a UnifiedCommand from its declared options.
 * Used by the command loader — you shouldn't need to call this yourself.
 */
export function buildSlashCommandData(
  command: UnifiedCommand,
): SlashCommandBuilder {
  const builder = new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description);

  for (const option of command.options ?? []) {
    const required = !!option.required;

    switch (option.type) {
      case "string":
        builder.addStringOption((opt) => {
          opt
            .setName(option.name)
            .setDescription(option.description)
            .setRequired(required);
          if (option.choices)
            opt.addChoices(
              ...(option.choices as { name: string; value: string }[]),
            );
          return opt;
        });
        break;
      case "integer":
        builder.addIntegerOption((opt) => {
          opt
            .setName(option.name)
            .setDescription(option.description)
            .setRequired(required);
          if (option.choices)
            opt.addChoices(
              ...(option.choices as { name: string; value: number }[]),
            );
          return opt;
        });
        break;
      case "number":
        builder.addNumberOption((opt) => {
          opt
            .setName(option.name)
            .setDescription(option.description)
            .setRequired(required);
          if (option.choices)
            opt.addChoices(
              ...(option.choices as { name: string; value: number }[]),
            );
          return opt;
        });
        break;
      case "boolean":
        builder.addBooleanOption((opt) =>
          opt
            .setName(option.name)
            .setDescription(option.description)
            .setRequired(required),
        );
        break;
      case "user":
        builder.addUserOption((opt) =>
          opt
            .setName(option.name)
            .setDescription(option.description)
            .setRequired(required),
        );
        break;
      case "channel":
        builder.addChannelOption((opt) =>
          opt
            .setName(option.name)
            .setDescription(option.description)
            .setRequired(required),
        );
        break;
      case "role":
        builder.addRoleOption((opt) =>
          opt
            .setName(option.name)
            .setDescription(option.description)
            .setRequired(required),
        );
        break;
      case "mentionable":
        builder.addMentionableOption((opt) =>
          opt
            .setName(option.name)
            .setDescription(option.description)
            .setRequired(required),
        );
        break;
      case "attachment":
        builder.addAttachmentOption((opt) =>
          opt
            .setName(option.name)
            .setDescription(option.description)
            .setRequired(required),
        );
        break;
    }
  }

  return builder;
}
