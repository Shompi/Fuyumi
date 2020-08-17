const ENDPOINT = require('../../Keys/brauj'),
  fetch = require('node-fetch'),
  { MessageEmbed, Message } = require('discord.js'),
  {basename} = require('path');

/**
 * @param ENDPOINT retorna un [] con objetos
 * de tipo {endpoint, id, identifiers: [], name, ping }
 */


const NoPlayers = new MessageEmbed()
  .setColor("BLUE")
  .setDescription("No hay jugadores conectados en el servidor.");

module.exports = {
  name: "players",
  aliases: ["pl"],
  description: "Información del servidor de FiveM Fox RP.",
  filename: basename(__filename),
  nsfw: false,
  enabled: true,
  permissions: [],
  usage: "players",
  exclusive: true,
  async execute(message = new Message(), args = new Array()) {
    const { guild, channel } = message;

    if (channel.id !== "707521827403989002") return; //fivemChannel

    try {
      const response = await fetch(ENDPOINT).then(response => response.json());

      //If there are no players on the server.
      if (response.length === 0)
        return channel.send(NoPlayers);


      return channel.send(PlayersList(response));

    }
    catch (e) {
      channel.send("Ocurrió un error con la ejecución del comando!");
    }
  }
}

const PlayersList = (players = new Array()) => {
  /**
 * @param ENDPOINT retorna un [] con objetos
 * de tipo {endpoint, id, identifiers: [], name, ping }
 */
  const LIST = players.map((player, index) => `${index + 1}.-${player.name}, ID: ${player.id}, Ping: ${player.ping}`).join("\n");

  return new MessageEmbed()
    .setTitle(`Jugadores conectados: ${players.length}`)
    .setDescription("**Username -> ID -> Ping**\n```\n" + LIST + "```")
    .setColor("GREEN")
    .setFooter("Servidor: Fox Roleplay");
}