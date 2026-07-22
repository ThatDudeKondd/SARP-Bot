import {
  ActionRowBuilder,
  EmbedBuilder,
  PermissionsBitField,
  RoleSelectMenuBuilder,
} from "discord.js";
import { superAdminId } from "../../config/config.js";
import { defineCommand } from "../../utils/defineCommand.js";
import { prisma } from "../../database/client.js";
import { logger } from "../../utils/logger.js";
import { CONSTANTS } from "../../config/constants.js";

export default defineCommand({
  name: "setup",
  description: "Setup the server's configuration",
  category: "server",
  cooldown: 5000,
  execute: async (ctx) => {
    try {
      if (!ctx.guild) {
        throw new Error("Setup must be run inside a guild.");
      }
      await ctx.defer();
      const isSuperAdmin = ctx.user.id === superAdminId;
      const isAdmin = ctx.member?.permissions?.has(
        PermissionsBitField.Flags.Administrator,
      );
      if (!isSuperAdmin && !isAdmin) {
        throw new Error(
          "Only a server administrator or the super admin can run setup.",
        );
      }

      const guildConfig = await prisma.guildConfig.findUnique({
        where: { guildId: ctx.guild.id },
      });

      const introEmbed = new EmbedBuilder()
        .setTitle("Server Setup")
        .setDescription(
          "We will now configure role-based access for ERLC commands. For each prompt, select one or more roles or submit without selecting any roles if none apply.",
        )
        .setColor(CONSTANTS.EMBED_COLOR)
        .setTimestamp();
      await ctx.reply({ embeds: [introEmbed], components: [] });

      const selectedRoles = {};
      const categories = [
        {
          key: "directiveRoles",
          title: "Directive Roles",
          description:
            "Select one or more Directive roles that should have the highest authority in the server.",
        },
        {
          key: "seniorManagementRoles",
          title: "Senior Management Roles",
          description:
            "Select one or more Senior Management roles that are above Management.",
        },
        {
          key: "managementRoles",
          title: "Management Roles",
          description:
            "Select one or more Management roles that are above Internal Affairs.",
        },
        {
          key: "supervisorRoles",
          title: "Supervisor Roles",
          description:
            "Select one or more Supervisor roles that can execute /erlc run and higher-level actions.",
        },
        {
          key: "adminRoles",
          title: "Admin Roles",
          description:
            "Select one or more roles that should be treated as server administration roles.",
        },
        {
          key: "moderatorRoles",
          title: "Moderator Roles",
          description:
            "Select one or more roles that should be able to use moderator tools and /erlc players.",
        },
      ];

      const rows = [];
      for (const category of categories) {
        const selectMenu = new RoleSelectMenuBuilder()
          .setCustomId(`setup_select_${category.key}`)
          .setPlaceholder(`Select ${category.title}`)
          .setMinValues(0)
          .setMaxValues(25);

        rows.push(
          new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(
            selectMenu,
          ),
        );
        const stepEmbed = new EmbedBuilder()
          .setTitle(`Configure ${category.title}`)
          .setDescription(category.description)
          .addFields(
            {
              name: "Instructions",
              value:
                "Choose one or more roles from the menu below. If you do not want to assign any roles for this category, submit without selecting any.",
            },
            { name: "Current selection", value: "None selected" },
          )
          .setColor(CONSTANTS.EMBED_COLOR)
          .setTimestamp();
        await ctx.reply({ embeds: [stepEmbed], components: rows });
        const stepMessage = await ctx.fetchReply();

        const collectorFilter = (i: any) =>
          i.user.id === ctx.user.id &&
          i.customId === `setup_select_${category.key}`;
      }

      logger.info("Guild config:", guildConfig);
    } catch (e) {
      logger.error("Setup command failed:", e);
      await ctx.reply("❌ Something went wrong running setup.").catch(() => {});
    }
  },
});
