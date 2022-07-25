const { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const axios = require('axios').default

const monedaCLP = "CLP"

module.exports = {
  data: new SlashCommandBuilder()
    .setName('indicadores')
    .setDescription('Muestra información de distintas monedas convertidas a CLP'),
  isGlobal: true,
  /**
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute(interaction) {
    // Your code...

    const info = await axios.get("https://mindicador.cl/api", { responseType: 'json' }).then(response => response.data).catch(err => console.error(err));

    if (!info) {
      return await interaction.reply("Ha ocurrido un error con este comando...");
    }

    const { dolar, dolar_intercambio, euro, bitcoin } = info;

    const embed = new EmbedBuilder()
      .setAuthor({ name: 'Indicadores de hoy', iconURL: interaction.client.user.displayAvatarURL({ size: 64 }) })
      .setColor('Blue')
      .setDescription(
        `**${dolar.nombre}**\t -> \t${dolar.valor} ${monedaCLP}\n` +
        `**${dolar_intercambio.nombre}**\t -> \t${dolar_intercambio.valor} ${monedaCLP}\n` +
        `**${euro.nombre}**\t -> \t${euro.valor} ${monedaCLP}\n` +
        `**${bitcoin.nombre}**\t -> \t${bitcoin.valor} USD \*`
      )
      .setTimestamp()
      .setFooter({ text: "* Estos valores podrian tener un desfase de hasta 2 dias." })

    return await interaction.reply({ embeds: [embed] });
  }
}