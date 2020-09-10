const ENDPOINT = require('../../Keys/fivemOser'),
  fetch = require('node-fetch'),
  { MessageEmbed, Message } = require('discord.js'),
  { basename } = require('path');

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
  usage: "players [-n | -id] [username | ID]",
  exclusive: true,
  async execute(message = new Message(), args = new Array()) {
    const { guild, channel } = message;

    if (channel.id !== "707521827403989002") return; //fivemChannel
    const players = await Request();

    if (!players)
      return channel.send(NoPlayers);

    if (players === -1)
      return channel.send("Hubo un error al contactar con el servidor.");

    if (args[0] && (args[0] === '-n' || args[0] === '-id')) {
      if (!args[1])
        return channel.send("Debes especificar un `nombre / ID` para buscar en el servidor.");

      const player = FindPlayer(args.shift(), args.join(" "), players);

      if (!player)
        return channel.send("No he encontrado ningún player con ese nombre / ID en el servidor.");

      return channel.send(`\`Username: ${player.name}, ID: ${player.id}, Ping: ${player.ping}\``);

    }
    else return channel.send(PlayersList(players));
  }
}

const FindPlayer = (searchMode, playerNameOrID, players = new Array()) => {
  //Example object: { endpoint, id, identifiers: [], name, ping }

  //Search by name (Case-Insensitive)
  if (searchMode === '-n') {
    for (const player of players) {
      if (player.name.toLowerCase() === playerNameOrID)
        return player;
    }
  }
  else {
    //Search player by the supplied ID.
    for (const player of players) {
      //Lazy comparison since playerNameOrID is a string which can be a number,  but player.id is always a number.
      if (player.id == playerNameOrID)
        return player;
    }
  }

  return null;
}

const Request = async () => {
  try {
    const response = await fetch(ENDPOINT).then(response => response.json());

    //If there are no players on the server.
    if (response.length === 0) return null;

    return response;
  }
  catch (e) {
    return -1;
  }
}

const PlayersList = (players = new Array()) => {
  /**
 * @param ENDPOINT retorna un [] con objetos
 * de tipo {endpoint, id, identifiers: [], name, ping }
 */
  const LIST = players.sort((a,b) => a.id - b.id).map((player) => `ID: ${player.id}, ${player.name}, Ping: ${player.ping <= -1 ? "Timed out" : player.ping}`).join("\n");

  return new MessageEmbed()
    .setTitle(`Jugadores conectados: ${players.length}`)
    .setDescription("**ID -> Username -> Ping**\n```\n" + LIST + "```")
    .setColor("GREEN")
    .setFooter("Servidor: Fox Roleplay");
}