import { readFile } from "node:fs/promises"
import { AutocompleteInteraction, ChatInputCommandInteraction, Options, SlashCommandBuilder } from "discord.js"
import { SearchGhost } from "./SubCommands/phasmo-ghost"
import { Phasmophobia } from "../index"

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
				SearchGhost(interaction.options.getString("fantasma"), interaction)
				break
		}

	},
	async autocomplete(interaction: AutocompleteInteraction) {

		const subcommand = interaction.options.getSubcommand(false)

		if (subcommand === "ghost") {



			const name = interaction.options.getFocused()

			const GhostsList = JSON.parse(await readFile("Resources/phasmo_ghosts.json", { encoding: "utf8" })) as Phasmophobia.Ghosts
			return await interaction.respond(GhostsList.filter(ghost => ghost.name.toLowerCase().includes(name)).map(ghost => ({ name: ghost.name, value: ghost.id })))
		}
	}
}