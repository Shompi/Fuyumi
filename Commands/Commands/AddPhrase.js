const { MessageEmbed, Message } = require('discord.js');
const database = require("../LoadDatabase").guildConfigs;

const missingPermissions = (author) => {
  return new MessageEmbed()
    .setTitle(`❌ ¡Lo siento ${author.username}! No tienes permiso para utilizar este comando.`)
    .setColor("RED")
};

const noPhrase = (author) => {
  return new MessageEmbed()
    .setColor("RED")
    .setTitle(`ℹ ${author.username} debes ingresar al menos 1 letra.`)
};

const duplicated = (author, phrase, prefix) => {
  return new MessageEmbed()
    .setTitle(`❌ ¡Ups!`)
    .setDescription(`${author.username}, la frase "**${phrase}**" ya se encuentra en la lista.\n\nPara ver la lista de frases escribe \`${prefix}wfrases\``)
    .setColor("BLUE")
};

const limitExceeded = (author, phrase) => {
  return new MessageEmbed()
    .setTitle(`❌ Lo siento ${author.username}, has excedido el límite de 256 caracteres.`)
    .setDescription(`La frase que has ingresado es de \`${phrase.length} caracteres.\``)
    .setColor("RED");
};

const succeed = new MessageEmbed()
  .setTitle(`¡La frase ha sido añadida con éxito!`)
  .setColor("GREEN");

module.exports = {
  name: "waddfrase",
  filename: __filename,
  description: "Añade una frase de bienvenida. Si hay más de una frase configurada, se escogerá una al **azar**.",
  usage: "waddfrase [frase]",
  nsfw: false,
  enabled: true,
  aliases: [],
  permissions: [],
  async execute(message = new Message(), args = new Array()) {
    const { member, guild, channel, author } = message;
    const configs = database.get(guild.id);
    if (!configs) return console.log(`Por alguna razón la guild ${guild.name} no tenia entrada de configuración. AddPhrase.js`);
    const phrase = args.join(" ");

    if (member.hasPermission("ADMINISTRATOR", { checkOwner: true })) {
      if (phrase) {
        if (phrase.length > 256) return await channel.send(limitExceeded(author, phrase));
        if (configs.welcome.joinPhrases.includes(phrase)) return await channel.send(duplicated(author, phrase, configs.prefix));

        database.push(guild.id, phrase, "welcome.joinPhrases") //Push the phrase to the guildConfig database.
        console.log(`Nueva frase añadida:\nGuild: ${guild.name}\nFrase: ${phrase}\nNuevo array: ${database.get(guild.id, "welcome.joinPhrases")}`);
        return await channel.send(succeed);

      } else return await channel.send(noPhrase(author));
    } else return await channel.send(missingPermissions(author));
  }
}