const fetch = require('node-fetch');
const baseURL = 'https://animeflv.chrismichael.now.sh/api/v1/Search/';
const episodesURL = 'https://animeflv.net/ver/';
const animeURL = 'https://animeflv.net/anime/';
const { SearchResponse } = require('../../Classes/AnimeFLV');
const { Message, MessageEmbed } = require('discord.js');
const path = require('path');


const EmbedMaker = (message = new Message(), page) => {

  return new MessageEmbed()
    .setTitle(`${page.title}\nRating: ${page.rating} ⭐`)
    .setColor(message.member.displayColor)
    .setDescription(
      `**Generos:** ${page.genres.join(", ")}\n\n` +
      `**Sinopsis:** ${page.synopsis}\n\n` +
      `**Estado:** ${page.episodes[0].nextEpisodeDate ? `En emisión 🟢\n**Próximo episodio:** ${page.episodes[0].nextEpisodeDate}` : `Finalizado 🔴`}\n` +
      `**Tipo:** ${page.type}\n` +
      `**Episodios:** ${page.episodes.length - 1}\n\n` +
      `[Ver el último episodio.](${episodesURL + page.episodes[1].id})` +
      `\n\n[¡Comienza a ver este Anime!](${episodesURL + page.episodes[page.episodes.length - 1].id})`
    )
    .setFooter("<- API de Chris Michael Perez Santiago en Github", "https://avatars1.githubusercontent.com/u/21962584?s=460&v=4")
    .setThumbnail(page.poster);

}


module.exports = {
  name: "flv",
  filename: path.basename(__filename),
  description: "Busca un animé en el catálogo de AnimeFLV.net",
  usage: "flv [Título del animé]",
  nsfw: false,
  enabled: true,
  aliases: [],
  permissions: [],
  async execute(message = new Message(), args = new Array()) {

    const { channel, author } = message;
    let search = args.join(" ");

    if (!search) return await channel.send("No has ingresado ninguna palabra para realizar la búsqueda.");
    let query = search.replace(/\s+/g, '%20');

    let response = new SearchResponse();

    //In case the fetching fails, we return an empty array.
    response = await fetch(baseURL + query).then(res => res.json()).catch(er => { search: [] });

    if (response.search.length == 0) return await channel.send("No he encontrado ningún Anime con ese nombre.");
    if (response.search.length == 1) return await channel.send(EmbedMaker(message, response.search[0]));
    else {
      let pageindex = 0;

      const sendedMessage = await channel.send(EmbedMaker(message, response.search[pageindex]));
      await sendedMessage.react('⬅');
      await sendedMessage.react('➡');

      const filter = (reaction, user) => reaction.emoji.name === '⬅' || reaction.emoji.name === '➡' && user.id === author.id;

      const collector = sendedMessage.createReactionCollector(filter, { time: 60000 });

      collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === '➡') {
          pageindex++;
          if (pageindex == response.search.length) pageindex = 0;
          const nextPage = await EmbedMaker(message, response.search[pageindex])
          await sendedMessage.edit(null, { embed: nextPage });
        }
        if (reaction.emoji.name === '⬅') {
          pageindex--;
          if (pageindex < 0) pageindex = response.search.length - 1;
          const nextPage = await EmbedMaker(message, response.search[pageindex])
          await sendedMessage.edit(null, { embed: nextPage });
        }
      });
    }
  }
}