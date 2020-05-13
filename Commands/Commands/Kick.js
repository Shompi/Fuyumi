const { MessageEmbed, Message, MessageMentions } = require('discord.js');
const path = require('path');

const targetMessage = (obj) => {
  const { reason, guild } = obj;

  return new MessageEmbed()
    .setTitle(`Has sido expulsado de la guild ${guild.name}`)
    .setDescription(`${reason ? reason : "-"}`)
    .setThumbnail(guild.iconURL)
    .setColor("RED");
}

const notAllowed = new MessageEmbed()
  .setTitle("No puedo expulsar a este usuario.")
  .setDescription('El miembro al que quieres expulsar es un Administrador o tiene un rol de admin.')
  .setColor("RED");

const noTarget = new MessageEmbed()
  .setTitle(`🔎 No he encontrado al miembro!`)
  .setDescription("Asegúrate de que el usuario sea parte de esta guild, o que la id que ingresaste sea una id valida.")
  .setColor("YELLOW");

const noPermissions = new MessageEmbed()
  .setTitle(`No tengo los permisos necesarios.`)
  .setDescription("Necesito el permiso 'KICK_MEMBERS' o 'EXPULSAR MIEMBROS' para poder ejecutar esta acción.\n\n**NOTA:** No puedo expulsar a miembros que tengan permisos de **ADMINISTRADOR**.")
  .setColor("RED");

const success = (info) => {
  const { target, guild, reason } = info;

  return new MessageEmbed()
    .setTitle(`${target.user.username} has sido expulsado de la guild ${guild.name}.`)
    .setThumbnail(guild.iconURL({ size: 512 }))
    .setColor("ORANGE")
    .setDescription(`${reason ? "-" : reason}`)
    .setTimestamp();
}


module.exports = {
  name: "kick",
  guildOnly: true,
  description: "Expulsa a un miembro del servidor. Se puede usar más de una mención o ID, pero siempre la primera será el miembro a expulsar.",
  usage: "kick [@Mención || ID] (Razón)",
  aliases: [],
  permissions: ["KICK_MEMBERS"],
  nsfw: false,
  enabled: true,
  adminOnly: true,
  filename: path.basename(__filename),
  async execute(message = new Message(), args = new Array()) {
    const { channel, guild, member, client: Muki } = message;

    if (!args.length)
      return channel.send(noTarget);

    const content = args.join(" ");
    const mentionMatch = content.match(MessageMentions.USERS_PATTERN) || content.match(/(\d{17,19})/g);

    if (!mentionMatch) return;

    const memberIDS = mentionMatch.map(mention => mention.replace(/<@!?|>/g, ""));

    if (memberIDS[0] == Muki.user.id)
      return channel.send(`¡No puedo expulsarme a mi misma!`);

    const target = await guild.members.fetch(memberIDS[0]).catch(() => null);
    if (!target) return channel.send(noTarget);

    const adminRole = Muki.db.guildConfigs.get(guild.id).adminRole;

    if (!member.hasPermission(this.permissions, { checkAdmin: true, checkOwner: true }) && !member.roles.cache.has(adminRole))
      return channel.send('No tienes permiso para usar este comando.');

    if (target.hasPermission('ADMINISTRATOR', { checkAdmin: true, checkOwner: true }) || target.roles.cache.has(adminRole)) return channel.send(notAllowed);
    if (!target.kickable) return channel.send(noPermissions);

    const reason = args.slice(1).join(" ");
    await target.send(targetMessage({ reason, guild })).catch(err => console.log('No puedo mensajear a este usuario. ' + err));
    await target.kick(reason);

    return channel.send(success({ guild, target, reason }));
  }
}
