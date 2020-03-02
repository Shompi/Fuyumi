//This command will remove phrases from the database, in this case, JOIN phrases.

const { MessageEmbed, Message } = require('discord.js');
const database = require('../LoadDatabase').guildConfigs;
const path = require('path');

const noPhrase = (author, prefix) => {
  return new MessageEmbed()
    .setColor("RED")
    .setTitle(`❌ ¡No has ingresado la frase!`)
    .setDescription(`${author.username} debes ingresar la frase que quieres quitar.\n\nPara ver la lista de frases escribe \`${prefix}wfrases.\``)
}

const notFound = (author) => {
  return new MessageEmbed()
    .setTitle(`🔎 ERROR: 404`)
    .setDescription(`No he encontrado la frase que ingresaste.\nPor favor ${author.username} comprueba que la hayas escrito correctamente.`)
    .setColor("YELLOW");
}

const succeed = new MessageEmbed()
  .setTitle("¡Yay!")
  .setDescription("¡La frase ha sido quitada exitosamente!")
  .setColor("GREEN");

module.exports = {
  name: "wremfrase",
  filename: path.basename(__filename),
  description: "Quita una frase de bienvenida. La frase que ingreses debe ser exactamente igual a una que ya esté configurada.",
  usage: "wremfrase [frase]",
  nsfw: false,
  enabled: true,
  aliases: [],
  permissions: [],

  async execute(message = new Message(), args = new Array()) {
    const { member, channel, guild, author } = message;

    if (!member.hasPermission('ADMINISTRATOR', { checkOwner: true })) return undefined;

    const config = database.get(guild.id);
    if (!config) return console.log(`Por alguna razón, la guild ${guild.name} no tiene entrada de configuración.`);

    const phrase = args.join(" ");
    if (!phrase) return await channel.send(noPhrase(author, config.prefix));

    const { joinPhrases } = config.welcome;

    if (!joinPhrases.includes(phrase)) return await channel.send(notFound(author));
    else {

      const updatedPhrases = joinPhrases.filter(ph => ph !== phrase);

      database.set(guild.id, updatedPhrases, "welcome.joinPhrases");
      return await channel.send(succeed);
    }
  }
}