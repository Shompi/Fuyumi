import { ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";
import { readFile } from "node:fs/promises";
import { Phasmophobia } from "@myTypes/index";

export async function SearchGhost(id: string, interaction: ChatInputCommandInteraction) {

	const GhostsList = JSON.parse(await readFile("Resources/phasmo_ghosts.json", { encoding: "utf8" })) as Phasmophobia.Ghost[]

	const ghost = GhostsList.find(ghost => ghost.id === id);

	if (!ghost)
		return await interaction.reply("No encontré a ningún fantasma con ese nombre.");

	const description =
		`${ghost.about}\n\n` +
		`**Evidencias**: ${ghost.evidences.join(", ")}\n` +
		`**Mínimo de cordura para iniciar un ataque**: ${ghost.hunt ?? "50"}%`;

	return await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setTitle(ghost.name)
				.setDescription(description)
				.setColor(Colors.Blue)
		]
	})
}