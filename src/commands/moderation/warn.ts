import { PermissionFlagsBits } from "discord.js";
import { defineCommand } from "../../utils/defineCommand.js";

// A command with options — these are auto-converted into slash command
// arguments AND parsed positionally from prefix args, in the order declared
// below: `!warn @user being rude` or `/warn user:@user reason:being rude`.
export default defineCommand({
  name: "warn",
  description: "Warn a member",
  category: "moderation",
  cooldown: 5000,
  guildOnly: true,
  permissions: [PermissionFlagsBits.ModerateMembers],
  options: [
    {
      name: "user",
      description: "The member to warn",
      type: "user",
      required: true,
    },
    {
      name: "reason",
      description: "Why the member is being warned",
      type: "string",
      required: true,
    },
  ],
  execute: async (ctx) => {
    const user = ctx.getUser("user");
    const reason = ctx.getString("reason") ?? "No reason provided";

    if (!user) {
      await ctx.reply(
        "❌ Could not find that user. Mention them or use their ID.",
      );
      return;
    }

    // ... persist the warning via your database/service layer here ...

    await ctx.reply(`⚠️ Warned **${user.tag}** — ${reason}`);
  },
});
