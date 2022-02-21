const { CommandInteraction, MessageEmbed, Formatters, Util } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Comando para realizar pruebas (OWNER ONLY)')
    .addStringOption(input => input.setName('input').setDescription('input a probar.').setRequired(false))
    .setDefaultPermission(false),
  isGlobal: false,

  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {

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
      await interaction.reply("asdasd");
    }
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