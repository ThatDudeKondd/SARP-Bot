import { PermissionResolvable } from "discord.js";
import { CommandContext } from "../utils/CommandContext.js";

export type CommandOptionType =
  | "string"
  | "integer"
  | "number"
  | "boolean"
  | "user"
  | "channel"
  | "role"
  | "mentionable"
  | "attachment";

export interface CommandChoice {
  name: string;
  value: string | number;
}

export interface CommandOption {
  /** Option name — also the token position for prefix commands (in declaration order). */
  name: string;
  description: string;
  type: CommandOptionType;
  required?: boolean;
  /** Only used for string/integer/number options. */
  choices?: CommandChoice[];
}

export type CommandCategory =
  | "moderation"
  | "utility"
  | "erlc"
  | "admin"
  | "server";

/**
 * A single command definition. Drop a file exporting one of these (as `default`)
 * into src/commands/<category>/ and it is automatically registered as BOTH a
 * prefix command and a slash command — no separate slash/prefix files needed.
 */
export interface UnifiedCommand {
  /** Command name — used for `!name` and `/name`. Lowercase, no spaces. */
  name: string;
  description: string;
  category: CommandCategory;
  /** Extra names that trigger this command as a prefix command (slash commands don't support aliases). */
  aliases?: string[];
  /** Cooldown in milliseconds. Defaults to 3000ms. */
  cooldown?: number;
  /** Permissions required to run this command, checked for both prefix and slash invocations. */
  permissions?: PermissionResolvable[];
  /** If true, the command can only be used inside a guild. */
  guildOnly?: boolean;
  /**
   * Options are used to auto-generate the slash command's arguments AND are
   * parsed positionally (in the order declared here) for the prefix version.
   */
  options?: CommandOption[];
  execute: (ctx: CommandContext) => Promise<void>;
}
