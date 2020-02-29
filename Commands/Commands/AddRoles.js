const { Message, MessageEmbed } = require('discord.js');
const path = require('path');
const database = require('../LoadDatabase').guildConfigs;

const noTarget = (usage) =>
  new MessageEmbed()
    .setTitle('🎯 ¡No mencionaste al objetivo!')
    .addFields({ name: 'Modo de uso:', value: usage })
    .setColor("RED");

const missingPermissions = (permissions) =>
  new MessageEmbed()
    .setTitle('Permisos insuficientes.')
    .setDescription(`Necesito el o los siguientes permisos:\n\`${permissions.join(", ")}\``)
    .setColor("RED");

const errorEmbed = new MessageEmbed()
  .setTitle(`😕 Hubo un error al ejecutar este comando.`)
  .setDescription("¡Por favor inténtalo más tarde!")
  .setColor("RED");

const noRolesFound = (usage) =>
  new MessageEmbed()
    .setTitle(`🔎 No se encontró ningun rol.`)
    .setDescription("Asegurate de haber escrito el nombre de cada rol correctamente. Tambien recuerda que cada rol debe estar separado por una coma `,`\n\n**Nota:** No puedes añadir roles más altos que el tuyo, ni que el mio.")
    .addFields({ name: 'Modo de uso:', value: usage })
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
    const MukiHighest = me.roles.highest;

    if (!me.hasPermission('MANAGE_ROLES')) return await channel.send(missingPermissions(this.permissions));
    if (!message.mentions.members) return await channel.send(noTarget(this.usage));

    const guildConfigs = database.get(guild.id);
    const adminRole = guildConfigs.adminRole;
    const target = message.mentions.members.first();

    const roleNames = args.slice(1).join(" ").toLowerCase().split(", ");

    const rolesToAdd = GuildRoles.cache.filter(role => roleNames.includes(role.name.toLowerCase()));

    if (rolesToAdd.size === 0) return await channel.send(noRolesFound(this.usage));

    try {
      if (member.hasPermission('ADMINISTRATOR', { checkOwner: true })) {
        // If the member trying to add the roles, is the guild owner, or has explicitly ADMINISTRATOR permissions...
        //We dont want to filter the roles, just add them.

        await target.roles.add(rolesToAdd, message.author.tag);
        return await channel.send(rolesAdded(target));
      } else {

        //If not, we dont want to add roles that are higher than the highest role of the member invoking the command.
        if (!member.roles.cache.has(adminRole)) return await channel.send(`Debes tener el rol asignado como Rol de Administrador para usar este comando.\n\n\`${guildConfigs.prefix}adminrole [@Mención del Rol]\``);

        const MemberHighest = member.roles.cache.get(adminRole);
        const filtered = rolesToAdd.filter(role => role.position <= MukiHighest.position && role.position <= MemberHighest.position);
        if (filtered.size === 0) return await channel.send(noRolesFound(this.usage));

        await target.roles.add(filtered, message.author.tag);
        return await channel.send(rolesAdded(target));
      }
    }
    catch (error) {
      console.log(error);
      return await channel.send(errorEmbed);
    }
  }
}