const { Message } = require('discord.js');
const path = require('path');

let config = {
  enabled: false,
  channel: "",
}



module.exports = {
  name: "streams",
  description: "Define un canal para enviar los livestreams de Twitch, Youtube y Go Live.",
  aliases: ["",],
  filename: path.basename(__filename),
  usage: "streams #menciondelcanal",
  nsfw: false,
  enabled: true,
  permissions: ["ADMINISTRATOR"],
  botOwnerOnly: false,
  guildOnly: true,
  moderationOnly: false,
  /**
   * 
   * @param {Message} message 
   * @param {Array} args 
   */
  execute(message, args) {    /*Code Here*/

    const { guild, member, client } = message;

    if (!client.db.enabledStreams.has(guild.id)) {
      client.db.enabledStreams.set(guild.id, config);
    }

    config = client.db.enabledStreams.get(guild.id);

    if (member.hasPermission("ADMINISTRATOR", { checkAdmin: true, checkOwner: true })) {

      if (!message.mentions.channels.size && !args[0]) {
        //if there is no channel mention and no args

        if (!config.channel) {
          return message.channel.send(`Este servidor no tiene un canal de directos configurado, debes usar el comando de la siguiente forma: \`prefijo!streams #menciondelcanal o ID del canal\`.`);
        } else {
          const channel = guild.channels.cache.get(config.channel);
          if (!channel)
            return message.channel.send(`No encontré el canal de directos, por favor ejecuta el comando nuevamente mencionando el canal para enviar los directos.`);

          config.enabled = !config.enabled;
          message.channel.send(`Se han ${config.enabled ? "**activado**" : "**desactivado**"} los directos en el canal ${channel.name}`);
        }
      } else {
        const channel = message.mentions.channels.first() || guild.channels.cache.get(args[0]);
        if (!channel)
          return message.channel.send('No encontré un canal con esa ID.');
        if (channel.type !== "text")
          return message.channel.send('¡La id debe ser de un canal de texto!');

        config.channel = channel.id;
        config.enabled = true;
        message.channel.send(`Se enviarán los directos en el canal ${channel}.`);
      }
    }
    client.db.enabledStreams.set(guild.id, config);
  }
}