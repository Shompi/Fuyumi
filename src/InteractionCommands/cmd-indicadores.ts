import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Mindicador } from '../types';

import { request } from 'undici';
const monedaCLP = "CLP"

export = {
	data: new SlashCommandBuilder()
		.setName('indicadores')
		.setDescription('Muestra información de distintas monedas convertidas a CLP'),
	isGlobal: true,
	async execute(interaction: ChatInputCommandInteraction) {
		// Your code...

		const info = await request("https://mindicador.cl/api").then(response => response.body.json() as Promise<Mindicador.Indicadores>).catch(err => console.error(err));

		if (!info) {
			return await interaction.reply("Ha ocurrido un error con este comando...");
		}

		const { dolar, euro, bitcoin } = info;

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

		return await interaction.reply({ embeds: [embed] });
	}
}