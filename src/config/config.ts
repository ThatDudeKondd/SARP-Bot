import { GatewayIntentBits, Partials } from "discord.js";

export const BOT_CONFIG = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
} as const;

export const superAdminId = "726507399640252416";

export const DEBUG = process.env.DEBUG === "true";
