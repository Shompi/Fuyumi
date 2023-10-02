import { SearchGhost } from "../functions/phasmo-ghost.js"
import { Subcommand } from "@sapphire/plugin-subcommands";
import GhostsList from "../resources/phasmo_ghosts.json" assert {type: 'json'}

export class PhasmophobiaCommand extends Subcommand {
	public constructor(context: Subcommand.Context, options: Subcommand.Options) {
		super(context, {
			...options,
			name: 'phasmo',

			subcommands: [
				{
					name: 'ghost',
					chatInputRun: 'chatInputGhost'
				}
			]
		});
	}

	public override registerApplicationCommands(registry: Subcommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder.setName("phasmo")
				.setDescription("Comandos de Phasmophobia")
				.setDMPermission(true)
				.addSubcommand(ghost => {

					return ghost.setName("ghost")
						.setDescription("Ve la información de un fantasma")
						.addStringOption(fantasma => {

							return fantasma.setName("fantasma")
								.setDescription("description")
								.setAutocomplete(true)
								.setRequired(true)

						})
				})
		);
	}

	public async autocompleteRun(interaction: Subcommand.AutocompleteInteraction) {
		const subcommand = interaction.options.getSubcommand(false)

		if (subcommand === "ghost") {

			const name = interaction.options.getFocused()

			return await interaction.respond(GhostsList.filter(ghost => ghost.name.toLowerCase().includes(name)).map(ghost => ({ name: ghost.name, value: ghost.id })))
		}
	}

	public async chatInputGhost(interaction: Subcommand.ChatInputCommandInteraction) {
		return await SearchGhost(interaction.options.getString('fantasma', true), interaction);
	}
}