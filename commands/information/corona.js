const { MessageEmbed, Message, MessageButton, MessageActionRow } = require('discord.js');
const fetch = require('node-fetch').default;
const ENDPOINT = "https://corona.lmao.ninja/v2/countries";
const { Command } = require('discord-akairo');
const last_info = new Map();

class CoronaCommand extends Command {
	constructor() {
		super('covid', {
			aliases: ['covid', 'c19', 'covid19'],
			description: 'Muestra estadísticas respecto al Covid-19.',
			args: [
				{
					id: "pais",
					type: 'string',
					default: 'CL',
					error: "Ocurrió un error."
				}
			],
		});
	}

	async exec(message, { pais }) {
		if (!pais)
			return getChileInformation(message);
		else {
			return getAnyCountry(message, pais);
		}
	}
}

/**
 * @param {Object} now 
 * @param {Object} last 
 */
const calcularDiferencia = (now, last) => {
	const resultados = {
		cases: "",
		deaths: "",
		recovered: "",
		active: "",
		critical: "",
		tests: "",
		population: now.population
	};

	const diffCases = now.cases - last.cases;
	const diffDeaths = now.deaths - last.deaths;
	const diffRecovered = now.recovered - last.recovered;
	const diffActive = now.active - last.active;
	const diffCritical = now.critical - last.critical;
	const diffTests = now.tests - last.tests;



	resultados.cases = `${now.cases} (${diffCases > 0 ? `+${diffCases}` : diffCases})`;
	resultados.deaths = `${now.deaths} (${diffDeaths > 0 ? `+${diffDeaths}` : diffCases})`;
	resultados.recovered = `${now.recovered} (${diffRecovered > 0 ? `+${diffRecovered}` : diffRecovered})`;
	resultados.active = `${now.active} (${diffActive > 0 ? `+${diffActive}` : diffActive})`;
	resultados.critical = `${now.critical} (${diffCritical > 0 ? `+${diffCritical}` : diffCritical})`;
	resultados.tests = `${now.tests} (${diffTests > 0 ? `+${diffTests}` : diffTests})`;

	return resultados;
}



const apiRequest = async () => {
	const data = fetch(ENDPOINT).then(response => response.json()).catch(err => null);

	return data;
};


/**
* @param {String} country El pais a buscar.
*/
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

/**@param {Message} message */
const getChileInformation = async (message) => {

	const chileinfo = await RequestInfo("CL");

	if (!chileinfo) return message.channel.send("No se recibió respuesta desde la API.");

	const lastInfoRequested = last_info.get(message.channel.id);

	if (!lastInfoRequested) {
		const embed = new MessageEmbed()
			.setAuthor(`Información del covid-19 en ${chileinfo.country}`, chileinfo.countryInfo.flag)
			.setTitle(`Casos Activos: ${chileinfo.active}`)
			.addField("Total:", chileinfo.cases, true)
			.addField("Recuperados:", chileinfo.recovered, true)
			.addField("Fallecidos:", chileinfo.deaths, true)
			.setColor("BLUE")
			.addField("Pacientes Criticos:", chileinfo.critical, true)
			.addField("Tests:", chileinfo.tests, true)
			.addField("Habitantes:", chileinfo.population, true);

		message.channel.send(embed);

	} else {
		const results = calcularDiferencia(chileinfo, lastInfoRequested);

		const embed = new MessageEmbed()
			.setAuthor(`Información del covid-19 en ${chileinfo.country}`, chileinfo.countryInfo.flag)
			.setTitle(`Casos Activos: ${results.active}`)
			.addField("Total:", results.cases, true)
			.addField("Recuperados:", results.recovered, true)
			.addField("Fallecidos:", results.deaths, true)
			.setColor("BLUE")
			.addField("Pacientes Criticos:", results.critical, true)
			.addField("Tests:", results.tests, true)
			.addField("Habitantes:", results.population, true);

		message.channel.send(embed);
	}

	last_info.set(message.channel.id, chileinfo);
}

/**@param {Message} message */
const getAnyCountry = async (message, code) => {
	console.log(`CODE: ${code}`)
	const data = await RequestInfo(code);

	if (!data)
		return message.channel.send(`Hubo un error al contactar con la API.`);

	if (data === -1)
		return message.channel.send(fetchError);

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


	const likeButton = new MessageButton()
		.setLabel('👍')
		.setCustomId('like')
		.setStyle("SUCCESS");

	const dislikeButton = new MessageButton()
		.setLabel("👎")
		.setCustomId('dislike')
		.setStyle('DANGER');


	const row = new MessageActionRow()
		.addComponents([likeButton, dislikeButton]
		);

	message.channel.send({
		embeds: [embed],
		components: [row]
	});
}


const fetchError = new MessageEmbed()
	.setTitle(`❌ ¡No pude encontrar el país que ingresaste!`)
	.setDescription("Por favor asegúrate de ingresar el Nombre del país o el código **ISO2 / ISO3** correctamente.")
	.setColor("RED")
	.setTimestamp();


module.exports = CoronaCommand;