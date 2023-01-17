import { Listener } from 'discord-akairo'
import { EmbedBuilder, BaseInteraction } from 'discord.js'
import { Fuyumi } from '../../types'
import { ButtonAddRoles } from './Buttons/roles'

export default class InteractionEvent extends Listener {
	constructor() {
		super('interactionCreate', {
			emitter: 'client',
			event: 'interactionCreate'
		})
	}

	async exec(interaction: BaseInteraction) {
		const client = interaction.client as Fuyumi.Client
		try {
			// Chat input command
			if (interaction.isChatInputCommand()) {
				const slashCommand = client.commands.get(interaction.commandName)

				if (!slashCommand) return await interaction.reply({ content: 'Este comando no está implementado.', ephemeral: true })

				interaction.client.emit('commandUsed', ({ commandName: interaction.commandName, user: interaction.user, subcommand: interaction.options.getSubcommand(false) }))
				return await slashCommand.execute(interaction)

			}
			// Button interaction
			else if (interaction.isButton() && interaction.inCachedGuild()) {

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
			// Context menu interactions
			else if (interaction.isContextMenuCommand()) {
				const contextCommand = client.commands.get(interaction.commandName)

				if (!contextCommand) return

				return await contextCommand.execute(interaction)
			}

			else if (interaction.isAutocomplete()) {
				return await client.commands.get(interaction.commandName)?.autocomplete?.(interaction)
			}
		} catch (error) {
			console.error(error)
		}
	}
}