import { ChatInputCommandInteraction, EmbedBuilder, Colors, SlashCommandBuilder } from 'discord.js';
export = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Ve el avatar tuyo o de otro usuario')
		.addUserOption(user => user.setName('user').setDescription('El usuario del cual quieres obtener el avatar').setRequired(false)),
	isGlobal: false,
	async execute(interaction: ChatInputCommandInteraction) {
		// Your code...

		// Esta interacción puede ser usada en cualquier contexto (DM, Guild)
		const user = interaction.options.getUser('user', false) ?? interaction.user;

		await user.fetch();

		return await interaction.reply({
			ephemeral: true,
			embeds: [new EmbedBuilder()
				.setColor(Colors.Blue)
				.setTitle(`Avatar de ${user.username}`)
				.setImage(user.displayAvatarURL({ size: 512 }))
			]
		});
	}
}