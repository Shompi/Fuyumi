const axios = require('axios').default;
const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed } = require('discord.js');
const APIRoute = "https://api.urbandictionary.com/v0/define?term=";

module.exports = {
  data: new SlashCommandBuilder()
    .setName('urban')
    .setDescription('¡Busca un término en Urban Dictionary!')
    .addStringOption(term => {
      return term.setName('termino')
        .setDescription('El término que quieres buscar, se admiten espacios.')
        .setRequired(true)
    }),
  isGlobal: true,
  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {

    const term = interaction.options.getString('termino', true);
    await interaction.deferReply();

    /**
     * @type {[{
       definition: string,
       permalink: string,
       thumbs_up: number,
       thumbs_down: number,
       word: string,
       defif: number,
       example: string,
     }]}
     */
    const results = await axios.get(APIRoute + term).then((response) => response.data.list);

    if (results.length === 0)
      return await interaction.editReply({
        content: 'No encontré ningún término con lo que ingresaste.'
      });

    const firstTwo = results.slice(0, 2);

    const embed = new MessageEmbed()
      .setAuthor('Urban Dictionary')
      .setColor(interaction?.member.displayColor ?? "BLUE")
      .setTitle(firstTwo[0].word)
      .addField('Definición', `${firstTwo.map(def => def.definition).join('\n')}`)
      .addField('Ejemplos', `${firstTwo.map(def => def.example).join("\n")}`)
      .setFooter({ text: `👍${firstTwo[0].thumbs_up} - 👎${firstTwo[0].thumbs_down}` })

    return await interaction.editReply({
      embeds: [embed]
    });
  }
}