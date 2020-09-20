const { Message, MessageEmbed } = require('discord.js');
const path = require('path');
const VALIDOPERATIONS = ["-a", "-r", "-e", "-s"];


module.exports = {
  name: "gameimage",
  description: "Añade la imagen de un juego a la base de datos.",
  aliases: ["gameimg", "gimg"],
  filename: path.basename(__filename),
  usage: "gimg [-a / -r / -e / -s]",
  nsfw: false,
  enabled: true,
  permissions: [],
  botOwnerOnly: true,
  guildOnly: false,
  moderationOnly: false,
  async execute(message = new Message(), args = new Array()) {
    const { client } = message;
    /* add, edit, remove
    - Example message: muki!gameimage [-a / -e / -r] 
    Procedure:
    *shift args to get value of operation type
    *args = join(" ").split(" |& ")
    *gamename = args.shift()
    *gameimage = args.shift()
    */

    const operation = args.shift();
    console.log(`Operation: ${operation}`);
    if (!VALIDOPERATIONS.includes(operation))
      return;

    args = args.join(" ").split(" | ");
    const gamename = args.shift();
    const imageurl = args.shift();

    if (!gamename)
      return message.channel.send("Faltó el nombre del juego.");

    if (!imageurl && (operation === "-a" || operation === "-e"))
      return message.channel.send("Faltó la URL de la imagen para esta operación.");

    operation === "-a" ? addGame({ client, imageurl, gamename, channel: message.channel })
      : operation === "-e" ? editGame({ client, imageurl, gamename, channel: message.channel })
        : operation === "-s" ? searchGame({ client, gamename, channel: message.channel })
          : remGame({ client, gamename, channel: message.channel });

  }
}

const searchGame = ({ client, gamename, channel }) => {
  if (!client.db.gameImages.has(gamename))
    return channel.send("Este juego no está en la base de datos.");

  const url = client.db.gameImages.get(gamename);
  const embed = new MessageEmbed()
    .setImage(url)
    .setColor("BLUE")
    .setFooter(gamename);

  return channel.send(embed);
}

const addGame = ({ client, imageurl, gamename, channel }) => {
  if (!client.db.gameImages.has(gamename)) {
    client.db.gameImages.set(gamename, imageurl);

    const description = `Se ha agregado la [imagen](${imageurl}) para el juego **${gamename}**.`;
    const embed = new MessageEmbed()
      .setColor("BLUE")
      .setThumbnail(imageurl)
      .setDescription(description);

    return channel.send(embed);
  }

  return channel.send("Este juego ya está registrado en la base de datos.");
}

const remGame = ({ client, gamename, channel }) => {
  if (!client.db.gameImages.has(gamename))
    return;

  client.db.gameImages.delete(gamename);
  return channel.send(`Se eliminó el juego ${gamename} de la base de datos.`);
}

const editGame = ({ client, imageurl, gamename, channel }) => {
  if (!client.db.gameImages.has(gamename))
    return channel.send(`No encontré el juego **${gamename}** en la base de datos.`);

  client.db.gameImages.set(gamename, imageurl);

  const description = `La imagen del juego **${gamename}** ha sido [cambiada](${imageurl}).`
  const embed = new MessageEmbed()
    .setColor("BLUE")
    .setFooter(gamename)
    .setDescription(description)
    .setImage(imageurl);

  return channel.send(embed);
}