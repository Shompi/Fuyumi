const { ButtonInteraction } = require("discord.js");


const Mayor18ID = '544718986806296594';
const ApostadorID = '745385918546051222';
const DegeneradoID = '866061257923493918';
/**
@param {ButtonInteraction} interaction
 */
module.exports.AddRoles = async (interaction) => {
	// Enviemos un mensaje por ahora

	const { guild, client, member } = interaction;
	const ButtonPressed = interaction.component;
	const RoleID = ButtonPressed.customId.slice(5);
	const RoleObject = guild.roles.cache.get(RoleID);
	const MemberIsOver18 = member.roles.cache.has(Mayor18ID);

	let operation;

	console.log(`${interaction.member.displayName} presionó ${ButtonPressed.label}`);

	if (!RoleObject) return;

	if ((RoleID === ApostadorID || RoleID === DegeneradoID) && !MemberIsOver18)
		return interaction.reply({
			content: 'Debes tener el rol **Mayor de 18** para poder asignarte este rol.',
			ephemeral: true,
		});


	if (MemberIsOver18 && RoleID === Mayor18ID) {
		await member.roles.remove([Mayor18ID, ApostadorID, DegeneradoID]);

		return interaction.reply({
			content: '**Se te han quitado todos los roles NSFW / +18**',
			ephemeral: true,

		});
	}


	if (member.roles.cache.has(RoleID)) {
		operation = await member.roles.remove(RoleID).then(() => false);
	}
	else {
		operation = await member.roles.add(RoleID).then(() => true);
	}

	return interaction.reply({
		content: `Se te ${operation ? 'agregó' : 'quitó'} el rol **${RoleObject.name}**`,
		ephemeral: true,
	});
}