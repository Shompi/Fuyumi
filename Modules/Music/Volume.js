const { Message } = require('discord.js')

module.exports = async (message = new Message(), content) => {
  try {
    if (message.guild.voice && message.guild) {
      if (isNaN(content)) return await message.reply("El valor debe ser solamente numérico (1-15)");
      if (content > 15) {
        const hamtaroNo = message.guild.emojis.find(em => em.name == 'Hamtaro_NO');
        return await message.channel.send(`${hamtaroNo}`);
      }
      const dispatcher = message.guild.me.voice.connection.dispatcher;
      volume = content / 100;
      return dispatcher.setVolume(volume);
    }
  } catch (error) {
    console.log('Hubo un error en Volume.js');
    console.log(error);
  }
}
