import { ChatInputCommandInteraction, EmbedBuilder, Collection, Role, ChannelType, Snowflake } from 'discord.js';
import { FormatDate } from "../Helpers/formatDate";

const TIERS = {
  0: "Sin nivel",
  1: "Nivel 1",
  2: "Nivel 2",
  3: "Nivel 3"
}


const VERIFICATIONLEVELS = {
  // "NONE" | "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH"
  0: "Sin verificación.",
  1: "Bajo, los miembros deben tener un email verificado en sus cuentas de Discord.",
  2: "Medio, los miembros deben estar registrados en Discord por más de 5 minutos.",
  3: "Alto, los miembros deben tener un email verificado, estar registrado en Discord por más de 5 minutos y además ser miembro de este servidor por más de 10 minutos.",
  4: "Más alto, los miembros deben tener un email verificado, estar registrado por más de 5 minutos, ser miembro de este servidor por más de 10 minutos y además tener un número de celular verificado en sus cuentas de Discord."
}

export const ServerInfo = async (interaction: ChatInputCommandInteraction) => {

  if (interaction.inCachedGuild()) {
    const memberList = await interaction.guild.members.fetch().catch(console.error);

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

    const chCount = {
      TEXT: 0,
      VOICE: 0,
      NEWS: 0,
      CATEGORY: 0,
      STAGES: 0,
    }

    for (const [_id, channel] of channels.cache) {
      switch (channel.type) {

        case ChannelType.GuildCategory:
          chCount.CATEGORY++;
          break;

        case ChannelType.GuildNews:
          chCount.NEWS++;
          break;

        case ChannelType.GuildText:
          chCount.TEXT++;
          break;

        case ChannelType.GuildStageVoice:
          chCount.STAGES++;
          break;

        case ChannelType.GuildVoice:
          chCount.VOICE++;
          break;
      }
    }

    const roles = sliceRoles(guild.roles.cache);
    const chevronEmoji = interaction.client.developmentGuild?.emojis.cache.get("1016829421056966707") ?? "\>";

    const serverInfo = new EmbedBuilder()
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
      .setThumbnail(guild.iconURL({ size: 512 }))
      .setColor(member.displayColor)
      .setTimestamp();

    return await interaction.reply({
      embeds: [serverInfo]
    });
  } else {
    return await interaction.reply({ content: 'Este comando no puede ser usado en mensajes directos.' })
  }
}

function sliceRoles(roles: Collection<Snowflake, Role>): string {
  const roleArray = roles.toJSON();
  const maxRolesToShow = 10;

  if (roleArray.length > maxRolesToShow) {

    for (let index = 0; index < roleArray.length; index++) {

      roleArray.sort((a, b) => b.position - a.position);

      const slice = roleArray.slice(0, maxRolesToShow).map(role => role.toString());

      return slice.join(", ") + `, ${roleArray.length - maxRolesToShow} roles más...`;

    }

  } else {
    return roleArray.map(role => role.toString()).join(", ");
  }

  return '';
}