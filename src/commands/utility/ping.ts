import { defineCommand } from "../../utils/defineCommand.js";

// A command with no options — the simplest possible unified command.
// Registered automatically as both `!ping` and `/ping`.
export default defineCommand({
  name: "ping",
  description: "Check the bot's latency",
  category: "utility",
  aliases: ["latency"],
  cooldown: 3000,
  execute: async (ctx) => {
    const start = Date.now();
    await ctx.reply("🏓 Pinging...");
    const latency = Date.now() - start;
    const wsLatency = Math.round(ctx.client.ws.ping);

    await ctx.reply(`🏓 Pong! Latency: ${latency}ms | API: ${wsLatency}ms`);
  },
});
