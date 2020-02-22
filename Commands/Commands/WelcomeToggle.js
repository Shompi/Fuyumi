//Toggle Welcome Messages.

const { MessageEmbed, Message, Client } = require('discord.js');
const database = require('../LoadDatabase').guildConfigs;

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
  filename: __filename,
  description: "Activa / Desactiva los **Mensajes de Bienvenida**.",
  usage: "wtoggle <Sin Parámetros>",
  nsfw: false,
  enabled: true,
  aliases: [],
  permissions: [],
  async execute(message = new Message(), args = new Array()) {
    //In this command, content is irrelevant.
    const { author, guild, member, channel, client } = message;

    //Check Permissions.
    if (!member.hasPermission("ADMINISTRATOR", { checkOwner: true })) return await channel.send(missingPermissions(author));

    const config = database.get(guild.id);
    if (!config) return console.log(`Por alguna razón, la guild ${guild.name} no tenia entrada de configuración. WelcomeToggle.js`);

    //This basically means, if it was true, then its changed to false.
    //If it was false, then change it to true.
    config.welcome.enabled = config.welcome.enabled ? false : true;

    database.set(guild.id, config)
    console.log(`Mensajes de bienvenida ${config.welcome.enabled ? "Activados" : "Desactivados"} en la guild ${guild.name}`);
    return await channel.send(toggled(config, client));
  }
}