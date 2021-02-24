const enmap = require('enmap');
const Profile = require('../../../Classes/UserProfile');

/** Dinero que los usuarios depositan en su banco, por ejemplo para no apostarlo todo por accidente. */
const bank = new enmap({ name: 'bank' });

/** Perfil de los usuarios */
const profiles = new enmap({ name: 'profiles' });

/** @param {String} id */
bankUserExists = (id) => bank.has(id) ? true : false;

/** @param {String} id */
bankCreate = (id) => bank.set(id, 0);

/** @param {String} id */
bankGetUser = (id) => {

	// Verificar que el usuario existe
	if (this.bankUserExists(id))
		return bank.get(id);

	else {
		this.bankCreate(id);
		return bank.get(id);
	}
};

/**
 * @param {String} id 
 * @param {Number} amount 
 */
bankUpdate = (id, amount) => {

	/** Dinero del usuario en el banco */
	const userbank = bankGetUser(id);

	bank.set(id, userbank + amount);
};

/**
* @param { String } id ID del usuario
* @returns {Profile}
*/
profileGet = (id) => {

	if (profiles.has(id))
		return profiles.get(id);

	else {
		const user_profile = new Profile(user);

		profiles.set(id, user_profile);

		return user_profile;
	}

};

/** @param {String} id */
profileSave = (id, profile) => {
	const result = profiles.set(id, profile);

	if (!result)
		return false;

	return true;
};

module.exports = {
	profileSave,
	profileGet,
	bankUpdate,
	bankGetUser,
}