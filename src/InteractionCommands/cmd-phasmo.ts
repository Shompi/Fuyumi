import { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"
import { SearchGhost } from "./SubCommands/phasmo-ghost"
import { Phasmophobia } from "@myTypes/index"

export = {
	hasSubcommands: false,
	data: new SlashCommandBuilder()
		.setName("phasmo")
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
		}),
	isGlobal: true,
	async execute(interaction: ChatInputCommandInteraction) {

		const subcommand = interaction.options.getSubcommand()

		switch (subcommand) {
			case "ghost":
				await SearchGhost(interaction.options.getString("fantasma", true), interaction)
				break
		}

	},
	async autocomplete(interaction: AutocompleteInteraction) {

		const subcommand = interaction.options.getSubcommand(false)

		if (subcommand === "ghost") {



			const name = interaction.options.getFocused()

			const GhostsList = (await import("../../Resources/phasmo_ghosts.json")).default satisfies Phasmophobia.Ghost[]
			return await interaction.respond(GhostsList.filter(ghost => ghost.name.toLowerCase().includes(name)).map(ghost => ({ name: ghost.name, value: ghost.id })))
		}
	}
}