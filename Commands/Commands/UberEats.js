const { Message, MessageEmbed } = require('discord.js');
const { basename } = require('path');
const uEatsLogo = "https://puu.sh/H2JAB/7170860622.png";

module.exports = {
  name: "ubereats",
  description: "Envia un codigo de Uber Eats",
  aliases: ["ueats",],
  filename: basename(__filename),
  usage: "ubereats [codigo] [descripcion]",
  nsfw: false,
  enabled: true,
  permissions: [""],
  botOwnerOnly: true,
  guildOnly: false,
  moderationOnly: false,
  /**
  *@param {Message} message
  *@param {String[]} args
  */
  execute(message, args) {
    /*Code Here*/
    const { guild, channel } = message;

    // Si la guild es distinta a Exiliados retornamos.
    if (guild.id !== "537484725896478733") return;

    const codigo = args.shift();
    const description = args.join(" ");

    const embed = new MessageEmbed()
      .setAuthor("Código de Uber Eats")
      .setDescription(description)
      .setTitle(codigo)
      .setColor("GREEN")
      .setThumbnail(uEatsLogo);

    channel.send(embed).catch(e => console.error(e));
  }
}