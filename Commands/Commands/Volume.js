const { Message } = require('discord.js')

module.exports = {
  name: "volume",
  description: "Modifica el volumen del bot.",
  usage: "volume [Número 1-25]",
  nsfw: false,
  enabled: true,
  aliases: [],
  permissions: [],
  async execute(message = new Message(), args = new Array()) {
    const { guild, channel, client } = message;
    try {
      if (guild.voice) {
        if (isNaN(content)) return await message.reply("El valor debe ser solamente numérico (1-25)");
        if (content > 25) {
          const hamtaroNo = client.emojis.cache.find(em => em.name == 'Hamtaro_NO');
          return await channel.send(`${hamtaroNo}`);
        }
        const dispatcher = guild.me.voice.connection.dispatcher;
        volume = content / 100;
        return dispatcher.setVolume(volume);
      }
    } catch (error) {
      console.log('Hubo un error en Volume.js');
      console.log(error);
    }
  }
}
