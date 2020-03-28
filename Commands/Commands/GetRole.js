'use strict'
const { MessageEmbed, Message } = require('discord.js');
const { basename } = require('path');

const roleRemove = (role) =>
  new MessageEmbed()
    .setTitle(`Te he quitado el rol ${role.name} exitósamente!`)
    .setDescription("Para volver a tener este rol, ejecuta el comando nuevamente.")
    .setColor("GREEN");

const roleAdd = (role) =>
  new MessageEmbed()
    .setTitle(`Te he añadido el rol ${role.name} exitósamente!`)
    .setDescription("Para quitarte éste rol ejecuta el comando nuevamente.")
    .setColor("GREEN");

const noPermissions =
  new MessageEmbed()
    .setTitle("No tengo los permisos suficientes!")
    .setDescription("¡Necesito el permiso \`MANAGE_ROLES\` en **mi Rol más alto** para poder añadir roles!\n\nO ¿Intentaste añadirte un rol mas alto que el mio?\n**¡No puedo hacer eso!**")
    .setColor("RED");

module.exports = {
  name: "getrole",
  filename: basename(__filename),
  aliases: ["roleget", "getrol"],
  description: "Te asigna / quita el rol que especifiques.",
  usage: "getrole [Nombre del rol]",
  nsfw: false,
  enabled: true,
  guildOnly: true,
  permissions: ["MANAGE_ROLES"],
  async execute(message = new Message(), args = new Array()) {


    const { client: Muki, guild, member, author, channel } = message;

    if (args.length === 0)
      return channel.send(`?${author} debes escribir el nombre del rol!`);

    const guildroles = guild.roles.cache;
    const { guildAutoRoles } = Muki.db;

    const rolename = args.join(" ");
    const autoroles = guildAutoRoles.get(guild.id) || []; //Array of objects {name, id}.

    if (autoroles.length === 0)
      return channel.send(`Lo siento ${author}, no hay ningun rol-autoasignable configurado en este servidor.`);

    if (autoroles.some(dbrol => dbrol.name.toLowerCase() === rolename.toLowerCase())) {

      const role = guildroles.find(role => role.name.toLowerCase() === rolename.toLowerCase());
      if (!role)
        return channel.send(`No encontré el rol **${rolename}** en este servidor!`);

      try {
        if (!guild.me.permissions.has("MANAGE_ROLES", true))
          return channel.send(noPermissions);

        if (member.roles.cache.has(role.id)) {
          //if the member already has the role and the role is configued as auto-role, we can remove it from him.
          await member.roles.remove(role);

          return channel.send(roleRemove(role));
        }
        else {
          await member.roles.add(role);

          return channel.send(roleAdd(role));
        }
      } catch (err) {
        console.log(err);
        return channel.send(`Hubo un error al ejecutar este comando.`, { embed: noPermissions });
      }
    }
  }
}