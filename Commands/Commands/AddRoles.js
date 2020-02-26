const { Message, MessageEmbed } = require('discord.js');
const path = require('path');

const noTarget = new MessageEmbed()
  .setTitle('🎯 ¡No mencionaste al objetivo!')
  .addFields({ name: 'Modo de uso:', value: this.usage })
  .setColor("RED");

const missingPermissions = new MessageEmbed()
  .setTitle('Permisos insuficientes.')
  .setDescription(`Necesito el o los siguientes permisos:\n\`${this.permissions.join(", ")}\``)
  .setColor("RED");

const errorEmbed = new MessageEmbed()
  .setTitle(`😕 Hubo un error al ejecutar este comando.`)
  .setDescription("¡Por favor inténtalo más tarde!")
  .setColor("RED");

const noRolesFound = new MessageEmbed()
  .setTitle(`🔎 No se encontró ningun rol.`)
  .setDescription("Asegurate de haber escrito el nombre de cada rol correctamente. Tambien recuerda que cada rol debe estar separado por una coma `,`\n\n**Nota:** No puedes añadir roles más altos que el tuyo, ni que el mio.")
  .addFields({ name: 'Modo de uso:', value: this.usage })
  .setColor("YELLOW");

const rolesAdded = (target) =>
  new MessageEmbed()
    .setTitle(`✅ ¡Rol/es añadidos a ${target.user.tag}!`)
    .setColor("GREEN");

module.exports = {
  name: "addroles",
  aliases: ['addrole'],
  description: "Añade uno o más roles al miembro objetivo, separados por una coma.",
  usage: "addroles [@Miembro] [rol1, rol2, rol3, ...roln]",
  nsfw: false,
  enabled: true,
  permissions: ['MANAGE_ROLES'],
  filename: path.basename(__filename),
  async execute(message = new Message(), args = new Array()) {

    //Args will come like "<membermention> <rolename>, <rolename>, <rolename>"
    const { channel, guild, member, author } = message;
    const { me, roles: GuildRoles, owner } = guild;
    const MukiHighest = me.roles.highest, MemberHighest = member.roles.highest;

    if (!member.hasPermission('ADMINISTRATOR', { checkOwner: true })) return;
    if (!me.hasPermission('MANAGE_ROLES')) return await channel.send(missingPermissions);
    if (!message.mentions.members) return await channel.send(noTarget);
    const target = message.mentions.members.first();

    const roleNames = args.slice(1).join(" ").toLowerCase().split(", ");

    const rolesToAdd = GuildRoles.cache.filter(role => roleNames.includes(role.name.toLowerCase()));

    if (rolesToAdd.size === 0) return await channel.send(noRolesFound);

    if (author.id === owner.id) {
      // If the member trying to add the roles, is the guild owner,
      //We dont want to filter the roles, just add them.

      await target.roles.add(rolesToAdd, message.author.tag);
      return await channel.send(rolesAdded(target));
    } else {

      //If not, we dont want to add roles that are higher than the highest role of the member invoking the command.
      const filtered = rolesToAdd.filter(role => role.position <= MukiHighest.position && role.position <= MemberHighest.position);
      if (filtered.size === 0) return await channel.send(noRolesFound);

      await target.roles.add(filtered, message.author.tag);
      return await channel.send(rolesAdded(target));
    }
  }
}