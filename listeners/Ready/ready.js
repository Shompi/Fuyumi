const { Listener, AkairoClient } = require('discord-akairo');
const { TextChannel, MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');

/**@type {NodeJS.Timeout[]} */
const timers = [];
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

		this.setActivity = () => {
			timers.push(setInterval(() => {
				this.client.user.setActivity({ name: 'Reviviendo... de a poco...', type: 'PLAYING' });
			}, 10000));
		}

		this.LoadNewSlashCommand = () => {

		}
	}


	/**@param {AkairoClient} client */
	async exec(client = this.client) {
		/*Code Here*/
		console.log(`Online en Discord como: ${client.user.tag}`);
		console.log(`Bot listo: ${Date()}`);

		/**@type {TextChannel} */
		const RolesChannel = client.channels.cache.get("865360481940930560");

		// Roles de Juegos

		const AmongusButton = new MessageButton()
			.setCustomId('role-750237826443903077')
			.setLabel('Amongus')
			.setStyle('SUCCESS');

		const ApexLegendsButton = new MessageButton()
			.setCustomId('role-865729353215246357')
			.setLabel('Apex Legends')
			.setStyle('SUCCESS');

		const CSGOButton = new MessageButton()
			.setCustomId('role-699832400510976061')
			.setStyle('SUCCESS')
			.setLabel('Counter-Strike: GO');

		const DayZButton = new MessageButton()
			.setCustomId('role-879217872147185714')
			.setStyle('SUCCESS')
			.setLabel("Day Z");

		const EscapeFromTarkovButton = new MessageButton()
			.setCustomId('role-676967872807043072')
			.setStyle('SUCCESS')
			.setLabel('Escape from Tarkov');

		const FortniteButton = new MessageButton()
			.setCustomId('role-627237678248886292')
			.setLabel('Fortnite')
			.setStyle('PRIMARY');

		const GenshinImpactButton = new MessageButton()
			.setCustomId('role-810412477116448769')
			.setStyle('PRIMARY')
			.setLabel('Genshin Impact');

		const LeagueButton = new MessageButton()
			.setCustomId('role-865393189628149760')
			.setStyle('PRIMARY')
			.setLabel('League of Legends');

		const MinecraftButton = new MessageButton()
			.setCustomId('role-865394122897227797')
			.setLabel('Minecraft')
			.setStyle('PRIMARY');

		const RocketLeagueButton = new MessageButton()
			.setCustomId('role-585905903912615949')
			.setLabel('Rocket League')
			.setStyle('PRIMARY');

		const RustButton = new MessageButton()
			.setCustomId('role-639634253369442324')
			.setLabel('Rust')
			.setStyle('SUCCESS');

		const SeaOfThievesButton = new MessageButton()
			.setCustomId('role-854968345974669313')
			.setStyle('SUCCESS')
			.setLabel('Sea of Thieves');

		const ValorantButton = new MessageButton()
			.setCustomId('role-707341893544968324')
			.setLabel('Valorant')
			.setStyle('SUCCESS');

		const WarzoneButton = new MessageButton()
			.setCustomId('role-700166161295474728')
			.setLabel('COD: Warzone')
			.setStyle('SUCCESS');

		const WarThunderButton = new MessageButton()
			.setCustomId('role-865423770264928296')
			.setLabel('War Thunder')
			.setStyle('SUCCESS');

		const row1 = new MessageActionRow()
			.addComponents([
				AmongusButton,
				ApexLegendsButton,
				CSGOButton,
				DayZButton,
				EscapeFromTarkovButton,
			]);

		const row2 = new MessageActionRow()
			.addComponents([
				FortniteButton,
				GenshinImpactButton,
				LeagueButton,
				MinecraftButton,
				RocketLeagueButton,
			]);

		const row3 = new MessageActionRow()
			.addComponents([
				RustButton,
				SeaOfThievesButton,
				ValorantButton,
				WarzoneButton,
				WarThunderButton,
			]);

		const JuegosEmbed = new MessageEmbed()
			.setColor('BLUE')
			.setTitle('Roles de Juegos');

		RolesChannel.messages.fetch('865370324044742656')
			.then(message => {
				message.edit({
					components: [row1, row2, row3],
					embeds: [JuegosEmbed],
				})
			});


		// Roles NSFW

		const AdultButton = new MessageButton()
			.setLabel('Mayor de 18')
			.setStyle('DANGER')
			.setCustomId('role-544718986806296594');

		const ApostadorButton = new MessageButton()
			.setLabel('Apostador Compulsivo')
			.setStyle('DANGER')
			.setCustomId('role-745385918546051222');

		const DegeneradoButton = new MessageButton()
			.setLabel('Degenerado')
			.setStyle('DANGER')
			.setCustomId('role-866061257923493918')

		const AdultRow1 = new MessageActionRow()
			.addComponents([
				AdultButton,
				ApostadorButton,
				DegeneradoButton,
			])

		const NSFWRolesEmbed = new MessageEmbed()
			.setTitle('Roles +18')
			.setDescription('Si te quitas el rol **Mayor de 18** automáticamente se te quitarán todos los demás roles de esta categoria.')
			.setColor('RED');

		RolesChannel.messages.fetch("866060332594233365").then(message => {
			message.edit({
				embeds: [NSFWRolesEmbed],
				components: [AdultRow1],
			});
		});

		// Roles Misceláneos

		const EstudianteButton = new MessageButton()
			.setCustomId('role-576195996728426526')
			.setStyle('PRIMARY')
			.setLabel('Estudiante');

		const JovenProgramadorButton = new MessageButton()
			.setCustomId('role-690009340681388115')
			.setStyle('PRIMARY')
			.setLabel('Programador');

		const SimpButton = new MessageButton()
			.setCustomId('role-752006971527266374')
			.setStyle('PRIMARY')
			.setLabel('SIMP');

		const WeebButton = new MessageButton()
			.setCustomId('role-644251281204183070')
			.setStyle('PRIMARY')
			.setLabel('Weeb / Otaku');

		const MiscEmbed = new MessageEmbed()
			.setTitle('Roles Misceláneos')
			.setDescription('No todos los roles te darán acceso a un canal nuevo, algunos son solamente para el look.')
			.setColor('YELLOW');

		const MiscRow1 = new MessageActionRow()
			.addComponents([
				EstudianteButton,
				JovenProgramadorButton,
				SimpButton,
				WeebButton,
			]);

		RolesChannel.messages.fetch('866071653128732682').then(message => {
			message.edit({
				embeds: [MiscEmbed],
				components: [MiscRow1],
			});
		});


		this.setActivity();
		this.LoadNewSlashCommand();
	}
}

module.exports = ReadyListener;