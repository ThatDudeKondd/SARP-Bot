const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ComponentType,
  PermissionsBitField,
  RoleSelectMenuBuilder,
  MessageFlags,
} = require("discord.js");
import { CONSTANTS } from "../../config/constants.js";
import { prisma } from "../../database/client.js";
import { Prisma } from "../../generated/prisma/index.js";

const ROLE_CATEGORIES: {
  key: keyof Prisma.GuildConfig;
  title: string;
  description: string;
}[] = [
  {
    key: "directiveRoles",
    title: "Directive Roles",
    description: "Highest authority in the server.",
  },
  {
    key: "seniorHrRoles",
    title: "Senior Management Roles",
    description: "Above Management level.",
  },
  {
    key: "managementRoles",
    title: "Management Roles",
    description: "Above Internal Affairs level.",
  },
  {
    key: "supervisorRoles",
    title: "Internal Affairs Roles",
    description: "Can execute /erlc run and higher-level actions.",
  },
  {
    key: "administratorRoles",
    title: "Admin Roles",
    description: "Treated as server administration roles.",
  },
  {
    key: "moderatorRoles",
    title: "Moderator Roles",
    description: "Can use moderator tools and /erlc players.",
  },
];

async function createConfigEmbed(guildId: string) {
  const embed = new EmbedBuilder()
    .setTitle("Server Configuration")
    .setDescription("Current role-based access configuration for this server")
    .setColor(CONSTANTS.EMBED_COLOR)
    .setTimestamp();

  const guildConfig = await prisma.guildConfig.findUnique({
    where: { guildId },
  });

  if (!guildConfig) {
    embed.addFields({
      name: "Configuration",
      value: "No configuration has been created yet.",
    });

    return embed;
  }

  for (const category of ROLE_CATEGORIES) {
    const roles = guildConfig[category.key];

    // Only process String[] fields
    if (!Array.isArray(roles)) continue;

    const rolesDisplay =
      roles.length > 0
        ? roles.map((id) => `<@&${id}>`).join(", ")
        : "No roles assigned";

    embed.addFields({
      name: category.title,
      value: rolesDisplay,
      inline: false,
    });
  }

  return embed;
}
