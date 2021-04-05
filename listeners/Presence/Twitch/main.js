const { Presence, Activity, TextChannel, MessageEmbed } = require('discord.js');

const enmap = require('enmap');
const TwitchStream = new enmap({ name: 'twitch' });
const gameImages = new enmap({ name: 'gameimages' });
const enabledStreams = new enmap({ name: 'enabledstreams' });

const TWOHOURS = 1000 * 60 * 60 * 2;
const CONECTORES = [
	"ha comenzado a transmitir en",
	"está en vivo en",
	"está transmitiendo en vivo en"
]

let config = {
	enabled: false,
	channel: "",
}

/**
 * @param {Presence} now 
 * @param {Activity} activity 
 * @param {TextChannel} streamingChannel 
 */
const sendStreaming = (now, activity, streamingChannel) => {
	//In this case, activity.state is the name of the game being played.
	const image = gameImages.get(activity.state) || gameImages.get("Actividad Desconocida");
	const embed = new MessageEmbed()
		.setColor(now.member.displayColor)
		.setThumbnail(`${now.member.user.displayAvatarURL({ size: 256 })}`)
		.setTitle(`¡${now.member.displayName} ${CONECTORES[Math.floor(Math.random() * CONECTORES.length)]} ${activity.name}!`)
		.setDescription(`**${activity.details}**\n[Ver transmisión](${activity.url})`)
		.setImage(image);

	return streamingChannel.send(embed);
}

/**
 * @param {Presence} old 
 * @param {Presence} now 
 */
module.exports = (old, now) => {

	/**
	 * 1.- Verificar que el usuario está stremeando
	 * 2.- Verificar si el usuario estaba stremeando antes
	 * 3.- Comparar la actividad anterior con la nueva:
	 * >Si son iguales = retornar
	 * >Si son distintas = Actualizar el mensaje relacionado con el primer livestream.
	 */

	if (now.user.bot) return;
	if (!old) return;

	const activity = now.activities.find(act => act.type === 'STREAMING');
	const oldActivity = old.activities.find(act => act.type === 'STREAMING');
	if (!activity) return;

	if (activity && oldActivity) return; //console.log(`[STREAMING] ${now.member.user.tag} ya estaba stremeando de antes.`);

	const { client, guild } = now;

	if (!enabledStreams.has(guild.id)) {
		enabledStreams.set(guild.id, config);
	}

	config = enabledStreams.get(guild.id);

	if (!config.enabled) return;

	const streamingChannel = now.guild.channels.cache.get(config.channel);

	if (!streamingChannel) return; //console.log("No se encontró canal de streamings.");

	const timeNow = Date.now();
	try {
		//console.log(`[STREAMING] User ${now.member.user.tag} está stremeando en ${activity.name}`);
		const { member } = now;
		if (TwitchStream.has(member.id)) {
			//console.log(`now: ${activityName} db: ${dbmember.activityName}`);
			const begun = TwitchStream.get(member.id, 'streamStarted');

			if ((timeNow - begun) >= TWOHOURS) {
				sendStreaming(now, activity, streamingChannel);
				TwitchStream.set(member.id, timeNow, "streamStarted");
				return console.log(TwitchStream.get(member.id));
			} else return; //If the elapsed time is not greater than two hours then we need to return.

		} else {
			//If the member was not in the database we need to add him in.
			sendStreaming(now, activity, streamingChannel);
			TwitchStream.set(member.id, timeNow, "streamStarted");
			return;
		}
	} catch (error) {
		console.error(error);
	}
}

