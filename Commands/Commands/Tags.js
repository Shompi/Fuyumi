const { YandereTags, YanderePost } = require('../../Classes/Booru');
const { MessageEmbed, Message } = require('discord.js');
const endpoint = 'https://yande.re/tag.json?&type=&order=count&commit=Search&limit=20&name=';
const postsEndpoint = 'https://yande.re/post.json?limit=100&tags=';
const fetch = require('node-fetch');


const noResults = new MessageEmbed()
  .setTitle('❌ No encontré ningún tag que coincida.')
  .setColor('RED');

const tagsFound = (query, thumbnail, description) =>
  new MessageEmbed()
    .setTitle(`Búsqueda: "${query}"`)
    .setColor('BLUE')
    .setThumbnail(thumbnail)
    .addField('Resultados:', `${description.join('\n')}`);

const getTagType = (type) => {
  const types = [
    "General",
    "Artista",
    "Desconocido",
    "Copyright",
    "Personaje",
    "Circulo",
    "Faltas"
  ];
  return types[type];
}

module.exports = {
  name: "btags",
  description: "Booru Tag. Busca un tag en la base de datos de **Yandere.com**",
  usage: "btags [tag]",
  nsfw: false,
  enabled: true,
  permissions: "",

  async execute(message = new Message(), args = new Array()) {
    const { channel } = message;

    let response = YandereTags;
    let query = args.join(" ").replace(/ +/g, " ");

    let tag = query.replace(" ", "_");
    response = await fetch(endpoint + tag).then(res => res.json());

    if (response.length === 0 && query.endsWith('*')) return await channel.send(noResults);

    if (response.length === 0 && !query.endsWith('*')) {
      response = await fetch(endpoint + tag + '*').then(res => res.json());
      if (response.length === 0) return await channel.send(noResults);
    }

    let posts = YanderePost;
    let thumbnail = null;
    posts = await fetch(postsEndpoint + response[0].name).then(res => res.json());
    const filteredPosts = posts.filter(post => post.rating === 's' || post.rating === 'q');
    if (filteredPosts.length >= 1) {
      thumbnail = filteredPosts[Math.floor(Math.random() * filteredPosts.length)].sample_url;
    }

    let description = [];

    for (let i = 0; i < response.length; i++) {
      if (i >= 10) break;
      let name = response[i].name.replace(/_/g, " ");
      let type = getTagType(response[i].type);
      description.push(`**${type}**\t - \t${name}`)
    }


    //if (response.length > 10) tagsFound.setFooter('Solo se muestran los primeros 10 tags con más posts.');
    return await channel.send(tagsFound(query, thumbnail, description));
  }
}