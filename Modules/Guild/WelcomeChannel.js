const { MessageEmbed, Message, TextChannel } = require('discord.js');
const database = require('../LoadDatabase').guildConfigs;

const missingPermissions = (author) => {
  return new MessageEmbed()
    .setTitle(`❌ ¡Lo siento ${author.username}! No tienes permiso para utilizar este comando.`)
    .setColor("RED")
};

const noChannel = (prefix) => {
  return new MessageEmbed()
    .setTitle(`❌ ¡No has mencionado ningún canal!`)
    .setDescription(`Modo de uso:\n\`${prefix} [Mención de canal]\`\n\nEjemplo: \`${prefix}#algun-canal-de-texto\``)
    .setColor("RED")
};

const succeed = (channel = new TextChannel(), prefix) => {
  return new MessageEmbed()
    .setTitle(`¡El canal ${channel.name} ha sido asignado para las bienvenidas!`)
    .setDescription(`**Nota:** Este comando activa los mensajes de bienvenida por defecto.\nPara desactivar este comportamiento escribe \`${prefix}wtoggle\``)
    .setColor("GREEN")
};

module.exports = async (message = new Message(), content) => {
  //This command will set a WelcomeChannel to the guildConfigs database.
  //<Prefix>wchannel [ChannelMention]

  const { author, member, guild, mentions, channel } = message;
  const config = database.get(guild.id);

  if (!database.has(guild.id)) return console.log(`Por alguna razón, la guild ${guild.name} no tenia entrada de configuración. WelcomeChannel.js`);

  //Check Permissions.
  if (member.hasPermission("ADMINISTRATOR", { checkOwner: true })) {

    //Check if a channel was mentioned.
    const mentionedChannel = mentions.channels.first();
    if (!mentionedChannel) return await channel.send(noChannel(config.prefix));

    //If it was
    config.welcome.channelID = mentionedChannel.id;
    config.welcome.enabled = true;

    database.set(guild.id, config);

    return await channel.send(succeed(mentionedChannel, config.prefix));
  }
  else return await channel.send(missingPermissions(author));
}