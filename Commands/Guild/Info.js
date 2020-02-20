const { MessageEmbed, Message } = require('discord.js');
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const GuildInfo = async (message = new Message()) => {
  try {
    const members = await message.guild.members.fetch();
    const guild = message.guild;
    const users = members.filter(member => !member.user.bot);
    const onlineUsers = users.filter(user => user.presence.status != 'offline');
    const bots = members.filter(member => member.user.bot);
    const guildCreated = message.guild.createdAt;
    const memberFrom = message.member.joinedAt;
    const gCreatedAt = {
      day: dias[guildCreated.getDay()],
      date: guildCreated.getDate(),
      month: meses[guildCreated.getMonth()],
      year: guildCreated.getFullYear()
    }

    const mJoinedAt = {
      day: dias[memberFrom.getDay()],
      date: memberFrom.getDate(),
      month: meses[memberFrom.getMonth()],
      year: memberFrom.getFullYear()
    }
    /*     const description =
          `
    **Creación:** ${gCreatedAt.day} ${gCreatedAt.date} de ${gCreatedAt.month} del ${gCreatedAt.year}
    **Dueño:** <@${message.guild.ownerID}>
    **Miembros:** ${users.size} Usuarios (${onlineUsers.size} En Linea) \| ${bots.size} Bots \| ${message.guild.memberCount} total
    **Cantidad de Roles:** ${message.guild.roles.size}
    **Rol más alto:** <@&${message.guild.roles.highest.id}>
    
    **Tu info como miembro de ${message.guild.name}:**
    
    **Nombre:** ${message.author.username}
    **ID:** ${message.author.id}
    **Discriminador:** ${message.author.discriminator}
    **Rol más alto:** <@&${message.member.roles.highest.id}>
    **Miembro de ${message.guild.name} desde:** ${mJoinedAt.day} ${mJoinedAt.date} de ${mJoinedAt.month} del ${mJoinedAt.year}
    `; */

    /**
     * Server ID
     * OWNER
     * Users
     * Channels
     * Roles
     * Region
     * BanCount
     * Created
     */

    const infoEmbed = new MessageEmbed()
      .setTitle(`${guild.name}`)
      .addField('ID:', guild.id, true)
      .addField('Dueño:', `<@${guild.ownerID}>`, true)
      .addField('Cantidad de Miembros:', `${guild.memberCount} (${users.size} usuarios \| ${bots.size} bots)\n${onlineUsers.size} En Linea 🟢`)
      .addField('Canales:', `${guild.channels.size} [${guild.channels.filter(ch => ch.type == 'text').size} Texto \| ${guild.channels.filter(ch => ch.type == 'voice').size} Voz \| ${guild.channels.filter(ch => ch.type == 'category').size} Categorias]`)
      .addField('Roles:', `${guild.roles.size}, Rol más alto: <@&${guild.roles.highest.id}>`)
      .addField('Creación:', `${gCreatedAt.day} ${gCreatedAt.date} de ${gCreatedAt.month} del ${gCreatedAt.year}`)
      .setThumbnail(guild.iconURL({ size: 512 }))
      .setColor('BLUE')
      .setTimestamp();

    return await message.channel.send(infoEmbed);
  }
  catch (error) {
    console.log(error);
  }
}


const UserInfo = async (message = new Message()) => {
  try {
    const user = message.mentions.users.first() || message.author;
    const member = message.guild.member(user) || message.member;
    const dMemberSince = user.createdAt;
    const gMemberSince = member.joinedAt;
    const guild = message.guild;
    const mSince = {
      day: dias[dMemberSince.getDay()],
      date: dMemberSince.getDate(),
      month: meses[dMemberSince.getMonth()],
      year: dMemberSince.getFullYear()
    }
    const gSince = {
      day: dias[gMemberSince.getDay()],
      date: gMemberSince.getDate(),
      month: meses[gMemberSince.getMonth()],
      year: gMemberSince.getFullYear()
    }

    const userinfo =
      `**ID:** ${user.id}
**Discriminador:** ${user.discriminator}
**Creación de la Cuenta:** ${mSince.day} ${mSince.date} de ${mSince.month} del ${mSince.year}`

    const memberinfo =
      `**Roles:** ${member.roles.size}
**Rol más alto:** <@&${member.roles.highest.id}>
**Miembro desde:** ${gSince.day} ${gSince.date} de ${gSince.month} del ${gSince.year}`
    /**
   * UserID
   * UserTAG
   * UserAvatar
   * OnDiscordSince
   * HighestRole
   * 
   */
    const infoEmbed = new MessageEmbed()
      .setTitle(`${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ size: 512 }))
      .addField('User Info:', userinfo)
      .addField(`Info como Miembro de ${guild.name}`, memberinfo)
      .setColor(member.displayColor)
      .setTimestamp()

    return await message.channel.send(infoEmbed);
  } catch (error) {
    console.log(error);
  }
}
module.exports = { GuildInfo, UserInfo }