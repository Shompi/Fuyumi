const fetch = require('node-fetch');
const { MessageEmbed, Message } = require('discord.js');
const Booru = require('../../Classes/Booru')
module.exports = async (message = new Message()) => {
  try {
    let content = message.content.split(" ").slice(1).join(" ");

    if (content.split(/\s*\+\s*/g).length >= 3) return await message.reply('lo siento, solo puedes juntar máximo 3 tags para la búsqueda.');
    let query = content.replace(/\s*\+\s*/g, "+").replace(/\s+/g, "_");
    let blacklist = '+-loli+-scat'; //Tags blacklist
    let response = Booru.YanderePost;

    console.log(query);
    let data = await fetch('https://yande.re/post.json?limit=100&tags=' + query + blacklist);
    if (data.status != 200) {
      await message.channel.send("Error al conectar con el servidor, codigo: " + data.status);
      console.log(data);
      return;
    }
    response = await data.json();

    if (response.length === 0) {

      const noResults = new MessageEmbed()
        .setTitle('❌ No encontré nada con los tags que ingresaste.')
        .setDescription('Puedes buscar un tag escribiendo:\n\`muki!tag <tagAqui>\`\n\nPuedes agregar un** * **alfinal para intentar autocompletar la búsqueda.')
        .setColor('RED');

      return await message.channel.send(noResults);
    }

    let pageindex = Math.floor(Math.random() * response.length);
    const embed = await showpage(response[pageindex], message, pageindex, response.length);
    const msg = await message.channel.send(embed);

    await msg.react('⬅');
    await msg.react('➡');
    await msg.react('🔄');
    const filter = (reaction, user) => ((reaction.emoji.name === '⬅' || reaction.emoji.name === '➡' || reaction.emoji.name === '🔄') && user.id === message.author.id);
  
    await msg.createReactionCollector(filter, { time: 1000 * 60 * 4 })
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

        if (reaction.emoji.name == '🔄') {
          pageindex = Math.floor(Math.random() * response.length);
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
    console.log(String(error));
  }
}


const getRating = (r) => {
  if (r === 'e') return ("Explícito");
  if (r === 'q') return ("Cuestionable");
  if (r === 's') return ("Seguro");
  return 'Desconocido';
}

const showpage = async (post = Booru.YanderePost[0], message = new Message(), index, total) => {
  const newRating = getRating(post.rating);
  const tags = post.tags.split(" ").slice(0,10).join(", ").replace(/_/g, " ");
  const embed = new MessageEmbed()
    .setAuthor(`->Full Resolución<-`, null, post.file_url)
    .setDescription(`**Resolución:** ${post.sample_width}x${post.sample_height} **Rating:** ${newRating}\n**Tags:** ${tags}`)
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