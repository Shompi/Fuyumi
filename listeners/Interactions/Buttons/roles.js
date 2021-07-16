const { ButtonInteraction } = require("discord.js");

/**
@param {ButtonInteraction} interaction
 */
module.exports.AddRoles = async (interaction) => {
	// Enviemos un mensaje por ahora

	const { guild, client, member } = interaction;
	const ButtonPressed = interaction.component;
	const RoleID = ButtonPressed.customId.slice(5);
	const RoleObject = guild.roles.cache.get(RoleID);
	let operation;

	console.log(`${interaction.member.displayName} presionó ${ButtonPressed.label}`);

	if (!RoleObject) return;

	if (member.roles.cache.has(RoleID)) {
		operation = await member.roles.remove(RoleID).then(() => false);

	}
	else {
		operation = await member.roles.add(RoleID).then(() => true);
	}

	interaction.reply({
		content: `Se te ${operation ? 'agregó' : 'quitó'} el rol **${ButtonPressed.label}**`,
		ephemeral: true,
	})

	return;
}