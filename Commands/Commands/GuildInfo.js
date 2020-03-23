const { MessageEmbed, Message } = require('discord.js');
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const path = require('path');

module.exports = {
  name: "ginfo",
  guildOnly: true,
  filename: path.basename(__filename),
  description: "Información general del servidor actual.",
  usage: "ginfo <Sin Parámetros>",
  nsfw: false,
  enabled: true,
  aliases: [],
  permissions: [],
  async execute(message = new Message(), args = new Array()) {
    const { guild, channel, member } = message;
    try {

      const members = await guild.members.fetch();
      const users = members.filter(member => !member.user.bot);
      const onlineUsers = users.filter(user => user.presence.status != 'offline');
      const bots = members.filter(member => member.user.bot);
      const guildCreated = guild.createdAt;

      const gCreatedAt = {
        day: dias[guildCreated.getDay()],
        date: guildCreated.getDate(),
        month: meses[guildCreated.getMonth()],
        year: guildCreated.getFullYear()
      }

      /* const mJoinedAt = {
        day: dias[memberFrom.getDay()],
        date: memberFrom.getDate(),
        month: meses[memberFrom.getMonth()],
        year: memberFrom.getFullYear()
      } */

      const fields = [
        { name: 'ID:', value: guild.id, inline: true },
        { name: 'Dueño:', value: `<@${guild.ownerID}>`, inline: true },
        { name: 'Cantidad de Miembros:', value: `${guild.memberCount} (${users.size} usuarios \| ${bots.size} bots)\n${onlineUsers.size} En Linea 🟢`, inline: false },
        { name: 'Canales:', value: `${guild.channels.cache.size} [${guild.channels.cache.filter(ch => ch.type == 'text').size} Texto \| ${guild.channels.cache.filter(ch => ch.type == 'voice').size} Voz \| ${guild.channels.cache.filter(ch => ch.type == 'category').size} Categorias]`, inline: false },
        { name: 'Roles:', value: `${guild.roles.cache.size}, Rol más alto: <@&${guild.roles.highest.id}>`, inline: false },
        { name: 'Región:', value: guild.region, inline: false },
        { name: 'Creación:', value: `${gCreatedAt.day} ${gCreatedAt.date} de ${gCreatedAt.month} del ${gCreatedAt.year}`, inline: false }
      ];

      const infoEmbed = new MessageEmbed()
        .setTitle(`${guild.name}`)
        .addFields(fields)
        .setThumbnail(guild.iconURL({ size: 512, dynamic: true }))
        .setColor('BLUE')
        .setTimestamp();

      return channel.send(infoEmbed);
    }
    catch (error) {
      console.log(error);
    }
  }
}