const { CommandInteraction, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch').default;
/**
 * @param {CommandInteraction} interaction
 * @return {Promise<string|MessageEmbed>}
 */
module.exports.CovidCommand = async (interaction) => {
	console.log("COVID INTERACTION TRIGGERED");

	const ENDPOINT = "https://corona.lmao.ninja/v2/countries";
	const code = interaction.options[0]?.value || 'CL';


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
		.addField("Total:", data.cases, true)
		.addField("Recuperados:", data.recovered, true)
		.addField("Fallecidos:", data.deaths, true)
		.setColor("BLUE")
		.addField("Pacientes Criticos:", data.critical, true)
		.addField("Tests:", data.tests, true)
		.addField("Habitantes:", data.population, true);

	interaction.reply(embed);
}