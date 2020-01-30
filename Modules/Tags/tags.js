const db = require('../LoadDatabase');
const tags = db.tags;
const { Message } = require('discord.js');
module.exports = async (message = new Message, content = '') => {
  if (!content) return await message.channel.send('Debes incluir al menos una palabra');
  if (!tags.has(message.author.id)) tags.set(message.author.id, []);
  
  if (tags.get(message.author.id).find(item => item.tag == content)) return await message.channel.send('Ya tienes registrado este tag.\nPara ver tus tags escribe muki!mytags');
  else {
    let tag = {
      guild: message.guild.name,
      author:message.author.tag,
      tag: content,
      created: new Date()
    }

    tags.push(message.author.id, tag);
    console.log(tags.get(message.author.id));
    return await message.channel.send(`El tag \`${content}\` se ha guardado exitosamente!`);
  }
}
