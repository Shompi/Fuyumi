const fetch = require('node-fetch');
const { MessageEmbed, Message } = require('discord.js');
const endpoint = 'http://konachan.net/post.json?limit=40&tags=';
const Booru = require('../../Classes/Booru')

module.exports = async (message = new Message()) => {
  let response = Booru.KonaPost;
  let content = message.content.split(" ").slice(1).join(" ");
  let query = content.replace(/\s*\+\s*/g, "+").replace(/\s+/g, "_");
  try {

    let pageindex = 0;
    let data = await fetch(endpoint + query + '+rating:safe');
    if (!data.ok) return await message.channel.send("Error al conectar con el servidor, codigo: " + data.status).catch(console.error);
    //console.log(data.status);
    response = await data.json();

    if (response.length === 0) {

      const noResults = new MessageEmbed()
        .setTitle('❌ No encontré nada con los tags que ingresaste.')
        .setDescription('Puedes buscar un tag escribiendo\n\`muki!tag <tagAqui>\`\nPuedes agregar un** * **alfinal para intentar autocompletar la búsqueda.')
        .setColor('RED');

      return await message.channel.send(noResults);
    }

    const embed = await showpage(response[pageindex], message, pageindex, response.length);
    if (response.length == 1) return await message.channel.send(embed);

    const msg = await message.channel.send(embed);
    await msg.react('⬅');
    await msg.react('➡');
    const filter = (reaction, user) => reaction.emoji.name === '⬅' || reaction.emoji.name === '➡' && !user.bot;

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
      .on('end', async () => {
        if (message.channel.type == 'dm') throw `No se pueden quitar las reacciones en un DM. (${message.author.tag})`;
        return await msg.reactions.removeAll();
      })



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
  const tags = post.tags.split(" ").slice(0,10).join(", ").replace(/_/g, " ");
  
  const embed = new MessageEmbed()
  .setAuthor(`->Full Resolución<-`, null, post.jpeg_url)
  .setDescription(`**Resolución:** ${post.sample_width}x${post.sample_height} **Rating:** ${newRating}\n**Tags:** ${tags}`)
  .setImage(post.sample_url)
  .setFooter(`${message.author.tag} Konachan.net, [${index + 1} de ${total}]`, message.author.displayAvatarURL({ size: 64 }))
  .setTimestamp();

if (message.channel.type == 'dm') {
  embed.setColor('BLUE');
} else {
  embed.setColor(message.member.displayColor)
}

  return embed;
}