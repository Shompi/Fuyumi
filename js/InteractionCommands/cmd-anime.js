"use strict";
const discord_js_1 = require("discord.js");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('anime')
        .setDescription('Comandos de anime, powered by Tio Anime')
        .addSubcommand(buscar => buscar.setName('buscar')
        .setDescription('Busca un animé')
        .addStringOption(nombre => nombre.setName('nombre')
        .setRequired(true)
        .setDescription('Nombre del anime que quieres buscar, puede estar incompleto'))),
    isGlobal: false,
    async execute(i) {
        await i.reply({
            content: 'This command is not implemented yet.',
            ephemeral: true
        });
        return;
    }
};
