//@ts-check
const { CommandInteraction, MessageEmbed, GuildMember, Collection, Role } = require('discord.js');
const { FormatDate } = require("../../../../Helpers/formatDate");

const TIERS = {
  NONE: "Sin nivel",
  TIER_1: "Nivel 1",
  TIER_2: "Nivel 2",
  TIER_3: "Nivel 3"
}

const VERIFICATIONLEVELS = {
  // "NONE" | "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH"
  NONE: "Sin verificación.",
  LOW: "Bajo, los miembros deben tener un email verificado en sus cuentas de Discord.",
  MEDIUM: "Medio, los miembros deben estar registrados en Discord por más de 5 minutos.",
  HIGH: "Alto, los miembros deben tener un email verificado, estar registrado en Discord por más de 5 minutos y además ser miembro de este servidor por más de 10 minutos.",
  VERY_HIGH: "Más alto, los miembros deben tener un email verificado, estar registrado por más de 5 minutos, ser miembro de este servidor por más de 10 minutos y además tener un número de celular verificado en sus cuentas de Discord."
}

/**
 * 
 * @param {CommandInteraction} interaction
 */
const ServerInfo = async (interaction) => {
  const memberList = await interaction.guild.members.fetch().catch(console.error);

  if (interaction.inCachedGuild()) {

    if (!memberList)
      return interaction.reply({
        content: 'No se recibió la lista completa de miembros, por favor intenta usar este comando nuevamente.', ephemeral: true
      });

    let humans = 0;
    let bots = 0;
    for (const [_id, member] of memberList) {
      if (member.user.bot)
        bots += 1;
      else
        humans += 1;
    }
    const { guild: { channels }, guild, member } = interaction;
    channels.cache.first().type;

    const chCount = {
      TEXT: 0,
      VOICE: 0,
      NEWS: 0,
      CATEGORY: 0,
      STAGES: 0,
    }

    for (const [_id, channel] of channels.cache) {
      switch (channel.type) {
        case 'GUILD_CATEGORY':
          chCount.CATEGORY++;
          break;
        case 'GUILD_NEWS':
          chCount.NEWS++;
          break;
        case 'GUILD_TEXT':
          chCount.TEXT++;
          break;
        case 'GUILD_STAGE_VOICE':
          chCount.STAGES++;
          break;
        case 'GUILD_VOICE':
          chCount.VOICE++;
          break;
      }
    }

    const roles = sliceRoles(guild.roles.cache);
    const chevronEmoji = interaction.client.emojis.cache.find(emoji => emoji.name === 'chevron_right') ?? "\>";

    const serverInfo = new MessageEmbed()
      .setAuthor({
        name: `Información del servidor ${guild.name}`
      })
      .setDescription(
        `**Información General**\n`
        + `${chevronEmoji} **Dueño**: <@${guild.ownerId}> (${guild.ownerId})\n`
        + `${chevronEmoji} **Id**: ${guild.id}\n`
        + `${chevronEmoji} **Creación**: ${FormatDate(guild.createdAt)}\n`
        + `${chevronEmoji} **Nivel de Verificación**: ${VERIFICATIONLEVELS[guild.verificationLevel]}\n`
        + `\n`
        + `**Estadísticas**\n`
        + `${chevronEmoji} **Nivel del Servidor**: ${TIERS[guild.premiumTier]}\n`
        + `${chevronEmoji} **N° Boosts**: ${guild.premiumSubscriptionCount}\n`
        + `${chevronEmoji} **N° Roles**: ${guild.roles.cache.size}\n`
        + `${chevronEmoji} **N° Canales**: ${guild.channels.cache.size} (${chCount.VOICE} Voz | ${chCount.TEXT} Texto | ${chCount.CATEGORY} Categorias | ${chCount.STAGES} Stages | ${chCount.NEWS} Anuncios)\n`
        + `${chevronEmoji} **N° Miembros**: ${memberList.size} (${humans} Humanos, ${bots} Bots)\n`
        + `\n`
        + `**Roles [${guild.roles.cache.size}]**\n`
        + `${roles}`)
      .setThumbnail(guild.iconURL({ size: 512, dynamic: true }))
      .setColor(member.displayColor)
      .setTimestamp();

    return await interaction.reply({
      embeds: [serverInfo]
    });
  }
}

/**
 * 
 * @param {Collection<string, Role>} roles
 * @returns {string}
 */
function sliceRoles(roles) {
  const roleArray = roles.toJSON();
  const maxRolesToShow = 10;
  if (roleArray.length > maxRolesToShow) {

    for (let index = 0; index < roleArray.length; index++) {
      roleArray.sort((a, b) => b.position - a.position);

      const slice = roleArray.slice(0, maxRolesToShow);
      // @ts-ignore
      slice.push(`${roleArray.length - maxRolesToShow} roles más...`);

      return slice.map(role => role.toString()).join(", ");
    }
  } else {
    return roleArray.map(role => role.toString()).join(", ");
  }
}

module.exports = { ServerInfo };