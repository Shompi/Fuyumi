const { CommandInteraction, MessageEmbed } = require("discord.js");
const fetch = require('node-fetch').default;
/**
 * @param {CommandInteraction} interaction
 * @return {Promise<string|MessageEmbed>}
 */
module.exports.CovidCommand = async (interaction) => {
	console.log("COVID INTERACTION TRIGGERED");

	const ENDPOINT = "https://corona.lmao.ninja/v2/countries";
	const code = interaction.options.first()?.value || 'CL';


	const apiRequest = async () => {
		const data = await fetch(ENDPOINT).then(response => response.json()).catch(err => null);

		return data;
	};

	const RequestInfo = async (c) => {

		const response = await apiRequest().catch(err => err);
		const CODE = c.toUpperCase();

		if (!response) return null;

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