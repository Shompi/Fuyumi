const { MessageEmbed, Message } = require('discord.js');
const path = require('path');

module.exports = {
  //This command should be Bot OWNER only.
  name: "revent",
  filename: path.basename(__filename),
  aliases: ["revt"],
  description: "Reinicia / Recarga un eventhandler. (Este es un comando interno.)",
  usage: "revent [Nombre del event handler]",
  nsfw: false,
  enabled: true,
  permissions: [],
  botOwnerOnly: true,
  /**
   * 
   * @param {Message} message 
   * @param {Array} args 
   */
  execute(message, args) {
    const { channel, client } = message;
    const eventname = args[0];

    const event = client.events.get(eventname);

    if (!event)
      return channel.send("No hay un evento registrado con ese nombre.");

    //Si se encuentra el evento:
    //Checkear si el evento contiene timers:
    if (event.hasTimers)
      event.clearTimers();

    delete require.cache[require.resolve(event.path)];

    try {
      const reload = require(event.path);

      client.events.set(reload.name, reload);
      return channel.send(`El evento **${reload.name}** ha sido reiniciado.`);
    } catch (error) {
      console.log(error);
    }
  }
}