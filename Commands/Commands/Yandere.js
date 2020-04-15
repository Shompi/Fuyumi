const fetch = require('node-fetch');
const { MessageEmbed, Message } = require('discord.js');
const Booru = require('../../Classes/Booru')
const path = require('path');

const fetchError = new MessageEmbed()
  .setTitle("❌ Fetch error.")
  .setDescription("Lo siento, hubo un error al hacer el request a **yande.re/post**. Por favor inténtalo más tarde.")
  .setColor("RED");

const noResults = new MessageEmbed()
  .setTitle('❌ No encontré nada con los tags que ingresaste.')
  .setDescription('Nota: No puedes hacer una búsqueda con más de 3 tags debido a limitaciones de la api.')
  .setColor('RED');

const ratings = (rating) => {

  const r = {
    e: "Explícito",
    q: "Cuestionable",
    s: "Seguro"
  }

  return r[rating] || 'Desconocido';
};

const showpage = (post = Booru.YanderePost[0], message = new Message(), index, total) => {
  const tags = post.tags.split(" ").slice(0, 10).join(", ").replace(/_/g, " ");
  const embed = new MessageEmbed()
    .setAuthor(`->Full Resolución<-`, null, post.file_url)
    .setDescription(`**Resolución:** ${post.sample_width}x${post.sample_height} **Rating:** ${ratings(post.rating)}\n**Tags:** ${tags}`)
    .setImage(post.sample_url)
    .setFooter(`[${index + 1} de ${total}] - Post ID: ${post.id}`, message.author.displayAvatarURL({ size: 64 }))
    .setTimestamp();

  if (message.channel.type == 'dm') {
    embed.setColor('BLUE');
  } else {
    embed.setColor(message.member.displayColor)
  }
  return embed;
}

module.exports = {
  name: "dere",
  filename: path.basename(__filename),
  description: "Busca imágenes en **Yande.re**.",
  usage: "dere [tags]",
  nsfw: true,
  enabled: true,
  aliases: [],
  permissions: [],
  cooldown: 5,
  async execute(message = new Message(), args = new Array()) {
    const { channel, author } = message;
    try {
      let content = message.content.split(" ").slice(1).join(" ");

      if (content.split(/\s*\+\s*/g).length >= 3) return message.reply('lo siento, solo puedes usar un máximo de 3 tags para la búsqueda.');

      let query = content.replace(/\s*\+\s*/g, "+").replace(/\s+/g, "_");
      let blacklist = '+-loli'; //Tags blacklist
      let response = Booru.YanderePost;

      let data = await fetch(`https://yande.re/post.json?limit=100&tags=${query}${blacklist}`).catch(e => {
        throw 'Fetch Error: ' + e.code;
      });

      response = await data.json();

      if (response.length === 0) return channel.send(noResults);

      let pageindex = Math.floor(Math.random() * response.length);
      const embed = showpage(response[pageindex], message, pageindex, response.length);
      const msg = await channel.send(embed);

      await msg.react('⬅');
      await msg.react('➡');
      await msg.react('🔄');
      const filter = (reaction, user) => ((reaction.emoji.name === '⬅' || reaction.emoji.name === '➡' || reaction.emoji.name === '🔄') && user.id === author.id);

      await msg.createReactionCollector(filter, { time: 1000 * 60 * 4 })
        .on('collect', async (reaction, user) => {
          if (reaction.emoji.name == '➡') {
            pageindex++;
            if (pageindex >= response.length) pageindex = 0;
            const page = showpage(response[pageindex], message, pageindex, response.length);
            msg.edit(page);
          }

          if (reaction.emoji.name == '⬅') {
            pageindex--;
            if (pageindex < 0) pageindex = response.length - 1;
            const page = showpage(response[pageindex], message, pageindex, response.length);
            msg.edit(page);
          }

          if (reaction.emoji.name == '🔄') {
            pageindex = Math.floor(Math.random() * response.length);
            const page = showpage(response[pageindex], message, pageindex, response.length);
            msg.edit(page);
          }

        })
        .on('end', async () => {
          if (channel.type === 'dm') return;
          else msg.reactions.removeAll();
        })

    }
    catch (error) {
      console.log(error);
      return channel.send(error);
    }
  }
}