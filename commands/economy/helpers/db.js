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

	for (const id of IDS) {
		const profile = profiles.get(id);

		profile.last_donator = {
			tag: null,
			amount: null
		}

		profiles.set(id, profile);
		console.log("UPDATED PROFILE:", profile);
	}

	return true;
}

module.exports = {
	profileGet,
	bankAddCoins,
	bankGet,
	bankSetCoins,
	profileClaimDaily,
	profileSave,
	profileUpdateDatabase,
}