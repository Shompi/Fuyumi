const { Guild, MessageEmbed } = require('discord.js');
const { basename } = require('path');


PRESENTACION = new MessageEmbed()
  .setTitle(`¡Gracias por añadirme al servidor!`)
  .setDescription("Mi prefijo es `muki!`, puedes ver mi lista de comandos escribiendo `muki!help`.\n¡Asegúrate de tener activados los mensajes directos!\n\n**Nota:** Todos los comandos tienen un `cooldown` mínimo de 2 segundos, el bot **no responderá** a tus comandos si te encuentras bajo ese periodo de tiempo.")
  .setColor("BLUE")
  .setFooter("¿Dudas? ¿Sugerencias? Habla con ShompiFlen#3338");

module.exports = {
  name: "guildCreate",
  filename: basename(__filename),
  path: __filename,
  hasTimers: false,
  /**
  *@param {Guild} guild
  */
  execute(guild) {
    /*Code Here*/

    const { client } = guild;

    const systemChannel = guild.systemChannel;

    if (!systemChannel) {
      const channels = guild.channels.cache.filter(ch => ch.type === 'text' && ch.permissionsFor(guild.me).has('SEND_MESSAGES'));

      if (channels.size > 0)
        channels.random().send(PRESENTATION).catch(console.error);
    }
    else {
      systemChannel.send(PRESENTATION).catch(console.error);
    }

    const joinedGuild = new MessageEmbed()
      .setAuthor(`${guild.name} (${guild.id})`, guild.iconURL({ size: 64 }))
      .setDescription(`Miembros: ${guild.memberCount}\nDueño: ${guild.owner.user.tag} (${guild.ownerID})\nCanales: ${guild.channels.cache.size}`)
      .setFooter("GUILD_CREATE")
      .setColor("GREEN");

    return client.channels.cache.get("585990511790391309").send(joinedGuild);
  }
}