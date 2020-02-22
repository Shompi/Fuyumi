const { Message, Client, GuildEmoji } = require('discord.js');
const ErrorMsg = 'El tiempo para usar este comando ha expirado.';
const ChannelTypes = ['text', 'voice'];


module.exports = {
  name: "newchannel",
  filename: __filename,
  description: "Crea un nuevo canal en este servidor. Los separadores **|** son **OBLIGATORIOS**.",
  usage: "newchannel [Nombre] | [Tipo: texto/voz] | (Canal / Categoria Padre)",
  nsfw: false,
  enabled: false,
  aliases: [],
  permissions: ["MANAGE_CHANNELS"],
  async execute(message = new Message(), args = new Array()) {
    const { client, channel, guild, author } = message;
    const Muki = client;
    /**
     * Command args format
     * '[requerido] <Opcional>, separador ' | '\n[Nombre del canal] | [Tipo de canal: voice, text, category] | <categoria>'
     * [channelname] | [channeltype] | <channelparent>
     */
    const filter = (msg) => msg.author.id === author.id;
    try {

      const mukibye = Muki.emojis.cache.find(em => em.name === 'muki_bye');
      const mukizzz = Muki.emojis.cache.find(em => em.name === 'muki_zzz');
      const mukithumbs = Muki.emojis.cache.find(em => em.name === 'muki_thumbsup');

      let response = await channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] }).catch(err => {
        throw { message: 'expired', emoji: mukizzz };
      });

      if (response.first().content == 'cancel') throw { message: 'canceled', emoji: mukibye };
      let args = response.first().content.replace(/\s+/, ' ').split(' | ');

      const channelname = args.shift();
      let channeltype = args.shift();
      let channelparent = args.shift();

      if (channelparent) channelparent = guild.channels.cache.find(ch => ch.type === 'category' && ch.name.toLowerCase() === channelparent.toLowerCase());

      if (!ChannelTypes.includes(channeltype)) {
        do {
          await message.reply('el tipo de canal introducido no es un tipo de canal válido.\nPor favor ingrésalo nuevamente:');
          let response = await channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] }).catch(err => {
            throw { message: 'expired', emoji: mukizzz };
          })
          channeltype = response.first().content;
        } while (!ChannelTypes.includes(channeltype));
      }

      if (channeltype == 'voice') {
        await channel.send('Ingresa el bitrate para el canal (25 - 64):');
        do {
          let response = await channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] }).catch(err => {
            throw { message: 'expired', emoji: mukizzz };
          })

          let bits = response.first().content;
          if (isNaN(bits)) {
            do {
              await message.reply('por favor solo ingresa numeros:');
              response = await channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] }).catch(err => {
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
        await guild.channels.create(channelname, { type: 'voice', bitrate: channelbitrate, parent: channelparent, reason: message.author.tag })
        return await channel.send(`${mukithumbs}`);
      }

      if (channeltype == 'text') {
        await message.reply('ingresa un tópico para este canal:');
        let response = await channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] }).catch(err => {
          return undefined;
        });
        let topic = response.first().content;
        if (!topic || topic == 'no topic') topic = null;
        await guild.channels.create(channelname, { type: 'text', parent: channelparent, topic: topic, reason: author.tag })
        return channel.send(`${mukithumbs}`);
      }

    } catch (error) {
      if (error.message == 'canceled') return await channel.send(`${error.emoji}`);
      if (error.message == 'expired') return await channel.send(`${error.emoji}`);
      if (error.message == 'bitrateError') return await channel.send(`${error.emoji}`);
    }
  }
}