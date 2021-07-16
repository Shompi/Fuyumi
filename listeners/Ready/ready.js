const { Listener, AkairoClient } = require('discord-akairo');
const { TextChannel, MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');

const activity = {
	name: "@Muki help",
	type: "LISTENING"
}

/**@type {NodeJS.Timeout[]} */
const timers = [];

console.log("Evento ready iniciado.");
console.log("timers: " + timers.length);

class ReadyListener extends Listener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready'
		});
		this.hasTimers = true;
		this.clearTimers = () => {
			for (const timer of timers) {
				clearTimeout(timer);
				clearInterval(timer);
				clearImmediate(timer);
				console.log("Timers limpiados.");
			}
		}
	}


	/**@param {AkairoClient} client */
	async exec(client = this.client) {
		/*Code Here*/
		console.log(`Online en Discord como: ${client.user.tag}`);

		try {
			client.user.setPresence({ activity: activity });
			console.log(`Bot listo: ${Date()}`);
		} catch (error) {
			console.log(error);
			client.emit("error", error);
		}

		/**@type {import('discord.js').ApplicationCommandData} */
		const data = [{
			name: 'setup',
			description: 'Comandos para configurar ciertas funcionalidades dentro del servidor.',
			options: [
				{
					name: 'livestreamings',
					description: 'Configura un canal para enviar mensajes cuando un usuario transmite con GO LIVE, Twitch o Youtube.',
					type: 'SUB_COMMAND',
					options: [{
						name: 'activados',
						description: 'Activa o desactiva los mensajes automáticos para los livestreamings.',
						type: 'BOOLEAN',
						required: false
					},
					{
						name: 'canaldetexto',
						type: 'CHANNEL',
						description: 'Canal en el cual quieres que los mensajes de livestream se envien.',
						required: false,
					},
					{
						name: 'twitch',
						type: 'BOOLEAN',
						required: false,
						description: 'Activar los mensajes para usuarios que transmiten en Twitch.'
					},
					{
						name: 'golive',
						type: 'BOOLEAN',
						required: false,
						description: 'Activar los mensajes para usuarios que transmiten con Go Live.'
					}]
				}
			]
		}]

		await client.guilds.cache.get("537484725896478733").commands.fetch()
			.then(commands => commands.find(command => command.name == 'setup')?.delete());

		await client.guilds.cache.get("537484725896478733").commands.set(data)
			.then(() => console.log("El comando fue actualizado."));



		/**@type {TextChannel} */
		const RolesChannel = client.channels.cache.get("865360481940930560");


		// Components
		const RocketLeagueButton = new MessageButton()
			.setCustomId('role-585905903912615949')
			.setLabel('Rocket League')
			.setStyle('SUCCESS');

		const SeaOfThievesButton = new MessageButton()
			.setCustomId('role-854968345974669313')
			.setStyle('SUCCESS')
			.setLabel('Sea of Thieves');

		const GenshinImpactButton = new MessageButton()
			.setCustomId('role-810412477116448769')
			.setStyle('SUCCESS')
			.setLabel('Genshin Impact');

		const CSGOButton = new MessageButton()
			.setCustomId('role-699832400510976061')
			.setStyle('SUCCESS')
			.setLabel('Counter-Strike: GO');

		const ValorantButton = new MessageButton()
			.setCustomId('role-707341893544968324')
			.setLabel('Valorant')
			.setStyle('SUCCESS');

		const row1 = new MessageActionRow()
			.addComponents([
				RocketLeagueButton,
				SeaOfThievesButton,
				GenshinImpactButton,
				CSGOButton,
				ValorantButton
			]);

		const AmongusButton = new MessageButton()
			.setCustomId('role-750237826443903077')
			.setLabel('Amongus')
			.setStyle('PRIMARY');

		const TarkovButton = new MessageButton()
			.setCustomId('role-676967872807043072')
			.setLabel('Escape from Tarkov')
			.setStyle('PRIMARY');

		const WarzoneButton = new MessageButton()
			.setCustomId('role-700166161295474728')
			.setLabel('COD: Warzone')
			.setStyle('PRIMARY');

		const FortniteButton = new MessageButton()
			.setCustomId('role-627237678248886292')
			.setLabel('Fortnite')
			.setStyle('PRIMARY');

		const RustButton = new MessageButton()
			.setCustomId('role-639634253369442324')
			.setLabel('Rust')
			.setStyle('PRIMARY');

		const row2 = new MessageActionRow()
			.addComponents([
				AmongusButton,
				TarkovButton,
				WarzoneButton,
				FortniteButton,
				RustButton
			]);

		const LeagueButton = new MessageButton()
			.setCustomId('role-865393189628149760')
			.setStyle('SUCCESS')
			.setLabel('League of Legends');

		const MinecraftButton = new MessageButton()
			.setCustomId('role-865394122897227797')
			.setLabel('Minecraft')
			.setStyle('SUCCESS');

		const row3 = new MessageActionRow()
			.addComponents([
				LeagueButton,
				MinecraftButton,
			]);

		const ExiliadeButton = new MessageButton()
			.setLabel('Exiliade')
			.setStyle('SECONDARY')
			.setCustomId('role-539578236653404190');

		const AdultButton = new MessageButton()
			.setLabel('Mayor de 18')
			.setStyle('DANGER')
			.setCustomId('role-544718986806296594');

		const row4 = new MessageActionRow()
			.addComponents([
				ExiliadeButton,
				AdultButton,
			]);

		const embed = new MessageEmbed()
			.setColor('BLUE')
			.setTitle('¡Presiona un botón para **asignarte / quitarte** un rol!');
		RolesChannel.messages.fetch('865370324044742656')
			.then(message => {
				message.edit({
					components: [row1, row2, row3, row4],
					embeds: [embed],
				})
			});

		timers.push(setInterval(() => {
			client.user.setActivity({ name: 'Reviviendo... de a poco...', type: 'PLAYING' });
		}, 10000));
	}
}

module.exports = ReadyListener;