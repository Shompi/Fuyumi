//@ts-check
const { CommandInteraction, MessageEmbed, Util, Formatters } = require("discord.js");


/**
 * @param {CommandInteraction} interaction 
 */
module.exports.Test = async (interaction) => {

  const evalText = interaction.options.getString('input', false);

  if (evalText) {

    const inputEmbed = new MessageEmbed()
      .setTitle('\> Input')
      .setDescription(Formatters.codeBlock('js', evalText))
      .setColor(Util.resolveColor('BLUE'))
      .setTimestamp();

    const resultEmbed = new MessageEmbed();
    const timestamp = Date.now();

    try {
      let evaled = await eval(evalText);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      resultEmbed.setTitle(`⏳ ${Date.now() - timestamp}ms`)
        .setDescription(`\`\`\`js\n${clean(evaled).slice(0, 500)}\`\`\``)
        .setColor(Util.resolveColor('GREEN'))

      await interaction.reply({ embeds: [inputEmbed, resultEmbed] });

    } catch (err) {

      console.log(err);
      resultEmbed.setTitle(`⏳ ${Date.now() - timestamp}ms`)
        .setDescription(`\`\`\`js\n${clean(err).slice(0, 500) + "...\nRevisa la consola para más información."}\`\`\``)
        .setColor(Util.resolveColor('RED'));

      await interaction.reply({ embeds: [inputEmbed, resultEmbed] });
    }
  } else {
    // Probar otras cosas aqui
    const time1 = Date.now();
    await interaction.reply({ content: 'OK!' });
    const time2 = Date.now();

    const pingEmbed = new MessageEmbed()
      .setTitle(`¡Test ok!`)
      .addField('WS Ping', `${interaction.client.ws.ping}ms`, true)
      .addField('Ping de respuesta', `${time2 - time1}ms`, true)
      //
      .addField('Guilds', `${interaction.client.guilds.cache.size}`.padStart(3, '0'))
      .addField('Usuarios en cache', `${interaction.client.users.cache.size}`, true)
      //
      .addField('Canales en cache', `${interaction.client.channels.cache.size}`, true)
      .addField('Discord.js', `${require('discord.js').version}`)
      //
      .addField('OS', process.platform, true)
      .addField('Memoria alocada', `${process.memoryUsage().heapTotal} Bytes`, true)
      .setColor(Util.resolveColor('BLUE'));

    return await interaction.editReply({ embeds: [pingEmbed] });
  }
}









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