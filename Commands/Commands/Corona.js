const ENDPOINT = "https://corona.lmao.ninja/v2/countries";
const fetch = require('node-fetch');
const { MessageEmbed, Message } = require('discord.js');
const { basename } = require('path');
const parsems = require("parse-ms");
const parseMilliseconds = require("parse-ms");

//Lets try to reduce the number of api requests.
let LatestInformation = [];

const apiRequest = async () => {

  const covidResponse = await fetch(ENDPOINT).then(res => res.json()).catch(() => null);

  if (covidResponse) {
    LatestInformation = covidResponse;
    console.log("Información COVID actualizada.");
  }
  return;
}

const fetchError = new MessageEmbed()
  .setTitle(`❌ ¡No pude encontrar el país que ingresaste!`)
  .setDescription("Por favor asegúrate de ingresar el Nombre del país o el código **ISO2 / ISO3** correctamente.")
  .setColor("RED")
  .setTimestamp();


const covidEmbed = (info) => {
  const { cases, todayCases, deaths, recovered, active, critical, tests, updated, country, countryInfo } = info;
const { hours, minutes, seconds } = parseMilliseconds(Date.now() - updated);
  
  return new MessageEmbed()
    .setFooter(`Última actualización hace ${hours || "0"}h ${minutes || "0"}m ${seconds || "0"}s.`)
    .setAuthor(`Información del COVID-19 en ${country}`, countryInfo.flag)
    .addFields({
      name: "Casos Totales:", value: cases, inline: true
    },
      {
        name: "Casos Activos:", value: active, inline: true
      },
      {
        name: "Tests:", value: tests, inline: true,
      },
      {
        name: "Recuperados:", value: recovered, inline: true
      },
      {
        name: "Criticos:", value: critical, inline: true
      },
      {
        name: "Muertes:", value: deaths, inline: true
      })
    .setColor("BLUE")
    .setTitle(`Nuevos casos hoy: ${todayCases}`);
}

setInterval(async () => {
  await apiRequest()
}, 1000 * 60 * 30);

module.exports = {
  name: "covid",
  description: "Información de casos de COVID-19.",
  usage: "corona [Chile | CL | CHL]",
  aliases: ["corona", "c19", "c-19", "covid19", "coronavirus"],
  permissions: [],
  enabled: true,
  cooldown: 5,
  filename: basename(__filename),
  /**
   * 
   * @param {Message} message 
   * @param {Array} args 
   */
  async execute(message, args) {
    const { channel } = message;

    const countryCode = args[0];

    if (!LatestInformation || !LatestInformation.length)
      await apiRequest();

    const countryInfo = getCountryInformation(LatestInformation, countryCode);

    if (!countryInfo)
      return channel.send(fetchError);

    return channel.send(covidEmbed(countryInfo));
  }
}

const getCountryInformation = (response = [], countryCode = "CL") => {
  if (response.length === 0 || !response)
    return null;

  const CODE = countryCode.toUpperCase();

  for (item of response) {
    console.log(item);

    const { iso2, iso3 } = item.countryInfo,
      { country } = item;

    if (country.toUpperCase() === CODE)
      return item;

    if (iso2 && iso2 === CODE)
      return item;

    if (iso3 && iso3 === CODE)
      return item;
  }

  return null;
}