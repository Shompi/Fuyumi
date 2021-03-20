const { Command, CommandoMessage } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const VoiceRegions = [];


const errorEmbed = new MessageEmbed().setTitle("❌ Ocurrió un error al ejecutar este comando :(").setColor("RED");

const invalidRegionEmbed = () =>
	new MessageEmbed()
		.setTitle("La región de voz que ingresaste no es válida.")
		.setDescription(`Puedes elegir una de estas regiones:\n\`\`\`${VoiceRegions.join(", ")}\`\`\``)
		.setColor("RED");

const regionListEmbed = () =>
	new MessageEmbed()
		.setTitle("Regiones disponibles:")
		.setDescription(`\`\`\`\n${VoiceRegions.join(", ")}\`\`\``)


const missingPermissions =
	new MessageEmbed()
		.setTitle(`❌ ¡Me faltan permisos!`)
		.setDescription(`Necesito el permiso \`MANAGE_GUILD (Administrar Servidor)\``)
		.setColor("RED");

const success = ({ memberName, reason, region, avatar, color }) =>
	new MessageEmbed()
		.setTitle(`¡${memberName} ha cambiado la región de Voz!`)
		.setDescription(`**Nueva región:** ${region.toUpperCase()}\n\n**Razón:** ${reason ? reason : "-"}`)
		.setThumbnail(avatar)
		.setColor(color);

module.exports = class GuildRegion extends Command {
	constructor(client) {
		super(client, {
			name: 'region',
			memberName: 'guildregion',
			aliases: ['voice', 'voiceregion', 'vc'],
			group: 'utilities',
			description: 'Cambia la región de voz del servidor a la que especifiques.',
			examples: ["region brazil", "region us-east", "region japan por que soy kawaii"],
			format: "region [region de voz] [Razón opcional]",
			details: "Para ver la lista de regiones disponibles ejecuta el comando sin argumentos.",
			clientPermissions: ["MANAGE_GUILD"],
			userPermissions: ["MANAGE_GUILD"],
			argsCount: 1,
			args: [
				{
					key: 'region',
					prompt: '',
					type: 'string',
					default: 'all'
				},
				{
					key: 'reason',
					prompt: '',
					infinite: true,
					type: 'string',
					default: 'No se especificó una razón.',
				}
			],
			guildOnly: true
		});
		this.onBlock = (message, reason) => {
			// El usuario no tiene permisos.
			if (reason === 'permission')
				return message.reply(`Lo siento ${message.author}, necesitas el permiso **GESTIONAR SERVIDOR** para utilizar este comando.`);
			// El cliente no tiene permisos.
			if (reason === 'clientPermissions')
				return message.reply(`Necesito el permiso **GESTIONAR SERVIDOR** para ejecutar esta acción.`);
		}
	}

	/**
	 * @param { CommandoMessage } message 
	 */
	async run(message, { region, reason }) {
		const { guild, member, channel, client } = message;

		if (!guild.me.permissions.has('MANAGE_GUILD'))
			return channel.send(missingPermissions);

		if (VoiceRegions.length === 0) {
			const data = await guild.fetchVoiceRegions().then(regions => regions.map(region => region.id));

			for (const region of data) {
				VoiceRegions.push(region);

			}
		}

		if (region === "all") {
			return channel.send(regionListEmbed());
		}

		if (VoiceRegions.includes(region)) {
			if (guild.region === region)
				return channel.send("El servidor ya se encuentra en esa región de voz.");


			try {
				await guild.setRegion(region, reason);

				return channel.send(success({
					avatar: member.user.displayAvatarURL({ size: 512, dynamic: true }),
					memberName: member.displayName,
					reason: reason,
					region: region,
					color: member.displayColor
				}));

			} catch (error) {

				console.log(error);
				await message.react("❌");
				return channel.send(errorEmbed);
			}
		} else {

			return channel.send(invalidRegionEmbed());
		}
	}
}
