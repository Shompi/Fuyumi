const { MessageEmbed, Message, TextChannel } = require('discord.js');
const path = require('path');

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
    .setTitle(`¡El canal #${channel.name} ha sido asignado para las bienvenidas!`)
    .setDescription(`**Nota:** Este comando activa los mensajes de bienvenida por defecto.\nPara desactivar este comportamiento escribe \`${prefix}wtoggle\``)
    .setColor("GREEN")
};

module.exports = {
  name: "wchannel",
  guildOnly: true,
  filename: path.basename(__filename),
  description: "Asigna una canal para enviar los **Mensajes de Bienvenida**.",
  usage: "wchannel [#Mencion del Canal]",
  nsfw: false,
  enabled: true,
  aliases: [],
  permissions: [],
  execute(message = new Message(), args = new Array()) {

    const { author, member, guild, mentions, channel, client: Muki } = message;
    const config = Muki.db.guildConfigs.get(guild.id);

    if (!database.has(guild.id)) return console.log(`Por alguna razón, la guild ${guild.name} no tenia entrada de configuración. WelcomeChannel.js`);

    //Check Permissions.
    if (member.hasPermission("ADMINISTRATOR", { checkOwner: true })) {

      //Check if a channel was mentioned.
      const mentionedChannel = mentions.channels.first();
      if (!mentionedChannel) return channel.send(noChannel(config.prefix));

      //Check if the channel exists in the guild.
      if (!guild.channels.cache.has(mentionedChannel.id)) return channel.send("El canal que has mencionado no existe en esta guild.");

      //If it was
      config.welcome.channelID = mentionedChannel.id;
      config.welcome.enabled = true;

      Muki.db.guildConfigs.set(guild.id, config);

      return channel.send(succeed(mentionedChannel, config.prefix));
    }
    else return channel.send(missingPermissions(author));
  }
}