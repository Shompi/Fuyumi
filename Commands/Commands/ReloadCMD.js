const { MessageEmbed, Message } = require('discord.js');
const path = require('path');

const noCommandFound = (author) =>
  new MessageEmbed()
    .setTitle(`🔎 Error: 404`)
    .setDescription(`${author}, no he encontrado ese comando.`)
    .setColor("YELLOW");

const noCommandSpecified = (author) =>
  new MessageEmbed()
    .setTitle(`💢 Comando no especificado.`)
    .setDescription(`${author}, ¡debes especificar un comando para recargar!`)
    .setColor("RED")


const success = (command) =>
  new MessageEmbed()
    .setTitle(`✅ ¡El comando '${command.name.toUpperCase()}'  se ha reiniciado correctamente!`)
    .setColor("GREEN");

module.exports = {
  //This command should be Bot OWNER only.
  name: "reload",
  filename: path.basename(__filename),
  aliases: ["re"],
  description: "Reinicia / Recarga un comando. (Este es un comando interno.)",
  usage: "reload [Nombre del comando]",
  nsfw: false,
  enabled: true,
  permissions: [],
  botOwnerOnly: true,
  execute(message = new Message(), args = new Array()) {
    const { channel, author, client: Muki } = message;

    if (author.id !== Muki.OWNER) return;

    if (!args.length) return channel.send(noCommandSpecified(author));

    const command = Muki.commands.get(args[0]) || Muki.commands.find(c => c.aliases.includes(args[0]));

    if (!command) return channel.send(noCommandFound(author));

    //If a command is found:
    delete require.cache[require.resolve(`./${command.filename}`)];

    try {
      const reload = require(`./${command.filename}`);
      Muki.commands.set(reload.name, reload);
      return channel.send(success(command));
    } catch (error) {
      console.log(error);
      return channel.send("Hubo un error con la ejecución de este comando. Mira la consola.");
    }
  }
}