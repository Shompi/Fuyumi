import { EmbedBuilder, BaseInteraction } from 'discord.js'
import { Listener } from '@sapphire/framework';
import { ButtonAddRoles } from '../functions/buttons/roles.js';

export default class InteractionEvent extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
		});
	}

	public async run(interaction: BaseInteraction) {
		try {
			if (interaction.isCommand()) {
				interaction.client.emit('commandUsed', ({ user: { username: interaction.user.username }, commandName: interaction.commandName }))
			}

			// Button interaction
			if (interaction.isButton() && interaction.inCachedGuild()) {

				if (interaction.customId.startsWith('role-')) {
					return await ButtonAddRoles(interaction)

				} else if (interaction.customId === 'showroles') {
					const member = await interaction.member.fetch()

					const roles = member.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString())

					const rolesEmbed = new EmbedBuilder()
						.setTitle(`Estos son tus roles ${member.displayName} (Desde el más alto al mas bajo)`)
						.setDescription(roles.join(" - "))
						.setFooter({ text: `Tienes un total de ${roles.length} roles`, iconURL: member.displayAvatarURL() })
						.setColor(member.displayColor)

					return await interaction.reply({ embeds: [rolesEmbed], ephemeral: true })
				}
			}
		} catch (error) {
			console.error(error)
		}
	}
}