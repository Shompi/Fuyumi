"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const promises_1 = require("node:fs/promises");
const discord_js_1 = require("discord.js");
const phasmo_ghost_1 = __importDefault(require("./SubCommands/phasmo-ghost"));
module.exports = {
    hasSubcommands: false,
    data: new discord_js_1.SlashCommandBuilder()
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
                .setRequired(true);
        });
    }),
    isGlobal: true,
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case "ghost":
                (0, phasmo_ghost_1.default)(interaction.options.getString("fantasma"), interaction);
                break;
        }
    },
    async autocomplete(interaction) {
        const subcommand = interaction.options.getSubcommand(false);
        if (subcommand === "ghost") {
            const name = interaction.options.getFocused();
            const GhostsList = JSON.parse(await (0, promises_1.readFile)("Resources/phasmo_ghosts.json", { encoding: "utf8" }));
            return await interaction.respond(GhostsList.filter(ghost => ghost.name.toLowerCase().includes(name)).map(ghost => ({ name: ghost.name, value: ghost.id })));
        }
    }
};
