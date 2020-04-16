const { MessageEmbed, Message } = require('discord.js');
const path = require('path');

const noCommandSpecified = (author) =>
  new MessageEmbed()
    .setTitle(`💢 Comando no especificado.`)
    .setDescription(`${author}, ¡debes especificar al menos un comando para recargar!`)
    .setColor("RED")

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

    const notReloaded = [], reloaded = [];

    args.forEach(cmd => {
      const command = Muki.commands.get(cmd) || Muki.commands.find(c => c.aliases.includes(cmd));

      if (!command)
        return notReloaded.push(cmd);

      //If a command is found:
      delete require.cache[require.resolve(`./${command.filename}`)];

      try {
        const reload = require(`./${command.filename}`);
        Muki.commands.set(reload.name, reload);
        return reloaded.push(reload.name);
      } catch (error) {
        console.log(error);
        return notReloaded.push(cmd);
      }
    });

    const embed = new MessageEmbed()
      .setDescription(`**Comandos reiniciados exitósamente:**
      \`\`\`${reloaded.join(", ")}\`\`\`
      **Comandos no encontrados o que fallaron al reiniciar:**
      \`\`\`${notReloaded.join(", ")}\`\`\``)
      .setColor("BLUE");

    return channel.send(embed);
  }
}