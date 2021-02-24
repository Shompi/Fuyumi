const enmap = require('enmap');

module.exports = {
	/** @description Usuarios transmitiendo. */
	usersStreaming: new enmap({ name: 'streamings' }),

	/** @description Imágenes de juegos para los embeds de Go Live, Twitch, Youtube */
	gameImages: new enmap({ name: "gameimages" }),

	/** @description Configuración por guild para habilitar o desactivar los mensajes de streaming */
	guildStreamConfigs: new enmap({ name: "guildStreamConfigs" }),

	/** @description Kudos de los usuarios, se obtendrán cuando los miembros reaccionen con ⭐ al mensaje de otro miembro */
	kudos: new enmap({ name: 'kudos' })
}