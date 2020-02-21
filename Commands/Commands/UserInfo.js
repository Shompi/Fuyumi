const { MessageEmbed, Message } = require('discord.js');
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const infoEmbed = (user, member, guild, memberinfo, userinfo) =>
  new MessageEmbed()
    .setTitle(`${user.tag}`)
    .setThumbnail(user.displayAvatarURL({ size: 512 }))
    .addField('User Info:', userinfo)
    .addField(`Info como Miembro de ${guild.name}`, memberinfo)
    .setColor(member.displayColor)
    .setTimestamp()

const memberinfo = (member, gSince) =>
  `**Roles:** ${member.roles.size}
**Rol más alto:** <@&${member.roles.highest.id}>
**Miembro desde:** ${gSince.day} ${gSince.date} de ${gSince.month} del ${gSince.year}`;

const userinfo = (user, mSince) =>
  `**ID:** ${user.id}
**Discriminador:** ${user.discriminator}
**Creación de la Cuenta:** ${mSince.day} ${mSince.date} de ${mSince.month} del ${mSince.year}`;

module.exports = {
  name: "uinfo",
  description: "Muestra la información de un usuario en específico.",
  usage: "PREFIXuinfo [@mención de usuario]",
  execute: async (message = new Message()) => {
    const { guild, mentions } = message;
    try {
      const user = mentions.users.first() || message.author;
      const member = guild.member(user) || message.member;
      const dMemberSince = user.createdAt;
      const gMemberSince = member.joinedAt;

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

      const memberInfo = memberinfo(member, gSince);
      const userInfo = userinfo(user, mSince);

      return await message.channel.send(infoEmbed(user, member, guild, memberInfo, userInfo));
    } catch (error) {
      console.log(error);
    }
  }
}