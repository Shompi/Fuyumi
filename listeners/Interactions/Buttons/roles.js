const { ButtonInteraction } = require("discord.js");


const NSFWROLES = ["745385918546051222", "866061257923493918"];

const Mayor18ID = '544718986806296594';
/**
@param {ButtonInteraction} interaction
 */
module.exports = async (interaction) => {
	// Enviemos un mensaje por ahora

  const { guild, member } = interaction;
	const ButtonPressed = interaction.component;
	const RoleID = ButtonPressed.customId.slice(5);
	const RoleObject = guild.roles.cache.get(RoleID);
	const MemberIsOver18 = member.roles.cache.has(Mayor18ID);

	let operation;

  console.log(`${interaction.member.user.tag} presionó ${ButtonPressed.label}`);

	if (!RoleObject) return;

  if (NSFWROLES.includes(RoleID) && !MemberIsOver18)
		return interaction.reply({
			content: 'Debes tener el rol **Mayor de 18** para poder asignarte este rol.',
			ephemeral: true,
		});


	if (MemberIsOver18 && RoleID === Mayor18ID) {
    await member.roles.remove([...NSFWROLES, Mayor18ID]);

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