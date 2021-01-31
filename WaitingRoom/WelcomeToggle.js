//Toggle Welcome Messages.

const { MessageEmbed, Message, Client } = require('discord.js');
const path = require('path');

const missingPermissions = (author) => {
  return new MessageEmbed()
    .setTitle(`❌ ¡Lo siento ${author.username}! No tienes permiso para utilizar este comando.`)
    .setColor("RED")
};

const toggled = (config, client = new Client()) => {
  const enabled = config.welcome.enabled;
  const channelID = config.welcome.channelID;
  const channel = client.channels.cache.get(channelID);

  return new MessageEmbed()
    .setTitle(`Los mensajes de bienvenida ahora están ${enabled ? "**Activados**" : "**Desactivados**"}`)
    .setDescription(`Canal: #${channel ? channel.name : "System Channel."}`)
    .setColor(`${enabled ? "GREEN" : "RED"}`)
}

module.exports = {
  name: "wtoggle",
  guildOnly: true,
  filename: path.basename(__filename),
  description: "Activa / Desactiva los **Mensajes de Bienvenida**.",
  usage: "wtoggle <Sin Parámetros>",
  nsfw: false,
  enabled: true,
  aliases: [],
  permissions: [],
  /**
   * 
   * @param {Message} message 
   * @param {Array} args 
   */
  execute(message, args) {    //In this command, content is irrelevant.
    const { author, guild, member, channel, client: Muki } = message;

    //Check Permissions.
    if (!member.hasPermission("ADMINISTRATOR", { checkOwner: true })) return channel.send(missingPermissions(author));

    const config = Muki.db.guildConfigs.get(guild.id);
    if (!config) return console.log(`Por alguna razón, la guild ${guild.name} no tenia entrada de configuración. WelcomeToggle.js`);

    //This basically means, if it was true, then its changed to false.
    //If it was false, then change it to true.
    config.welcome.enabled = config.welcome.enabled ? false : true;

    Muki.db.guildConfigs.set(guild.id, config)
    console.log(`Mensajes de bienvenida ${config.welcome.enabled ? "Activados" : "Desactivados"} en la guild ${guild.name}`);
    return channel.send(toggled(config, Muki));
  }
}