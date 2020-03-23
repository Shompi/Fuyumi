const { MessageEmbed, Message } = require('discord.js');
const path = require('path');

const commandNotFound =
  new MessageEmbed()
    .setTitle(`Comando no encontrado.`)
    .setDescription("Asegúrate de haber escrito el comando (o su alias) correctamente.")
    .setColor("RED");

const success = (command) =>
  new MessageEmbed()
    .setTitle(`El comando '${command.name}' ahora está ${command.enabled ? "Activado" : "Desactivado"}`)
    .setColor(command.enabled ? "GREEN" : "RED");


module.exports = {
  name: "togglecmd",
  aliases: ["tcmd"],
  filename: path.basename(__filename),
  description: "Activa / Desactiva un comando.",
  usage: "togglecmd [Nombre del comando]",
  nsfw: false,
  enabled: true,
  permissions: [],
  execute(message = new Message(), args = new Array()) {
    const { channel, author, client: Muki } = message;

    if (author.id !== Muki.OWNER) return undefined;

    const command = Muki.commands.get(args[0]) || Muki.commands.find(c => c.aliases.includes(args[0]));
    if (!command) return channel.send(commandNotFound);

    if (command.enabled) command.enabled = false;
    else command.enabled = true;

    Muki.commands.set(command.name, command);
    return channel.send(success(command));
  }
}