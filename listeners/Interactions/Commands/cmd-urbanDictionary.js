const axios = require('axios').default;
const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, MessageEmbed } = require('discord.js');
const APIRoute = "https://api.urbandictionary.com/v0/define?term=";
const Translate = require('@vitalets/google-translate-api');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('urban')
    .setDescription('¡Busca un término en Urban Dictionary!')
    .addStringOption(term => {
      return term.setName('termino')
        .setDescription('El término que quieres buscar, considera las MAYÚSCULAS!!')
        .setRequired(true)
    }),
  isGlobal: true,
  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {

    const term = interaction.options.getString('termino', true);

    if (term.length <= 2)
      return await interaction.reply({ content: 'No me molestaré en buscar un término tan corto.' });

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

    const first = results.sort((a, b) => b.thumbs_up - a.thumbs_up)[0];
    const cleanDefinition = first.definition.replace(/\[|\]/g, "")

    /**
     * @type {Translate.ITranslateResponse}
     */
    const translatedDefinition = await Translate(cleanDefinition, {
      from: 'en',
      to: 'es'
    }).catch(() => null);

    const embed = new MessageEmbed()
      .setAuthor({ name: 'Urban Dictionary' })
      .setColor(interaction.member?.displayColor ?? "BLUE")
      .setTitle(`Palabra: ${first.word}`)
      .setDescription(`**Definicion:**\n${translatedDefinition.text ?? cleanDefinition}\n\n`
        + `**Ejemplo**\n${first.example.replace(/\[|\]/g, "")}`)
      .setFooter({ text: `👍${first.thumbs_up} - 👎${first.thumbs_down} | Traducido por Google Translate` })

    return await interaction.editReply({
      embeds: [embed]
    });
  }
}