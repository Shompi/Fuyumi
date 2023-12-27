import { EmbedBuilder } from 'discord.js'
import { Command } from '@sapphire/framework';
import type { Mindicador } from 'types/index.js';

const monedaCLP = "CLP"

export class Indicadores extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options });
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName('indicadores')
				.setDescription('Muestra información de distintas monedas convertidas a CLP')
		)
	}

	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		const info = await fetch("https://mindicador.cl/api").then(response => response.json() as Promise<Mindicador.Indicadores>).catch(err => console.error(err));

		if (!info) {
			return await interaction.reply("Ha ocurrido un error con este comando...")
		}

		const { dolar, euro, bitcoin } = info

		const embed = new EmbedBuilder()
			.setAuthor({ name: 'Indicadores de hoy', iconURL: interaction.client.user.displayAvatarURL({ size: 64 }) })
			.setColor('Blue')
			.setDescription(
				`**${dolar.nombre}**\t -> \t${dolar.valor} ${monedaCLP}\n` +
				`**${euro.nombre}**\t -> \t${euro.valor} ${monedaCLP}\n` +
				`**${bitcoin.nombre}**\t -> \t${bitcoin.valor} USD`
			)
			.setTimestamp()
			.setFooter({ text: "* Estos valores podrian tener un desfase de hasta 2 dias." })

		await interaction.reply({ embeds: [embed] })
	}
}