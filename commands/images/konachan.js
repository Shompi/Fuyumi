const { Command, CommandoMessage } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch').default;
const endpoint = 'https://konachan.com/post.json?limit=40&tags=';

const errorEmbed = new MessageEmbed()
  .setTitle("❌ Ocurrió un error al ejecutar este comando :(")
  .setColor("RED");

const showpage = (post = Booru.KonaPost[0], message = new Message(), index, total) => {
  const { author, member, channel } = message;
  const newRating = getRating(post.rating);
  const tags = post.tags.split(" ").slice(0, 10).join(", ").replace(/_/g, " ");

  const embed = new MessageEmbed()
    .setAuthor(`->Full Resolución<-`, null, post.jpeg_url)
    .setDescription(`**Resolución:** ${post.sample_width}x${post.sample_height} **Rating:** ${newRating}\n**Tags:** ${tags}`)
    .setImage(post.sample_url)
    .setFooter(`${author.tag} Konachan.com, [${index + 1} de ${total}]`, author.displayAvatarURL({ size: 64 }))
    .setTimestamp();

  if (channel.type == 'dm') {
    embed.setColor('BLUE');
  } else {
    embed.setColor(member.displayColor)
  }

  return embed;
}

const noResults = new MessageEmbed()
  .setTitle('❌ No encontré nada con los tags que ingresaste.')
  .setDescription('Nota: No puedes hacer una búsqueda con más de 3 tags debido a limitaciones del servidor.')
  .setColor('RED')

const getRating = (r) => {
  if (r === 'e') return ("Explicito");
  if (r === 'q') return ("Cuestionable");
  if (r === 's') return ("Seguro");
  return 'Desconocido';
}

module.exports = class KonachanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kona',
      memberName: 'konachan',
      aliases: ['konachan'],
      group: 'images',
      description: 'Busca imágenes en konachan.com',
      clientPermissions: [],
      examples: ["kona genshin impact + rating:safe", "kona hololive + rating:safe"],
      details: "Para omitir una etiqueta, reemplaza **+** por **-**"
    });
  }

  /**
   * @param { CommandoMessage } message 
   * @param {*} args 
   */
  async run(message, args) {

    if (!message.channel.nsfw && message.channel.type !== 'dm')
      return message.reply("No puedes usar este comando en canales que no estén marcados como NSFW.");

    const { channel, author } = message;

    try {
      let pageindex = 0;
      let content = message.content.split(" ").slice(1).join(" ");
      let query = content.replace(/\s*\+\s*/g, "+").replace(/\s+/g, "_");

      let response;
      let blacklist = '+-loli+-rape'; //Tags blacklist

      let data = await fetch(endpoint + query + blacklist).catch(e => {
        throw 'FetchError: ' + e.code;
      });

      response = await data.json();

      if (response.length === 0) return channel.send(noResults);

      const embed = showpage(response[0], message, pageindex, response.length);
      const msg = await channel.send(embed);

      await msg.react('⬅');
      await msg.react('➡');

      const filter = (reaction, user) => reaction.emoji.name === '⬅' || reaction.emoji.name === '➡' && user.id === author.id;
      msg.createReactionCollector(filter, { time: 1000 * 60 * 3.5 })
        .on('collect', async (reaction, user) => {
          if (reaction.emoji.name == '➡') {
            pageindex++;
            if (pageindex >= response.length) pageindex = 0;
            const page = showpage(response[pageindex], message, pageindex, response.length);
            await msg.edit(page);
          }

          if (reaction.emoji.name == '⬅') {
            pageindex--;
            if (pageindex < 0) pageindex = response.length - 1;
            const page = showpage(response[pageindex], message, pageindex, response.length);
            await msg.edit(page);
          }

        })
        .on('end', () => {
          if (msg.channel.type === 'dm') return;
          msg.reactions.removeAll();
        });
    }
    catch (e) {
      console.log(e);
      return message.reply(errorEmbed);
    }
  }
}