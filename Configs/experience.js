/*
En este modulo se definirán las constantes de experiencia, por ejemplo, la experiencia
otorgada a un usuario cada vez que envia un mensaje (y es registrado por Muki).
 */

module.exports = {
	perMessage: 1,
	perMeme: 15,
	perAttachment: 3,
	perCommandUsed: 5,
	perDaily: 100,
	perStar: 10,

	/** Multiplicador de experiencia, usado cuando el mensaje o interacción sea en el servidor de Exiliados. */
	exMultiplier: 2
}