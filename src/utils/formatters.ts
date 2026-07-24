import { EmbedBuilder, APIEmbedField } from "discord.js";
import { CONSTANTS } from "../config/constants.js";

export function createSuccessEmbed(
  title: string,
  description: string,
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(CONSTANTS.EMBED_SUCCESS_COLOR)
    .setTimestamp();
}

export function createErrorEmbed(
  title: string,
  description: string,
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(CONSTANTS.EMBED_ERROR_COLOR)
    .setTimestamp();
}

export function createWarningEmbed(
  title: string,
  description: string,
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(CONSTANTS.EMBED_WARNING_COLOR)
    .setTimestamp();
}

export function createInfoEmbed(
  title: string,
  description: string,
  fields: APIEmbedField[] = [],
): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(CONSTANTS.EMBED_COLOR)
    .setTimestamp();

  if (fields.length > 0) {
    embed.addFields(fields.slice(0, CONSTANTS.MAX_EMBED_FIELDS));
  }

  return embed;
}

export function truncateString(
  str: string,
  maxLength: number = CONSTANTS.MAX_FIELD_LENGTH,
): string {
  if (str.length > maxLength) {
    return str.slice(0, maxLength - 3) + "...";
  }
  return str;
}

export function isPartialMatch(input: string, target: string): boolean {
  return target.toLowerCase().startsWith(input.toLowerCase());
}

export function formatFieldsFromObject(
  obj: Record<string, unknown>,
  customFormatters: Record<string, (value: unknown) => string> = {},
): APIEmbedField[] {
  const fields: APIEmbedField[] = [];

  for (const [key, value] of Object.entries(obj)) {
    let str: string;

    if (customFormatters[key]) {
      str = customFormatters[key](value);
    } else if (value === null || value === undefined) {
      str = "—";
    } else if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      str = String(value);
    } else {
      str = JSON.stringify(value);
    }

    str = truncateString(str);
    fields.push({ name: `${key}:`, value: str, inline: true });

    if (fields.length >= CONSTANTS.MAX_EMBED_FIELDS) break;
  }

  return fields;
}
