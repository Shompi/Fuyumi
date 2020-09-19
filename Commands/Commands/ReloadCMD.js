const { MessageEmbed, Message } = require('discord.js');
const path = require('path');

module.exports = {
  //This command should be Bot OWNER only.
  name: "reload",
  filename: path.basename(__filename),
  aliases: [],
  description: "Reinicia / Recarga un comando. (Este es un comando interno.)",
  usage: "reload [Nombre del comando]",
  nsfw: false,
  enabled: true,
  permissions: [],
  botOwnerOnly: true,
  execute(message = new Message(), args = new Array()) {
    const { channel, author, client } = message;
    const notReloaded = [], reloaded = [];

    if (!args.length) {
      client.commands.forEach(cmd => {

        //If a command is found:
        delete require.cache[require.resolve(`./${cmd.filename}`)];

        try {
          const reload = require(`./${cmd.filename}`);
          client.commands.set(reload.name, reload);
          return reloaded.push(reload.name);
        } catch (error) {
          console.log(error);
          return notReloaded.push(cmd);
        }
      });
    }
    else {

      args.forEach(cmd => {
        const command = client.commands.get(cmd) || client.commands.find(c => c.aliases.includes(cmd));

        if (!command)
          return notReloaded.push(cmd);

        //If a command is found:
        delete require.cache[require.resolve(`./${command.filename}`)];

        try {
          const reload = require(`./${command.filename}`);
          client.commands.set(reload.name, reload);
          return reloaded.push(reload.name);
        } catch (error) {
          console.log(error);
          return notReloaded.push(cmd);
        }
      });
    }

    const embed = new MessageEmbed()
      .setDescription(`**Comandos reiniciados exitósamente:**
      \`\`\`${reloaded.join(", ") || "-"}\`\`\`
      **Comandos no encontrados o que fallaron al reiniciar:**
      \`\`\`${notReloaded.join(", ") || "-"}\`\`\``)
      .setColor("BLUE");

    return channel.send(embed);
  }
}