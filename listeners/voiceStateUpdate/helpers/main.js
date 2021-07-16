const { MessageEmbed, VoiceState } = require('discord.js');
const TWOHOURS = 1000 * 60 * 60 * 2; // 2 Horas.
const enmap = require('enmap');

const database = new enmap({ name: 'streamings' });

const usersStreaming = new Set();

const ExiliadosStreamChannel = "600159867239661578";

/**
 * @param {VoiceState} old 
 * @param {VoiceState} now 
 */
module.exports = async (old, now) => {

	if (now.streaming && !usersStreaming.has(now.id)) {
		usersStreaming.add(now.id);

		const activity = now.member.presence.activities.find(activity => activity.type === "PLAYING");

		if (!activity)
			return;

		const embed = new MessageEmbed()
			.setTitle(`¡${now.member.user.tag} ha comenzado a transmitir con Go Live en ${now.channel.name}!`)
			.setDescription(`${activity.name} - ${activity.state ?? ''}, ${activity.details ?? ''}`)
			.setColor('BLUE')
			.setThumbnail(now.member.user.displayAvatarURL({ size: 512 }));

		now.client.channels.cache.get(ExiliadosStreamChannel).send({ embeds: [embed] });
	}
}