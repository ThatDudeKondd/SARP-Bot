import {
  Message,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export type CommandContext = Message | ChatInputCommandInteraction;

export interface Command {
  name: string;
  description: string;
  category: "moderation" | "utility" | "erlc" | "admin";
  cooldown?: number; // Cooldown in milliseconds (default: 3000ms)
  slashData: SlashCommandBuilder | any; // For slash command registration
  execute: (context: CommandContext, args?: string[]) => Promise<void>;
}
