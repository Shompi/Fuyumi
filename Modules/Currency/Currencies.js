const { MessageEmbed, Message } = require('discord.js');
const sbif = "https://api.sbif.cl/api-sbifv3/recursos_api/dolar?apikey=eee58c00d4c5bc66a05a60c443b7089fd7c73d10&formato=json";
let info = require('../../Classes/CurrenciesTemplate');
const fetch = require('node-fetch');
module.exports = async (message = new Message(), query) => {
  let endpoint;
  let args = query.split(" ");
  let factor = new Number();

  if (args[0] == '') {
    endpoint = `https://api.exchangerate-api.com/v4/latest/USD`;
    args[1] = null;
  } else {
    if(!args[1] || Number(args[1]) <= 1){
      factor = 1;
    }
    else{
      factor = args[1];
    }
    endpoint = `https://api.exchangerate-api.com/v4/latest/${args[0]}`
  }
  //console.log(args);

  info = await fetch(endpoint).then(response => response.json()).catch(error => {
    console.log(`Error en Currencies.js ${error}`);
    const errorEmbed = new MessageEmbed().setColor("RED").setAuthor("Oops.").setDescription("Hubo un error al intentar contactar la API.");
    return message.channel.send(errorEmbed);
  });
  
  if (info.result === 'error') return await message.reply("has ingresado un código de moneda inválido.");
  const dolarSBIF = await fetch(sbif).then(res => res.json()).then(info => info.Dolares[0].Valor).catch(error => console.log("SBIF " + error));
  let embed = new MessageEmbed();
  if (factor <= 1) {
    embed
      .setAuthor(`exchangerate-api.com`)
      .setDescription(
        `Valor del ${info.base} para hoy:\n` +
        `- **${info.rates.CLP.toFixed(2)}** Pesos Chilenos.\n` +
        `- **${info.rates.ARS.toFixed(2)}** Pesos Argentinos.\n` +
        `- **${info.rates.USD.toFixed(2)}** Dolares Estado Unidenses\n`+
        `- **Dolar según la API CMF Bancos:** ${dolarSBIF}`)
      .setColor("GREEN");
  }else{
    embed
      .setAuthor(`exchangerate-api.com`)
      .setDescription(
        `${factor} ${info.base} equivalen a:\n` +
        `- **${(info.rates.CLP * factor).toFixed(2)}** Pesos Chilenos.\n` +
        `- **${(info.rates.ARS * factor).toFixed(2)}** Pesos Argentinos.\n` +
        `- **${(info.rates.USD * factor).toFixed(2)}** Dolares Estado Unidenses`)
      .setColor("GREEN");
  }

  return await message.channel.send(embed);
}
