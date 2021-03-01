const enmap = require('enmap');
const Profile = require('../../../Classes/UserProfile');
const balValues = require('../../../configs/balance');
const expValues = require('../../../configs/experience');

/** Dinero que los usuarios depositan en su banco, por ejemplo para no apostarlo todo por accidente. */
const bank = new enmap({ name: 'bank' });

/** Perfil de los usuarios */
const profiles = new enmap({ name: 'profiles' });

const bankGet = (id) => bank.ensure(id, 0);

/**
 * Método para añadir fondos al banco de un usuario.
 * @param {String} id 
 * @param {Number} amount
 * @returns {Number} cantidad total en el banco luego de actualizar. 
 */
const bankAddCoins = (id, amount) => {

	const userCoins = bank.ensure(id, 0);

	bank.set(id, userCoins + amount);
	return bank.get(id);
};

/**
 * Setea el banco de un usuario a {amount} directamente.
 * @param {String} id 
 * @param {Number} amount 
 */
const bankSetCoins = (id, amount) => {
	bank.set(id, amount);

	return amount;
}

/**
 * Método para donar a otro usuario, las donaciones son directamente de banco a banco.
 * @param {String} origin ID del usuario que realiza la donación
 * @param {String} destination ID del usuario al que le están realizando la donación
 * @param {Number} amount Cantidad de Monedas que se están donando, este valor DEBE ser positivo.
 */

const bankDonate = (origin, destination, amount) => {

	// Primero nos aseguramos de que ambos usuarios estén en la base de datos.
	bank.ensure(origin, 0);
	bank.ensure(destination, 0);

	// Restamos amount del banco origen
	bank.math(origin, 'sub', amount);

	// Añadimos amount al banco destination
	bank.math(destination, 'add', amount);

	return true;
}

/**
 * Método usado para el comando !deposit [cantidad|all];
 * @param {String} id ID del usuario
 * @param {Number} amount Cantidad de dinero que depositará en su banco.
 */
const bankDeposit = (id, amount) => {
	bank.ensure(id, 0);
	bank.math(id, 'add', amount);

	return true;
}

/**
* @param { String } id ID del usuario
* @returns {Profile}
*/
const profileGet = (id) => profiles.ensure(id, new Profile(id));

/** @param {String} id */
const profileSave = (id, profile) => {
	const result = profiles.set(id, profile);

	if (!result)
		return false;

	return true;
};

/**
 * @param {Profile} profile 
 */
const profileClaimDaily = (profile) => {

	profile.balance.dailies.claimed_at = Date.now();

	profile.balance.dailies.claimed++;

	profile.balance.dailies.total_earned += balValues.dailyAmount;

	profile.balance.earned += balValues.dailyAmount;

	profile.balance.on_hand += balValues.dailyAmount;

	profile.progress.experience += expValues.perDaily;

	return profileSave(profile.user_id, profile);
}

const profileUpdateDatabase = () => {
	const IDS = profiles.indexes;
	let updated = 0;
	for (const id of IDS) {
		updated++;
		const profile = profiles.get(id);

		profile.balance.donations.last_donator = {
			tag: null,
			amount: null
		}

		delete profile.last_donator;


		profiles.set(id, profile);
		console.log("UPDATED PROFILE:", profile);
	}
	console.log(`SE ACTUALIZARON ${updated} PERFILES.`);
	return true;
}

/**
 * @returns {Array}
 */
const leaderboard_bankcoins = () => {

	const banks = bank.map((amount, key) => ({ coins: amount, user_id: key }));


	const banks_sorted = banks.sort((vala, valb) => vala.coins - valb.coins);

	console.log(banks_sorted);
}

leaderboard_bankcoins();

module.exports = {
	profileGet,
	bankAddCoins,
	bankDeposit,
	bankGet,
	bankSetCoins,
	bankDonate,
	profileClaimDaily,
	profileSave,
	profileUpdateDatabase,
}