/**
 * @author ShompiFlen
 */

module.exports = class UserBalance {
	/** @param {String} id El usuario al que se le creará su instancia en la base de datos.*/
	constructor(id) {
		// Key para la base de datos.
		this.user_id = id;
		this.progress = {
			/** Nivel de este usuario */
			level: 1,

			/** Experiencia total de este usuario */
			experience: 0,

			/**  Total de experiencia necesitada para subir al siguiente nivel. */
			next_level_in: 0,
		}

		/** Total de mensajes enviados (Capturados por el bot.) */
		this.messages_sent = 0;

		/** Total de veces que el jugador ha interactuado con un juego. */
		this.games_played = 0;

		/** Total de veces que el jugador ha perdido dinero en algun juego. */
		this.games_lost = 0;

		/** Total de veces que el jugador ha ganado en algun juego. */
		this.games_win = 0;

		/** UNIX Timestamp de cuando el usuario fué registrado por primera vez en Muki. */
		this.date_registered = Date.now();

		this.balance = {
			/** Dinero actual en mano del usuario.*/
			on_hand: 0,

			/** Dinero total que ha conseguido el usuario. */
			earned: 0,

			/** El dinero total que ha donado el usuario. */
			donated: 0,

			/** El dinero total recibido a través de donaciones este usuario. */
			received: 0,

			/** El dinero total que este miembro ha robado a otros usuarios. */
			stolen_from_others: 0,

			/** Dinero total que le han robado a este usuario. */
			stolen_by_others: 0,

			dailies: {

				/** Veces que este usuario ha reclamado los diarios. */
				claimed: 0,

				/** Timestamp de la última vez que el usuario reclamó su premio diario */
				claimed_at: 0,

				/** Dinero total reclamado por el bonus diario. */
				total_earned: 0
			}
		}
	}
}