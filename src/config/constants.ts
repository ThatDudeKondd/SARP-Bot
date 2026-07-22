export const CONSTANTS = {
  PREFIX: "!",
  DEFAULT_TIMEOUT: 5000,
  MAX_RETRIES: 3,
  EMBED_COLOR: 0x1e90ff,
  EMBED_ERROR_COLOR: 0xff0000,
  EMBED_SUCCESS_COLOR: 0x00ff00,
  EMBED_WARNING_COLOR: 0xffff00,
  MAX_EMBED_FIELDS: 25,
  MAX_FIELD_LENGTH: 1024,
} as const;

export const GUILD_IDS =
  process.env.GUILD_IDS?.split(",").map((id) => id.trim()) || [];
export const CLIENT_ID = process.env.CLIENT_ID || "";
export const BOT_TOKEN = process.env.BOT_TOKEN || "";
export const ERLC_API_KEY = process.env.ERLC_API_KEY || "";
