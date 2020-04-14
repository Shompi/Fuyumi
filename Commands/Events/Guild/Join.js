const { MessageEmbed } = require('discord.js');

module.exports = new MessageEmbed()
  .setTitle(`¡Gracias por añadirme al servidor!`)
  .setDescription("Mi prefijo es `muki!`, puedes ver mi lista de comandos escribiendo `muki!help`.\n¡Asegúrate de tener activados los mensajes directos!\n\n**Nota:** Todos los comandos tienen un `cooldown` mínimo de 2 segundos, el bot **no responderá** a tus comandos si te encuentras bajo ese periodo de tiempo.")
  .setColor("BLUE")
  .setFooter("¿Dudas? ¿Sugerencias? Habla con ShompiFlen#3338");