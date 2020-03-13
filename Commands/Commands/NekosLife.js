//Nekos.life API
const { Message, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const database = require("../LoadDatabase").guildConfigs;
const path = require('path');
const API = 'https://nekos.life/api/v2/img/';


const notNSFW = new MessageEmbed()
  .setTitle(`🛑 ¡Alto ahí!`)
  .setDescription(`¡Solo puedes utilizar este comando en canales **NSFW**!`)
  .setColor("RED");

const SFWENDPOINTS =
  [
    'tickle', 'meow', 'poke', 'kiss', '8ball',
    'lizard', 'cuddle', 'goose', 'avatar', 'hug', 'pat', 'smug', 'kemonomimi', 'wallpaper',
    'woof', 'baka', 'feed'
  ];

const NSFWENDPOINTS =
  [
    'femdom', 'classic', 'ngif', 'erofeet', 'erok', 'les', 'hololewd', 'lewdk', 'keta',
    'feetg', 'eroyuri', 'kuni', 'tits', 'pussy_jpg', 'cum_jpg', 'pussy', 'lewdkemo',
    'slap', 'lewd', 'cum', 'spank', 'smallboobs', 'fox_girl', 'nsfw_avatar', 'gecg', 'boobs',
    'feet', 'solog', 'holo', 'bj', 'yuri', 'trap', 'anal', 'blowjob', 'holoero', 'neko', 'gasm',
    'hentai', 'futanari', 'ero', 'solo', 'waifu', 'pwankg', 'eron', 'erokemo'
  ];

const ErrorEmbed = (response) => {
  return new MessageEmbed()
    .setTitle("Error en la API")
    .setColor("RED")
    .setDescription(`Codigo de error: ${response.status}`);
}

const imageEmbed = (author, data, endpoint) => {
  return new MessageEmbed()
    .setImage(data.url)
    .setColor("LUMINOUS_VIVID_PINK")
    .setFooter(`${author.tag} - Powered by Nekos.life | ${endpoint}`, author.displayAvatarURL({ size: 128 }));
}

module.exports = {
  name: "neko",
  filename: path.basename(__filename),
  description: "Obtiene una imágen desde Nekos.life y la envía al canal.\n**NOTA:** El endpoint debe ir inmediatamente luego del prefijo, sin espacios.",
  usage: "endpoint",
  nsfw: false,
  enabled: true,
  aliases: [...NSFWENDPOINTS, ...SFWENDPOINTS],
  permissions: ["SEND_MESSAGES"],

  async execute(message = new Message(), args = new Array()) {

    const { channel, author, content, guild } = message;
    const prefix = database.get(guild.id, "prefix");
    const endpoint = content.slice(prefix.length);

    try {
      if (NSFWENDPOINTS.includes(endpoint) && !channel.nsfw) return await channel.send(notNSFW);
      else {
        let response = await fetch(`${API}${endpoint}`).then(res => res.json()).catch((msg) => null);
        if (!response) throw new Error('Hubo un error en la api de nekos.life');

        await channel.send(imageEmbed(author, response, endpoint));
      }

    }
    catch (err) {
      console.log("Ha ocurrido un error en Nekos.life");
      console.log(err);
      let Embed = new MessageEmbed()
        .setTitle("Error en API Nekos.life")
        .setDescription("Hubo un error con la api de Nekos.life, por favor avisale a ShompiFlen#3338")
        .setColor('RED');
      await channel.send(Embed);
    }
  }

}
