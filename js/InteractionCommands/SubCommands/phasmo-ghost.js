"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const promises_1 = require("node:fs/promises");
async function SearchGhost(id, interaction) {
    const GhostsList = JSON.parse(await (0, promises_1.readFile)("Resources/phasmo_ghosts.json", { encoding: "utf8" }));
    const ghost = GhostsList.find(ghost => ghost.id === id);
    if (!ghost)
        return await interaction.reply("No encontré a ningún fantasma con ese nombre.");
    const description = `${ghost.about}\n\n` +
        `**Evidencias**: ${ghost.evidences.join(", ")}\n` +
        `**Mínimo de cordura para iniciar un ataque**: ${ghost.hunt ?? "50"}%`;
    return await interaction.reply({
        embeds: [
            new discord_js_1.EmbedBuilder()
                .setTitle(ghost.name)
                .setDescription(description)
                .setColor(discord_js_1.Colors.Blue)
        ]
    });
}
exports.default = SearchGhost;
