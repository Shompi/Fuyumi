const { CommandInteraction, MessageEmbed, InteractionCollector } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');


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

      const resultEmbed = new MessageEmbed();
      const timestamp = Date.now();

      try {
        let evaled = await eval(evalText);

        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);

        resultEmbed.setTitle(`⏳ ${Date.now() - timestamp}ms`)
          .setDescription(`\`\`\`js\n${clean(evaled)}\`\`\``)
          .setColor('BLUE')

        await interaction.reply({ embeds: [resultEmbed] });

      } catch (err) {

        resultEmbed.setTitle(`⏳ ${Date.now() - timestamp}ms`)
          .setDescription(`\`\`\`js\n${clean(err)}\`\`\``)
          .setColor('RED');

        await interaction.reply({ embeds: [resultEmbed] });
      }
    } else {
      // Probar otras cosas aqui

      const emoji = interaction.client.emojis.cache.random();
      await interaction.reply({ content: emoji.toString() });
    }
  }
}


const clean = text => {
  if (typeof (text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;
}