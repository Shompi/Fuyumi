const { CommandInteraction, Role } = require("discord.js");
const Enmap = require('enmap');
const ModRolesEnmap = new Enmap({ name: 'modrole' });

/**@param {CommandInteraction} interaction */
module.exports.SetModRole = (interaction) => {
	const { client, guild, member } = interaction;

	if (member.id !== guild.ownerId) {
		return interaction.reply({
			content: 'No tienes permiso de utilizar este comando.',
			ephemeral: true,
		});
	}

	/**@type {Role} */
	const InputModRole = interaction.options.get('rol').role;
	ModRolesEnmap.set(guild.id, InputModRole.id);

	return interaction.reply({
		content: `El rol **${InputModRole.name}** ha sido asignado como el rol de moderador.`,
		ephemeral: true,
	});
}