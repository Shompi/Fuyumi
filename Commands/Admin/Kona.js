const fetch = require('node-fetch');
const { MessageEmbed, Message } = require('discord.js');
const endpoint = 'https://konachan.com/post.json?limit=40&tags=';
const Booru = require('../../Classes/Booru');


const noResults = new MessageEmbed()
  .setTitle('❌ No encontré nada con los tags que ingresaste.')
  .setDescription('Nota: No puedes hacer una búsqueda con más de 3 tags debido a limitaciones del servidor.')
  .setColor('RED')

const notNSFW = new MessageEmbed()
  .setTitle(`🛑 ¡Alto ahí!`)
  .setDescription(`¡Solo puedes utilizar este comando en canales **NSFW**!`)
  .setColor("RED");

module.exports = async (message = new Message()) => {
  try {
    const { member, channel, author } = message;

    if (!channel.nsfw) return await channel.send(notNSFW);

    let pageindex = 0;
    let content = message.content.split(" ").slice(1).join(" ");
    let query = content.replace(/\s*\+\s*/g, "+").replace(/\s+/g, "_");
    let response = Booru.KonaPost;
    let blacklist = '+-loli+-rape'; //Tags blacklist

    let data = await fetch(endpoint + query + blacklist);
    if (!data.ok) return await channel.send("Error al conectar con el servidor, codigo: " + data.statusCode).catch(err => console.log(err));
    response = await data.json();

    if (response.length === 0) return await channel.send(noResults);

    const embed = await showpage(response[0], message, pageindex, response.length);
    const msg = await channel.send(embed);

    await msg.react('⬅');
    await msg.react('➡');

    const filter = (reaction, user) => reaction.emoji.name === '⬅' || reaction.emoji.name === '➡' && user.id === author.id;
    await msg.createReactionCollector(filter, { time: 1000 * 60 * 3.5 })
      .on('collect', async (reaction, user) => {
        if (reaction.emoji.name == '➡') {
          pageindex++;
          if (pageindex >= response.length) pageindex = 0;
          const page = await showpage(response[pageindex], message, pageindex, response.length);
          await msg.edit(page);
        }

        if (reaction.emoji.name == '⬅') {
          pageindex--;
          if (pageindex < 0) pageindex = response.length - 1;
          const page = await showpage(response[pageindex], message, pageindex, response.length);
          await msg.edit(page);
        }

      })
      .on('end', async () => await msg.reactions.removeAll());
  }
  catch (error) {
    console.log(error);
  }

}

const getRating = (r) => {
  if (r === 'e') return ("Explicito");
  if (r === 'q') return ("Cuestionable");
  if (r === 's') return ("Seguro");
  return 'Desconocido';
}

const showpage = async (post = Booru.KonaPost[0], message = new Message(), index, total) => {
  const newRating = getRating(post.rating);
  const tags = post.tags.split(" ").slice(0, 10).join(", ").replace(/_/g, " ");

  const embed = new MessageEmbed()
    .setAuthor(`->Full Resolución<-`, null, post.jpeg_url)
    .setDescription(`**Resolución:** ${post.sample_width}x${post.sample_height} **Rating:** ${newRating}\n**Tags:** ${tags}`)
    .setImage(post.sample_url)
    .setFooter(`${message.author.tag} Konachan.com, [${index + 1} de ${total}]`, message.author.displayAvatarURL({ size: 64 }))
    .setTimestamp();

  if (message.channel.type == 'dm') {
    embed.setColor('BLUE');
  } else {
    embed.setColor(message.member.displayColor)
  }

  return embed;
}