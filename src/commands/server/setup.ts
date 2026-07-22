import {
  ActionRowBuilder,
  ComponentType,
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

      await ctx.interaction?.deferReply();

      console.log({
        replied: ctx.interaction?.replied,
        deferred: ctx.interaction?.deferred,
      });

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
      await ctx.interaction?.editReply({
        embeds: [introEmbed],
        components: [],
      });

      const selectedRoles: Record<string, string[]> = {};
      const categories = [
        {
          key: "directiveRoles",
          title: "Directive Roles",
          description:
            "Select one or more Directive roles that should have the highest authority in the server.",
        },
        {
          key: "seniorHrRoles",
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
          key: "administratorRoles",
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

      let savedConfig: Awaited<
        ReturnType<typeof prisma.guildConfig.findUnique>
      > = null;

      for (const category of categories) {
        const rows = [];
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
        await ctx.interaction?.editReply({
          embeds: [stepEmbed],
          components: rows,
        });
        const stepMessage = await ctx.interaction?.fetchReply();

        const collectorFilter = (i: any) =>
          i.user.id === ctx.user.id &&
          i.customId === `setup_select_${category.key}`;

        try {
          const selection = await stepMessage?.awaitMessageComponent({
            filter: collectorFilter,
            componentType: ComponentType.RoleSelect,
            time: 60000,
          });
          selectedRoles[category.key] = Array.isArray(selection?.values)
            ? selection?.values
            : [];

          const selectedEmbed = new EmbedBuilder()
            .setTitle(`Configure ${category.title}`)
            .setDescription(
              `${category.description}\n\n**Selected roles:** ${selectedRoles[category.key].length > 0 ? selectedRoles[category.key].map((id) => `<@&${id}>`).join(", ") : "None selected"}`,
            )
            .setColor(CONSTANTS.EMBED_COLOR)
            .setTimestamp();
          await selection?.update({ embeds: [selectedEmbed], components: [] });
        } catch (err) {
          await ctx.interaction?.editReply({
            content:
              "⏰ Setup timed out after 60 seconds. Please run `/setup` again.",
            embeds: [],
            components: [],
          });
          logger.error("Setup error", err);
          return;
        }

        savedConfig = await prisma.guildConfig.upsert({
          where: { guildId: ctx.guild.id },
          update: {
            [category.key]: selectedRoles[category.key],
          },
          create: {
            guildId: ctx.guild.id,
            [category.key]: selectedRoles[category.key],
          },
        });
      }

      if (!savedConfig) {
        throw new Error("Failed to save guild configuration.");
      }

      const completedEmbed = new EmbedBuilder()
        .setTitle("Server Setup Complete")
        .setDescription(
          "Server role configuration has been saved successfully.",
        )
        .setColor(CONSTANTS.EMBED_SUCCESS_COLOR)
        .setTimestamp()
        .addFields(
          {
            name: "Directive Roles",
            value:
              savedConfig.directiveRoles.length > 0
                ? savedConfig.directiveRoles.map((id) => `<@&${id}>`).join(", ")
                : "None selected",
          },
          {
            name: "Senior Management Roles",
            value:
              savedConfig.seniorHrRoles.length > 0
                ? savedConfig.seniorHrRoles.map((id) => `<@&${id}>`).join(", ")
                : "None selected",
          },
          {
            name: "Management Roles",
            value:
              savedConfig.managementRoles.length > 0
                ? savedConfig.managementRoles
                    .map((id) => `<@&${id}>`)
                    .join(", ")
                : "None selected",
          },
          {
            name: "Supervisor Roles",
            value:
              savedConfig.supervisorRoles.length > 0
                ? savedConfig.supervisorRoles
                    .map((id) => `<@&${id}>`)
                    .join(", ")
                : "None selected",
          },
          {
            name: "Admin Roles",
            value:
              savedConfig.administratorRoles.length > 0
                ? savedConfig.administratorRoles
                    .map((id) => `<@&${id}>`)
                    .join(", ")
                : "None selected",
          },
          {
            name: "Moderator Roles",
            value:
              savedConfig.moderatorRoles.length > 0
                ? savedConfig.moderatorRoles.map((id) => `<@&${id}>`).join(", ")
                : "None selected",
          },
        );

      logger.info("Guild config:", guildConfig);
    } catch (e) {
      logger.error("Setup command failed:", e);
      await ctx.interaction
        ?.editReply({
          content: "❌ Something went wrong running setup.",
          embeds: [],
          components: [],
        })
        .catch(() => {});
    }
  },
});
