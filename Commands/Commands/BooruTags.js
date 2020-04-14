const { YandereTags, YanderePost } = require('../../Classes/Booru');
const { MessageEmbed, Message } = require('discord.js');
const endpoint = 'https://yande.re/tag.json?&type=&order=count&commit=Search&limit=20&name=';
const postsEndpoint = 'https://yande.re/post.json?limit=100&tags=';
const fetch = require('node-fetch');
const path = require('path');

const fetchError = (error) => {
  console.log(error);

  return new MessageEmbed()
    .setTitle('🚫 Hubo un error de conexión con yande.re/tags.')
    .setColor("RED")
    .setDescription("Por favor inténtalo mas tarde.")
    .setFooter(`Código de error: ${error.code}`);
}

const noResults = new MessageEmbed()
  .setTitle('❌ No encontré ningún tag que coincida.')
  .setColor('RED');

const tagsFound = (query, thumbnail, description) =>
  new MessageEmbed()
    .setTitle(`Búsqueda: "${query}"`)
    .setColor('BLUE')
    .setThumbnail(thumbnail)
    .addFields({ name: 'Resultados:', value: `${description.join('\n')}`, inline: false });

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
  name: "tags",
  filename: path.basename(__filename),
  description: "Busca un tag en **yande.re/tags**",
  usage: "tags [palabra clave]",
  nsfw: false,
  enabled: true,
  aliases: ["boorutags", "yanderetag", "yanderetags", "ytags", "deretags"],
  permissions: [],

  async execute(message = new Message(), args = new Array()) {
    const { channel } = message;
    const msg = await channel.send("Buscando...");
    let response = YandereTags;
    let query = args.join(" ").replace(/ +/g, " ");

    let tag = query.replace(" ", "_");
    try {
      response = await fetch(endpoint + tag).then(res => res.json());
    } catch (e) {
      return msg.edit(null, { embed: fetchError(e) });
    }

    if (response.length === 0 && query.endsWith('*')) return msg.edit(null, { embed: noResults });

    if (response.length === 0 && !query.endsWith('*')) {
      try {
        response = await fetch(endpoint + tag + '*').then(res => res.json());
      } catch (e) {
        return msg.edit(null, { embed: fetchError(e) });
      }
      if (response.length === 0) return msg.edit(null, { embed: noResults });
    }

    let posts = YanderePost;
    let thumbnail = null;
    try {
      posts = await fetch(postsEndpoint + response[0].name).then(res => res.json());
    } catch (e) {
      return msg.edit(null, { embed: fetchError(e) });
    }
    const filteredPosts = posts.filter(post => post.rating === 's' || post.rating === 'q');
    if (filteredPosts.length >= 1) {
      thumbnail = filteredPosts[Math.floor(Math.random() * filteredPosts.length)].sample_url;
    }

    let description = [];

    for (let i = 0; i < response.length; i++) {
      let name = response[i].name.replace(/_/g, " ");
      let type = getTagType(response[i].type);
      description.push(`**${type}**\t - \t${name}`)
    }

    return msg.edit(null, { embed: tagsFound(query, thumbnail, description) });
  }
}