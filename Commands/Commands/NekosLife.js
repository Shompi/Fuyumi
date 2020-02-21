//Nekos.life API
const { Message, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

const ENDPOINTS =
  ['femdom', 'tickle',
    'classic', 'ngif',
    'erofeet', 'meow',
    'erok', 'poke',
    'les', 'v3',
    'hololewd', 'nekoapi_v3.1',
    'lewdk', 'keta',
    'feetg', 'nsfw_neko_gif',
    'eroyuri', 'kiss',
    '8ball', 'kuni',
    'tits', 'pussy_jpg',
    'cum_jpg', 'pussy',
    'lewdkemo', 'lizard',
    'slap', 'lewd',
    'cum', 'cuddle',
    'spank', 'smallboobs',
    'goose', 'Random_hentai_gif',
    'avatar', 'fox_girl',
    'nsfw_avatar', 'hug',
    'gecg', 'boobs',
    'pat', 'feet',
    'smug', 'kemonomimi',
    'solog', 'holo',
    'wallpaper', 'bj',
    'woof', 'yuri',
    'trap', 'anal',
    'baka', 'blowjob',
    'holoero', 'feed',
    'neko', 'gasm',
    'hentai', 'futanari',
    'ero', 'solo', 'waifu',
    'pwankg', 'eron', 'erokemo'];

const ErrorEmbed = (response) => {
  return new MessageEmbed()
    .setTitle("Error en la API")
    .setColor("RED")
    .setDescription(`Codigo de error: ${response.status}`);
}

const imageEmbed = (author, data) => {
  return new MessageEmbed()
    .setImage(data.url)
    .setColor("LUMINOUS_VIVID_PINK")
    .setFooter(`${author.tag} - Powered by Nekos.life`, author.displayAvatarURL({ size: 128 }));
}

module.exports = {
  name: "nekos",
  description: "Envía una imágen desde Nekos.life",
  nsfw: true,
  enabled: true,
  aliases: ENDPOINTS,
  permissions: ["SEND_MESSAGES"],

  async execute(message = new Message(), args = new Array()) {
    //Check if channel is NSFW
    const { channel, author } = message;
    const endpoint = args.shift() || "neko";

    try {
      let response = await fetch(`https://nekos.life/api/v2/img/${endpoint}`);
      if (!response.ok) return await channel.send(ErrorEmbed(response));

      const data = await response.json();

      return await channel.send(imageEmbed(author, data));

    } catch (err) {
      console.log("Ha ocurrido un error en Nekos.life");
      console.log(err);
      let Embed = new MessageEmbed().setTitle("Error en API Nekos.life").setDescription("Hubo un error con la api de Nekos.life, por favor avisale a ShompiFlen#3338").setColor('RED');
      return await channel.send(Embed);
    }
  }

}
