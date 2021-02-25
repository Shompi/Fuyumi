const { MessageEmbed } = require('discord.js');
const VALIDOPERATIONS = ["-a", "-r", "-e", "-s"];
const { Command, CommandoMessage } = require('discord.js-commando');

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: 'gimage',
			memberName: 'gameimages',
			aliases: ['gameimage'],
			group: 'owner',
			hidden: true,
			description: 'Añade imágenes de juegos para los embeds de Live Streaming',
			examples: ["gimage [Nombre del Juego] | [URL]"],
			guildOnly: false,
			ownerOnly: true,
			args: [
				{
					key: 'operation',
					type: 'string',
					oneOf: VALIDOPERATIONS,
					error: 'Debes ingresar una de las operaciones validas: -a, -r, -e, -s',
					prompt: 'Ingresa la operación que quieres realizar: -a, -s, -e, -r'
				},
				{
					key: 'nameAndUrl',
					type: 'string',
					error: 'Debes ingresar el nombre del juego y la URL para la imágen del juego.',
					prompt: 'Ingresa el nombre del juego y la URL de la imágen separados por un `|`',
					infinite: true
				}
			]
		});
	}

	/**
	 * @param { CommandoMessage } message 
	 * @param {*} args 
	 */
	async run(message, { operation, nameAndUrl }) {
		console.log(`Operation: ${operation}`);

		const nameandurl = nameAndUrl.split(" | ");

		const gamename = nameandurl[0];
		const imageurl = nameandurl[1];

		if (!gamename)
			return message.reply("Faltó el nombre del juego.");

		if (!imageurl)
			return message.reply("No has ingresado la url de la imágen.")

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