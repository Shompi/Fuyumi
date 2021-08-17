const { MessageEmbed, Message } = require('discord.js');
const { Command } = require('discord-akairo');
const enmap = require('enmap');
const gameImages = new enmap({ name: 'gameimages' });

class GameImagesCommand extends Command {
	constructor() {
		super('gameimages', {
			aliases: ['gameimages', 'addgameimage', 'addgi'],
			ownerOnly: true,
			args: [
				{
					id: 'operation',
					type: 'string',
				},
				{
					id: 'nameAndUrl',
					type: 'string',
				}
			]
		});

		this.searchGame = () => ({ gamename, channel }) => {
			if (gameImages.has(gamename))
				return channel.send("Este juego no está en la base de datos.");

			const url = gameImages.get(gamename);

			const embed = new MessageEmbed()
				.setImage(url)
				.setColor("BLUE")
				.setFooter(gamename);

			return channel.send({ embeds: embed });
		}

		this.addGame = ({ imageurl, gamename, channel }) => {
			if (!gameImages.has(gamename)) {
				gameImages.set(gamename, imageurl);

				const description = `Se ha agregado la [imagen](${imageurl}) para el juego **${gamename}**.`;
				const embed = new MessageEmbed()
					.setColor("BLUE")
					.setThumbnail(imageurl)
					.setDescription(description);

				return channel.send({ embeds: embed });
			}

			return channel.send("Este juego ya está registrado en la base de datos.");
		}

		this.remGame = ({ gamename, channel }) => {
			if (!gameImages.has(gamename))
				return;

			gameImages.delete(gamename);
			return channel.send(`Se eliminó el juego ${gamename} de la base de datos.`);
		}


		this.editGame = ({ imageurl, gamename, channel }) => {
			if (gameImages.has(gamename))
				return channel.send(`No encontré el juego **${gamename}** en la base de datos.`);

			gameImages.set(gamename, imageurl);

			const description = `La imagen del juego **${gamename}** ha sido [cambiada](${imageurl}).`
			const embed = new MessageEmbed()
				.setColor("BLUE")
				.setFooter(gamename)
				.setDescription(description)
				.setImage(imageurl);

			return channel.send({ embeds: embed });
		}
	}

	/**
	 * @param { Message } message  
	 */

	async exec(message, { operation, nameAndUrl }) {

		if (!operation) return;
		console.log(operation);
		const nameandurl = nameAndUrl.split(" | ");

		const gamename = nameandurl[0];
		const imageurl = nameandurl[1];

		console.log(gamename);
		if (!gamename)
			return message.reply("Faltó el nombre del juego.");

		operation === "-a" ? this.addGame({ imageurl, gamename, channel: message.channel })
			: operation === "-e" ? this.editGame({ imageurl, gamename, channel: message.channel })
				: operation === "-s" ? this.searchGame({ gamename, channel: message.channel })
					: this.remGame({ gamename, channel: message.channel });
	}
}

module.exports = GameImagesCommand;