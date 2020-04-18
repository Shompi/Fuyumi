const ENDPOINT = "https://corona.lmao.ninja/v2/countries";
const fetch = require('node-fetch');
const { MessageEmbed, Message } = require('discord.js');
const { basename } = require('path');

const fetchError = new MessageEmbed()
  .setTitle(`❌ Hubo un error con la api.`)
  .setDescription("Por favor inténtalo más tarde.")
  .setColor("RED")
  .setTimestamp();


const covidEmbed = (info) => {
  const { cases, todayCases, deaths, recovered, active, critical, tests, updated, country, countryInfo } = info;

  return new MessageEmbed()
    .setTitle(`Última actualización: ${new Date(updated)}`)
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
    .setAuthor(`Información COVID-19 para ${country}`, countryInfo.flag)
    .setColor("BLUE")
    .setFooter(`Nuevos casos hoy: ${todayCases}`);
}

module.exports = {
  name: "corona",
  description: "Información de casos de COVID-19.",
  usage: "corona [Chile | CL | CHL]",
  aliases: ["covid", "c19", "c-19", "covid19", "coronavirus"],
  permissions: [],
  enabled: true,
  cooldown: 5,
  filename: basename(__filename),
  async execute(message = new Message(), args = new Array()) {
    const { channel } = message;

    const countryCode = args[0];

    const covidResponse = await fetch(ENDPOINT).then(res => res.json()).catch(() => null);

    if (!covidResponse)
      return channel.send(fetchError);

    const countryInfo = getCountryInformation(covidResponse, countryCode);

    return channel.send(covidEmbed(countryInfo));
  }
}

const getCountryInformation = (response = [], countryCode = "CL") => {

  for (item of response) {
    if (item.country.toLowerCase() === countryCode.toUpperCase()
      || item.countryInfo.iso2.toUpperCase() === countryCode.toUpperCase()
      || item.countryInfo.iso3.toUpperCase() === countryCode.toUpperCase())
      return item;
  }
}