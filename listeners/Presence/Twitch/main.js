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
}

