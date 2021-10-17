const { CommandInteraction, MessageEmbed } = require("discord.js");
const fetch = require('node-fetch').default;
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('covid19')
    .setDescription('Muestra información de casos de covid 19')
    .addStringOption(option =>
      option.setName('pais')
        .setDescription('El codigo o nombre del pais que quieras consultar (default: CL)')
    ),
  /**
  * @param {CommandInteraction} interaction
  * @return {Promise<string|MessageEmbed>}
  */
  async execute(interaction) {
    const ENDPOINT = "https://corona.lmao.ninja/v2/countries";
    const code = interaction.options.get('pais', false).value || 'CL';


    const apiRequest = async () => {
      const data = await fetch(ENDPOINT).then(response => response.json()).catch(err => null);

      return data;
    };

    const RequestInfo = async (c) => {

      const response = await apiRequest().catch(err => err);
      const CODE = c.toUpperCase();

      if (!response) return interaction.reply({
        content: "Ocurrió un error con el comando!",
        ephemeral: true
      });

      for (const item of response) {
        const { iso2, iso3 } = item.countryInfo;
        const { country } = item;

        if (country.toUpperCase() === CODE) {
          return item;

        } else if (iso2 && iso2 === CODE) {
          return item;

        } else if (iso3 && iso3 === CODE) {
          return item;
        }
      }

      return -1;
    }

    const data = await RequestInfo(code);

    if (!data)
      return "Hubo un error al contactar con la API.";

    if (data === -1)
      return "Ocurrió un error con la interacción.";
    console.log(data);

    const embed = new MessageEmbed()
      .setAuthor(`Información del covid-19 en ${data.country}`, data.countryInfo.flag)
      .setTitle(`Casos Activos: ${data.active}`)
      .addField("Total:", `${data.cases || "No data."}`, true)
      .addField("Recuperados:", `${data.recovered || "No data."}`, true)
      .addField("Fallecidos:", `${data.deaths || "No data."}`, true)
      .addField("Pacientes Criticos:", `${data.critical || "No data."}`, true)
      .addField("Tests:", `${data.tests || "No data."}`, true)
      .addField("Habitantes:", `${data.population || "No data."}`, true)
      .setColor("BLUE");

    interaction.reply({ embeds: [embed] });
  }
}