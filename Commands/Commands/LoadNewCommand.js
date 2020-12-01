const { MessageEmbed, Message } = require('discord.js');
const fs = require('fs');
const path = require('path');


const addedCommands = (amount, names) =>
  new MessageEmbed()
    .setTitle(`¡Se añadieron ${amount} comandos!`)
    .setDescription(`Comandos añadidos:\n${names.join("\n")}`)
    .setColor("BLUE");

module.exports = {
  name: "loadcmd",
  aliases: ["lcmd"],
  filename: path.basename(__filename),
  description: "Recarga la carpeta de comandos y añade los que no estaban cargados.",
  usage: "loadcmd <Sin Parámetros>",
  nsfw: false,
  enabled: true,
  permissions: [],
  botOwnerOnly: true,
  /**
   * 
   * @param {Message} message 
   * @param {Array} args 
   */
  execute(message, args) {
    const { author, channel, client: Muki } = message;

    if (author.id !== Muki.OWNER) return undefined;
    let commandsAdded = 0;
    let commandNames = [];
    const commandFiles = fs.readdirSync('./Commands/Commands').filter(file => file.endsWith(".js"));

    Muki.commands.forEach(c => console.log(c.filename));

    commandFiles.forEach(filename => {
      console.log("COMMANDFILES:");
      console.log(filename);

      const command = Muki.commands.find(c => c.filename === filename);

      if (!command) {
        console.log(`El comando ${filename} no estaba cargado.`);

        const newCommand = require(`./${filename}`);
        Muki.commands.set(newCommand.name, newCommand);
        commandsAdded++;
        commandNames.push(newCommand.name);
      }
    });
    return channel.send(addedCommands(commandsAdded, commandNames));
  }
}