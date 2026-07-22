import { defineCommand } from "../../utils/defineCommand.js";

export default defineCommand({
  name: "echo",
  description: "Repeats the provided text.",
  category: "utility",
  cooldown: 1000,

  options: [
    {
      name: "message",
      description: "The message to repeat.",
      type: "string",
      required: true,
    },
  ],

  execute: async (ctx) => {
    const message = ctx.getString("message");

    if (!message) {
      await ctx.reply({
        content: "You need to provide something for me to echo.",
      });
      return;
    }

    await ctx.reply({
      content: message,
    });
  },
});
