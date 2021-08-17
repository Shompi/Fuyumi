const { Listener } = require('discord-akairo');
const { VoiceState, MessageEmbed } = require('discord.js');
const enmap = require('enmap');
const gameImages = new enmap({ name: 'gameimages' });
// Constantes de seguridad
const AvailableGuilds = ["537484725896478733"];
const usersStreaming = new Set();
const ExiliadosStreamChannel = "600159867239661578";

class VoiceStateUpdateListener extends Listener {
	constructor() {
		super('voiceStateUpdate', {
			emitter: 'client',
			event: 'voiceStateUpdate'
		});

		this.hasTimers = false;

		this.SendMessage = (old, now) => {

			if (now.streaming && !usersStreaming.has(now.id)) {
				usersStreaming.add(now.id);
				setTimeout(() => {
					usersStreaming.delete(now.id);
				}, 1000 * 60 * 60);
				const activity = now.member.presence.activities.find(activity => activity.type === "PLAYING");


				if (!activity)
					return;

				const embed = new MessageEmbed()
					.setTitle(`¡${now.member.user.tag} ha comenzado a transmitir ${activity.name} en ${now.channel.name}!`)
					.setDescription(`**${activity.state ?? 'Sin estado'}**\n**${activity.details ?? 'Sin detalles'}**`)
					.setColor('BLUE')
					.setThumbnail(now.member.user.displayAvatarURL({ size: 512 }))
					.setImage(gameImages.get(activity.name));

				now.client.channels.cache.get(ExiliadosStreamChannel).send({ embeds: [embed] });
			}
		}
	}
	/**
	*@param {VoiceState} old
	*@param {VoiceState} now
	*/
	async exec(old, now) {
		if (now.member.user.bot) return;
		if (now.member.partial)
			await now.member.fetch();

		if (!now.member.presence || now.member.presence.status === 'offline') return;

		if (AvailableGuilds.includes(now.guild.id)) {
			this.SendMessage(old, now);
		}
	}
}

module.exports = VoiceStateUpdateListener;