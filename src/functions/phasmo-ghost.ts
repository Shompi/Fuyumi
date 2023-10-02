import { ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";
import GhostsList from "../resources/phasmo_ghosts.json" assert {type: 'json'}

export async function SearchGhost(id: string, interaction: ChatInputCommandInteraction) {


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