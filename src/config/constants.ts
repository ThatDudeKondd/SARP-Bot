export const CONSTANTS = {
  PREFIX: "!",
  EMBED_COLOR: "#0099ff",
  DEFAULT_TIMEOUT: 5000,
  MAX_RETRIES: 3,
} as const;

export const GUILD_IDS =
  process.env.GUILD_IDS?.split(",").map((id) => id.trim()) || [];
export const CLIENT_ID = process.env.CLIENT_ID || "";
export const BOT_TOKEN = process.env.BOT_TOKEN || "";
export const ERLC_API_KEY = process.env.ERLC_API_KEY || "";
