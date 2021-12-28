const { CommandInteraction, MessageEmbed, GuildMember } = require('discord.js');
const { format } = require('date-format-parse');


function parseDate(date) {

  return format(date, "DD-MM-YYYY", {
    locale: {
      months: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
      // MMM
      monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      // dddd
      weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      // ddd
      weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sáb'],
      // dd
      weekdaysMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
      // [A a] format the ampm. The following is the default value
      meridiem: (h, m, isLowercase) => {
        const word = h < 12 ? 'AM' : 'PM';
        return isLowercase ? word.toLocaleLowerCase() : word;
      },
      // [A a] used by parse to match the ampm. The following is the default value
      meridiemParse: /[ap]\.?m?\.?/i,
      // [A a] used by parse to determine if the matching string is pm. The following is the default value
      isPM: (input) => {
        return (input + '').toLowerCase().charAt(0) === 'p';
      }
    }
  })

}

/**
 * 
 * @param {GuildMember} member 
 */
function isSomething(member) {

  if (member.id === member.guild.ownerId)
    return "Este miembro es dueño de este servidor."

  if (member.permissions.has('ADMINISTRATOR'))
    return "Este miembro es Administrador de este servidor."

  if (member.permissions.any(["KICK_MEMBERS", "BAN_MEMBERS", "MODERATE_MEMBERS"]))
    return "Este miembro es Moderador de este servidor."

  return "";
}

/**
 * 
 * @param {CommandInteraction} interaction 
 */
const UserInfo = async (interaction) => {
  const user = interaction.options.getUser('usuario') ?? interaction.user;

  const member = await interaction.guild.members.fetch({ user: user });

  const joinedAt = parseDate(member.joinedAt);

  const userInfoEmbed = new MessageEmbed()
    .setTitle(`Info de ${member.user.tag}`)
    .setDescription(`Nombre en el servidor: ${member.displayName}\nMiembro desde: ${joinedAt}\nRoles: ${member.roles.cache.size}\nRol más alto: <@&${member.roles.highest.id}>`)
    .setThumbnail(member.user.displayAvatarURL({ size: 512, dynamic: true }))
    .setColor(member.displayColor ?? "BLUE")
    .setFooter(isSomething(member));

  return await interaction.reply({
    embeds: [userInfoEmbed]
  });
}

module.exports = { UserInfo };