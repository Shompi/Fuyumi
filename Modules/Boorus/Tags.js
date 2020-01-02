const { YandereTags, YanderePost } = require('../../Classes/Booru');
const { MessageEmbed, Message } = require('discord.js');
const endpoint = 'https://yande.re/tag.json?&type=&order=count&commit=Search&limit=20&name=';
const postsEndpoint = 'https://yande.re/post.json?limit=100&tags=';
const fetch = require('node-fetch');


const noResults = new MessageEmbed()
  .setTitle('❌ No encontré ningún tag que coincida.')
  .setColor('RED');

module.exports = async (message = new Message(), query = new String()) => {
  try {
    let response = YandereTags;
    let tag = query.replace(" ", "_");
    response = await fetch(endpoint + tag).then(res => res.json());

    if (response.length === 0 && query.endsWith('*')) return await message.channel.send(noResults);

    if (response.length === 0 && !query.endsWith('*')) {
      response = await fetch(endpoint + tag + '*').then(res => res.json());
      if (response.length === 0) return await message.channel.send(noResults);
    }

    let posts = YanderePost;
    let thumbnail = null;
    posts = await fetch(postsEndpoint + response[0].name).then(res => res.json());
    const filteredPosts = posts.filter(post => post.rating === 's' || post.rating === 'q');
    if (filteredPosts.length >= 1) {
      thumbnail = filteredPosts[Math.floor(Math.random() * filteredPosts.length)].sample_url;
    }


    let description = [];
    for(let i = 0; i < response.length; i++){
      if (i >= 10) break;
      let name = response[i].name.replace(/_/g," ");
      let type = getTagType(response[i].type);
      description.push(`**${type}**\t - \t${name}`)
    }

    const tagsFound = new MessageEmbed()
      .setTitle(`Búsqueda: "${query}"`)
      .setColor('BLUE')
      .setThumbnail(thumbnail)
      .addField('Resultados:', `${description.join('\n')}`)

    if (response.length > 10) {
      tagsFound.setFooter('Solo se muestran los primeros 10 tags con más posts.')
    }
    return await message.channel.send(tagsFound);
  }
  catch (error) {
    console.log(error);
  }
}

const getTagType = (type) => {
  const types = [
    "General",
    "Artista",
    "Desconocido",
    "Copyright",
    "Personaje",
    "Circulo",
    "Faltas"
  ]

  return types[type];
}