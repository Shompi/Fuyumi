const { Message, Client, GuildEmoji } = require('discord.js');
const ErrorMsg = 'El tiempo para usar este comando ha expirado.';
const ChannelTypes = ['text', 'voice'];


module.exports = async (message = new Message(), Muki = new Client()) => {
  /**
   * Command args format
   * '[requerido] <Opcional>, separador ' | '\n[Nombre del canal] | [Tipo de canal: voice, text, category] | <categoria>'
   * [channelname] | [channeltype] | <channelparent>
   */
  const filter = (msg) => msg.author.id === message.author.id;
  try {
    const mukibye = Muki.emojis.find(em => em.name === 'muki_bye');
    const mukizzz = Muki.emojis.find(em => em.name === 'muki_zzz');
    const mukithumbs = Muki.emojis.find(em => em.name === 'muki_thumbsup');

    let response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] }).catch(err => {
      throw { message: 'expired', emoji: mukizzz };
    });
    if (response.first().content == 'cancel') throw { message: 'canceled', emoji: mukibye };
    let args = response.first().content.replace(/\s+/, ' ').split(' | ');

    const channelname = args.shift();
    let channeltype = args.shift();
    let channelparent = args.shift();
    if (channelparent) channelparent = message.guild.channels.find(ch => ch.type === 'category' && ch.name.toLowerCase() === channelparent.toLowerCase());

    if (!ChannelTypes.includes(channeltype)) {
      do {
        await message.reply('el tipo de canal introducido no es un tipo de canal válido.\nPor favor ingrésalo nuevamente:');
        let response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] }).catch(err => {
          throw { message: 'expired', emoji: mukizzz };
        })
        channeltype = response.first().content;
      } while (!ChannelTypes.includes(channeltype));
    }

    if (channeltype == 'voice') {
      await message.channel.send('Ingresa el bitrate para el canal (25 - 64):');
      do {
        let response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] }).catch(err => {
          throw { message: 'expired', emoji: mukizzz };
        })
  
        let bits = response.first().content;
        if (isNaN(bits)) {
          do {
            await message.reply('por favor solo ingresa numeros:');
            response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] }).catch(err => {
              throw { message: 'expired', emoji: mukizzz };
            })
            bits = response.first().content;
            if (isNaN(bits)) throw { message: 'bitrateError', emoji: mukibye };
          } while (isNaN(bits));
        }
        bitrate = new Number(bits);
        if (bitrate <= 12 || bitrate >= 64) return await message.reply('el bitrate ingresado está fuera del rango, por favor ingrésalo de nuevo:');
      } while (bitrate <= 12 || bitrate >= 64);

      let channelbitrate = bitrate * 1000;
      const createdChannel = await message.guild.channels.create(channelname, { type: 'voice', bitrate: channelbitrate, parent: channelparent, reason: message.author.tag })
      return await message.channel.send(`${mukithumbs}`);
    }

    if (channeltype == 'text') {
      await message.reply('ingresa un tópico para este canal:');
      let response = await message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] }).catch(err => {
        return undefined;
      });
      let topic = response.first().content;
      if (!topic || topic == 'no topic') topic = null;
      await message.guild.channels.create(channelname, { type: 'text', parent: channelparent, topic: topic, reason: message.author.tag })
      return message.channel.send(`${mukithumbs}`);
    }

  } catch (error) {
    if (error.message == 'canceled') return await message.channel.send(`${error.emoji}`);
    if (error.message == 'expired') return await message.channel.send(`${error.emoji}`);
    if (error.message == 'bitrateError') return await message.channel.send(`${error.emoji}`);
  }
}