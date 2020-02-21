const { MessageEmbed, Message } = require('discord.js');
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

module.exports = {
  name: "ginfo",
  description: "Información general del servidor actual",
  nsfw: false,
  usage: "PREFIXginfo <Sin Parámetros>",
  execute: async (message = new Message()) => {
    try {
      const { guild } = message;

      const members = await guild.members.fetch();
      const users = members.filter(member => !member.user.bot);
      const onlineUsers = users.filter(user => user.presence.status != 'offline');
      const bots = members.filter(member => member.user.bot);
      const guildCreated = guild.createdAt;
      const memberFrom = member.joinedAt;

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

      const infoEmbed = new MessageEmbed()
        .setTitle(`${guild.name}`)
        .addField('ID:', guild.id, true)
        .addField('Dueño:', `<@${guild.ownerID}>`, true)
        .addField('Cantidad de Miembros:', `${guild.memberCount} (${users.size} usuarios \| ${bots.size} bots)\n${onlineUsers.size} En Linea 🟢`)
        .addField('Canales:', `${guild.channels.size} [${guild.channels.filter(ch => ch.type == 'text').size} Texto \| ${guild.channels.filter(ch => ch.type == 'voice').size} Voz \| ${guild.channels.filter(ch => ch.type == 'category').size} Categorias]`)
        .addField('Roles:', `${guild.roles.size}, Rol más alto: <@&${guild.roles.highest.id}>`)
        .addField('Región:', guild.region)
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
}