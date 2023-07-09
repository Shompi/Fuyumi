//@ts-check
import { ChatInputCommandInteraction, EmbedBuilder, Colors, SlashCommandBuilder } from 'discord.js';

export = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Lanza un dado y obten un número')
		.addIntegerOption(dados => {
			return dados.setName('dados')
				.setDescription('Cantidad de dados que quieres lanzar')
				.setMinValue(1)
				.setMaxValue(10)
				.setRequired(false);
		})
		.addIntegerOption(input => {
			return input.setName('caras')
				.setDescription('Cantidad de caras del dado (MAX 100.000, DEF 6)')
				.setMinValue(6)
				.setMaxValue(100_000)
				.setRequired(false)
		}),
	isGlobal: true,
	async execute(interaction: ChatInputCommandInteraction) {

		const caras = interaction.options.getInteger('caras', false) ?? 6;
		const dados = interaction.options.getInteger('dados', false) ?? 1;
		const memberAvatar = interaction.user.displayAvatarURL({ size: 64 });

		const rolls = rollDice(caras, dados);

		const embed = new EmbedBuilder()
			.setTitle(`${interaction.user.username} ha lanzado ${dados} dado/s`)
			.setDescription(`${rolls.map(number => `🎲 -> ${number}`).join("\n")}`)
			.setFooter({ text: `Total: ${rolls.reduce((acc, value) => { return acc + value }, 0)}`, iconURL: memberAvatar })
			.setColor(Colors.Blue);

		return await interaction.reply({
			embeds: [embed],
		});
	}
}

function rollDice(caras: number, dados: number) {
	const rolls = [];
	for (let i = 0; i < dados; i++) {
		rolls.push(Math.floor(Math.random() * caras) + 1);
	}

	return rolls;
}