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

export const DEBUG = process.env.DEBUG === "true";
