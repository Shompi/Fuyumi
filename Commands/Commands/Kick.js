const { MessageEmbed, Message } = require('discord.js');
const database = require('../LoadDatabase').guildConfigs;
const path = require('path');

const targetMessage = (obj) => {
  const { reason, guild } = obj;

  return new MessageEmbed()
    .setTitle(`Has sido expulsado de la guild ${guild.name}`)
    .setDescription(`${reason ? reason : "-"}`)
    .setThumbnail(guild.iconURL)
    .setColor("RED");
}

const noTarget = new MessageEmbed()
  .setTitle(`🔎 No he encontrado al miembro!`)
  .setDescription("Asegúrate de que el usuario sea parte de esta guild, o que la id que ingresaste sea una id valida.")
  .setColor("YELLOW");

const noPermissions = new MessageEmbed()
  .setTitle(`No tengo los permisos necesarios.`)
  .setDescription("Necesito el permiso 'KICK_MEMBERS' o 'EXPULSAR MIEMBROS' para poder ejecutar esta acción.")
  .setColor("RED");

const success = (info) => {
  const { target, guild, reason } = info;

  return new MessageEmbed()
    .setTitle(`${target.user.username} ha sido expulsado.`)
    .setThumbnail(target.user.displayAvatarURL({ size: 512 }))
    .setColor("ORANGE")
    .setDescription(`${reason ? "-" : reason}`)
    .setFooter(guild.name, guild.iconURL({ size: 64 }))
    .setTimestamp();
}


module.exports = {
  name: "kick",
  guildOnly: true,
  description: "Expulsa a un miembro del servidor. Si el comando lo ejecuta un miembro sin permisos para expulsar miembros, debe tener asignado el rol de administrador que configuras con el comando **adminrole**.",
  usage: "kick [id o @mención del miembro]",
  aliases: [],
  permissions: ["KICK_MEMBERS"],
  nsfw: false,
  enabled: true,
  adminonly: true,
  filename: path.basename(__filename),
  async execute(message = new Message(), args = new Array()) {
    const { channel, guild, mentions, member } = message;

    const target = mentions.members.first() || await guild.members.fetch(args[0]);
    const adminRole = database.get(guild.id).adminRole;
    if (!member.hasPermission('KICK_MEMBERS', { checkAdmin: true, checkOwner: true }) && !member.roles.cache.has(adminRole))
      return await channel.send('No tienes permiso para usar este comando.');

    if (!target) return await channel.send(noTarget);
    if (!target.kickable) return await channel.send(noPermissions);

    const reason = args.slice(1).join(" ");
    await target.send(targetMessage({ reason, guild })).catch(err => console.log('No puedo mensajear a este usuario. ' + err));
    await target.kick(reason);

    return await channel.send(success({ guild, target, reason }));
  }
}