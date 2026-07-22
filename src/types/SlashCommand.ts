import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export interface SlashCommandType {
  data: SlashCommandBuilder | any;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  category: "moderation" | "utility" | "erlc" | "admin";
}
