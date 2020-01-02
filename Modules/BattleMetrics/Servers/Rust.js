/**
 * @endpoint /servers/{server_id}
 * @apiurl https://api.battlemetrics.com/servers 
 * @serverid 4770507 Exiliados Rust
 */
const Meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const endpoint = "https://api.battlemetrics.com/servers/4061065?include=player";
const {battleMetrics} = require('../../../Keys/auth');
const fetch = require('node-fetch');
const {TextChannel, MessageEmbed} = require('discord.js');
const Rust = require('../../../Classes/BMetrics');

const options = {
  method:'GET',
  headers:{
    "Authorization": `Bearer ${battleMetrics}`
  }
}


const serverInfo = async (channel = new TextChannel()) => {
  const serverInfo = new Rust.ServerInfo(await fetch(endpoint, options).then(res => res.json()).catch(console.error))
  const attributes = serverInfo.data.attributes;
  const lastWipe = new Date(attributes.details.rust_last_wipe);
  const embed = new MessageEmbed()
    .setTitle(`${attributes.name} | ${attributes.status.toUpperCase()}`)
    .setThumbnail(attributes.details.rust_headerimage)
    .setDescription(`**Ultimo Wipe:** ${lastWipe.getDate()} de ${Meses[lastWipe.getMonth()]} del ${lastWipe.getFullYear()}.`)
    .addField("Jugadores:", `${attributes.players} / ${attributes.maxPlayers}`, true)
    .addField("IP:", attributes.ip, true)
    .addField("Mapa:", attributes.details.map, true)
    .addField("En cola:", attributes.details.rust_queued_players, true)
    .setColor(`${attributes.status == 'online' ? "GREEN" : "RED"}`)
    .setFooter("API proporcionada por Battlemetrics.com");

  return await channel.send(embed).catch(console.error);
}

const Players = (channel = new TextChannel()) => {
  fetch(endpoint, options).then(res => res.json()).then(info => {
    //console.log(info.included);
    let players = info.included;
    let formated = '';
    for(let i = 0; i < players.length; i++){
      if((i + 1) % 2 == 0){
        formated += `${i+1}-'${players[i].attributes.name}'\n` ;
        continue;
      }else{
        formated += `${i+1}-'${players[i].attributes.name}'\t|\t`;
      }
    }

    const embed = new MessageEmbed()
      .setAuthor(info.data.attributes.name)
      .setTitle(`Jugadores online: ${info.data.attributes.players}`)
      .setDescription(`\`\`\`${formated} \`\`\``)
      .setColor("BLUE")
      .setFooter("API proporcionada por Battlemetrics.com")

    return channel.send(embed).catch(console.error);
  })
}

const Details = async (channel = new TextChannel()) => {
  const response = new Rust.ServerInfo(await fetch(endpoint, options).then(res => res.json()).catch(console.error));

  const embed = new MessageEmbed()
    .setColor("GREEN")
    .setTitle(`${response.data.attributes.name} | ${response.data.attributes.status.toUpperCase()}`)
    .setDescription(response.data.attributes.details.rust_description)
    .setFooter("API proporcionada por Battlemetrics.com");

  return await channel.send(embed).catch(console.error);
}
module.exports = {serverInfo, Players, Details}