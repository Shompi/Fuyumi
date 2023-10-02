import { EmbedBuilder } from 'discord.js';
import { Command } from '@sapphire/framework';

const cooldowns: Map<string, { timestamp: number }> = new Map();
const COOLDOWNTIMEMS = 10 * 1000 // 10 segundos

export class PilinCommand extends Command {
	public constructor(context: Command.Context, options: Command.Options) {
		super(context, { ...options });
	}

	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName('pilin')
				.setDescription('Revela al mundo el tamaño de tu pilín')
		);
	}

	public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
		if (interaction.inCachedGuild()) {
			if (cooldowns.has(interaction.member.id)) {

				const timestamp = cooldowns.get(interaction.member.id)!.timestamp;

				const timeNow = Date.now();

				const timeleft = Math.floor((timestamp - timeNow) / 1000);

				return await interaction.reply({ ephemeral: true, content: `Debes esperar **${timeleft}** segundos antes de usar este comando nuevamente.` });
			}

			// Añadir al miembro a la lista de cooldowns
			cooldowns.set(interaction.member.id, { timestamp: Date.now() + COOLDOWNTIMEMS });

			setTimeout(() => {
				cooldowns.delete(interaction.member.id)
			}, COOLDOWNTIMEMS);

			const medida = Math.floor(Math.random() * 51) || 1000

			const embed = new EmbedBuilder()
				.setAuthor({ iconURL: interaction.member.displayAvatarURL({ size: 64 }), name: interaction.member.displayName })
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
				.setDescription(`**¡La 🍌 de ${interaction.member} mide ${medida}cm!**`)
				.setColor(interaction.member.displayColor);

			return await interaction.reply({ embeds: [embed] });
		}

	}
}