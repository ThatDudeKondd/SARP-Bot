import "dotenv/config";
import { Client } from "discord.js";
import { resolve } from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { BOT_CONFIG } from "./config/config.js";
import { BOT_TOKEN } from "./config/constants.js";
import { validateEnv } from "./utils/envValidator.js";
import { logger } from "./utils/logger.js";
import { connectDatabase, disconnectDatabase } from "./database/client.js";
import { onReady } from "./events/ready.js";
import { onMessageCreate } from "./events/messageCreate.js";
import { onInteractionCreate } from "./events/interactionCreate.js";
import { CommandLoader } from "./loaders/commandLoader.js";
import { SlashCommandLoader } from "./loaders/slashCommandLoader.js";

// Get __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Validate environment variables
validateEnv();

const client = new Client(BOT_CONFIG);

// Load commands dynamically
let prefixCommands = new Map();
let slashCommands = new Map();

async function initializeBot() {
  try {
    // Connect to database
    await connectDatabase();

    // Load commands
    const commandsDir = resolve(__dirname, "commands");
    prefixCommands = await CommandLoader.loadPrefixCommands(commandsDir);
    slashCommands = await SlashCommandLoader.loadSlashCommands(commandsDir);

    logger.success("✅ Bot initialized successfully");
  } catch (error) {
    logger.error("Failed to initialize bot:", error);
    process.exit(1);
  }
}

// Event listeners
client.on("ready", (readyClient) => onReady(readyClient, slashCommands));

client.on("messageCreate", (message) =>
  onMessageCreate(message, prefixCommands),
);

client.on("interactionCreate", (interaction) =>
  onInteractionCreate(interaction as any, slashCommands),
);

// Error handling
client.on("error", (error) => {
  logger.error("Discord client error:", error);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
});

// Graceful shutdown
async function shutdown() {
  logger.info("Shutting down bot...");
  await disconnectDatabase();
  await client.destroy();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Initialize and login
initializeBot()
  .then(() => {
    client.login(BOT_TOKEN);
  })
  .catch((error) => {
    logger.error("Failed to start bot:", error);
    process.exit(1);
  });
