const { Presence, Activity, MessageEmbed, TextChannel, GuildMember } = require('discord.js');
const { Listener } = require('discord-akairo');
const keyv = require('keyv');
const LIVESTREAMS_TIMESTAMPS = new keyv('sqlite://database.sqlite', { namespace: 'livestreams' });
const TWOHOURS = 1000 * 60 * 60 * 2;
const IMAGES = require('./resources/images');
class PresenceUpdateListener extends Listener {
	constructor() {
		super('presenceUpdate', {
			emitter: 'client',
			event: 'presenceUpdate'
		});

		this.hasTimers = false;

		this.checkTwitchStream = async (/**@type {Presence} */ presence) => {

			// Funciones
			const getLivestreamInfo = (/**@type {Presence} */ presence) => {
				const { activities } = presence;

				return activities.find(activity => activity.type === 'STREAMING');
			}

			const createEmbed = (/**@type {Activity} */ activity, /**@type {GuildMember} */ member) => {
				return new MessageEmbed()
					.setTitle(`¡${member.displayName} ha comenzado a transmitir en ${activity.name}!`)
					.setDescription(`${activity.details}\nJugando a: ${activity.state}\n[-> Únete a la transmisión <-](${activity.url})`)
					.setColor(member.displayColor)
					.setThumbnail(member.user.displayAvatarURL({ size: 512, dynamic: true }))
					.setImage(IMAGES.Twitch);
			}

			const sendLiveStream = (/**@type {Presence} */ presence) => {
				/**@type {TextChannel} */

				const STREAM_CHANNEL = presence.client.channels.cache.get("600159867239661578");

				STREAM_CHANNEL.send({
					embeds: [createEmbed(STREAMED_ACTIVITY, presence.member)]
				});
			}
			//************ */

			// Chequear que haya una actividad siendo stremeada
			const STREAMED_ACTIVITY = getLivestreamInfo(presence);

			if (!STREAMED_ACTIVITY) return;
			console.log(`USER ${presence.member.user.tag} has ACTIVITY ${STREAMED_ACTIVITY.details}`);

			let USER_TIMESTAMP = await LIVESTREAMS_TIMESTAMPS.get(presence.user.id).catch(() => null);
			let NEW_USER = false;

			if (!USER_TIMESTAMP) {
				// Si el usuario no está lo agregamos
				console.log("USER WAS NOT ON DB");
				await LIVESTREAMS_TIMESTAMPS.set(presence.user.id, Date.now());
				USER_TIMESTAMP = await LIVESTREAMS_TIMESTAMPS.get(presence.user.id);
				NEW_USER = !NEW_USER;
			}

			console.log(`NEW USER: ${NEW_USER}, TIMESTAMP: ${USER_TIMESTAMP}`);

			if (NEW_USER) {

				sendLiveStream(presence);

			} else {
				// Revisar si han pasado 2 horas desde que el usuario comenzó a transmitir
				const TIMENOW = Date.now();

				const TIMEDIFF = TIMENOW - USER_TIMESTAMP;
				console.log(`TIMENOW: ${TIMENOW}\nUSER_TIMESTAMP: ${USER_TIMESTAMP}\nTIMEDIFF: ${TIMEDIFF}\nTWOHOURS: ${TWOHOURS}]`);
				if (TIMEDIFF >= TWOHOURS) {
					sendLiveStream(presence);
					// Update timestamp
					await LIVESTREAMS_TIMESTAMPS.set(presence.user.id, Date.now());
				} else return;
			}
		}
	}
	/**
	*@param {Presence} old
	*@param {Presence} now
	*/
	exec(old, now) {
		/*Code Here*/

		/* Esto solo funcionará para exiliados */
		if (now.guild.id === '537484725896478733') {
			this.checkTwitchStream(now);
		}

	}
}
module.exports = PresenceUpdateListener;