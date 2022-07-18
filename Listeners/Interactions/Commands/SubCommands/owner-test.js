//@ts-check
const { ChatInputCommandInteraction, EmbedBuilder, Colors, Formatters } = require("discord.js");

/**
 * 
 * @param {string} text 
 * @returns {string}
 */
const clean = text => {
  if (typeof (text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;
}

/**
 * @param {ChatInputCommandInteraction} interaction 
 */
module.exports.Test = async (interaction) => {

  const evalText = interaction.options.getString('input', false);

  if (evalText) {

    const inputEmbed = new EmbedBuilder()
      .setTitle('\> Input')
      .setDescription(Formatters.codeBlock('js', evalText))
      .setColor(Colors.Blue)
      .setTimestamp();

    const resultEmbed = new EmbedBuilder();
    const timestamp = Date.now();

    try {
      let evaled = await eval(evalText);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      resultEmbed.setTitle(`⏳ ${Date.now() - timestamp}ms`)
        .setDescription(`\`\`\`js\n${clean(evaled).slice(0, 500)}\`\`\``)
        .setColor(Colors.Green)

      await interaction.reply({ embeds: [inputEmbed, resultEmbed] });

    } catch (err) {

      console.log(err);
      resultEmbed.setTitle(`⏳ ${Date.now() - timestamp}ms`)
        .setDescription('Ocurrió un error en la ejecución de este comando.')
        .setColor(Colors.Red);

      await interaction.reply({ embeds: [inputEmbed, resultEmbed] });
    }
  } else {
    // Probar otras cosas aqui
    const time1 = Date.now();
    await interaction.reply({ content: 'OK!' });
    const time2 = Date.now();

    const pingEmbed = new EmbedBuilder()
      .setTitle(`¡Test ok!`)
      .addFields({ name: "WS Ping", value: `${interaction.client.ws.ping}ms`, inline: true },
        { name: "Ping de respuesta", value: `${time2 - time1}ms`, inline: true },
        //
        { name: "Guilds", value: `${interaction.client.guilds.cache.size}`, inline: false },
        { name: "Usuarios en cache", value: `${interaction.client.users.cache.size}`, inline: true },
        //
        { name: "Canales en cache", value: `${interaction.client.channels.cache.size}`, inline: true },
        { name: "Discord.js", value: `${require('discord.js').version}`, inline: false },
        //
        { name: "OS", value: process.platform, inline: true },
        { name: "Memoria reservada", value: `${process.memoryUsage().heapTotal} Bytes`, inline: true })
      .setColor(Colors.Blue);

    return await interaction.editReply({ embeds: [pingEmbed] });
  }
}
