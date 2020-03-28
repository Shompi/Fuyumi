'use strict'

const { MessageEmbed, Message } = require('discord.js');
const { basename } = require('path');

const missingArgument =
  new MessageEmbed()
    .setTitle(`Error: Falta un argumento.`)
    .setDescription(`Recuerda usar \`-add\` o \`-rem\` para añadir o remover un rol de la lista de roles auto-asignables.`)
    .setColor("BLUE");

const autoRoleList = (roles) => {
  const description = roles.map(r => `**${r.name}** (ID: ${r.id})`).join("\n");

  return new MessageEmbed()
    .setDescription(description)
    .setColor("BLUE");
}
module.exports = {
  name: "autorole",
  description: "Añade / Quita un rol de los que se pueden auto asignar.",
  filename: basename(__filename),
  usage: "autorole [-add/-rem] [Nombre del rol]",
  adminOnly: false,
  guildOnly: true,
  enabled: true,
  nsfw: false,
  permissions: [],
  aliases: [],

  execute(message = new Message(), args = new Array()) {
    const { client: Muki, channel, member, guild, author } = message;
    const { guildAutoRoles, guildConfigs } = Muki.db;

    //Autoasignable roles from the guild
    const autoRoles = guildAutoRoles.get(guild.id) || [];
    const adminrole = guildConfigs.get(guild.id).adminRole;

    //flag should be either -add or -rem
    const flag = args.shift();

    if (!["-add", "-rem", "-show"].includes(flag))
      return channel.send(missingArgument);

    const rolename = args.join(" ");

    if (flag === '-add' && (member.permissions.has("ADMINISTRATOR", true) || member.roles.cache.has(adminrole))) {

      //Check if the role exists in the guild before adding it to the database.
      const role = guild.roles.cache.find(r => r.name.toLowerCase() === rolename.toLowerCase());
      if (!role)
        return channel.send(`${author} no he encontrado un rol con ese nombre en este servidor.`);

      //If role position is higher than the highest role the bot has
      if (role.comparePositionTo(guild.me.roles.highest) > 0)
        return channel.send(`${author} no puedo añadir un rol más alto que el mio.`);

      if (autoRoles.some(dbrole => dbrole.name === role.name))
        return channel.send(`${author} el rol **${role.name}** ya se encuentra como rol-autoasignable.`);

      const newRole = {
        name: role.name,
        id: role.id
      };

      autoRoles.push(newRole);

      guildAutoRoles.set(guild.id, autoRoles);

      return channel.send(`El rol **${role.name}** has sido añadido a la lista de roles auto-asignables!`);

    }

    if (flag === '-rem' && (member.permissions.has("ADMINISTRATOR", true) || member.roles.cache.has(adminrole))) {
      if (autoRoles.length === 0)
        return channel.send(`${author} la lista de roles auto-asignables está vacia.`);


      const found = autoRoles.find(r => r.name.toLowerCase() === rolename.toLowerCase());
      if (!found)
        return channel.send(`${author} no encontré un rol con ese nombre en la lista.`);

      const newRoles = autoRoles.filter(r => r.name.toLowerCase() !== rolename.toLowerCase());
      const filteredRole = autoRoles.filter(r => r.name.toLowerCase() === rolename.toLowerCase());
      guildAutoRoles.set(guild.id, newRoles);

      return channel.send(`${author} el rol **${filteredRole.name}** se ha quitado de la lista!`);
    }

    if (flag === '-show') {
      const list = autoRoleList(autoRoles);

      return channel.send(`Lista de roles auto-asignables:`, { embed: list });
    }
  }
}