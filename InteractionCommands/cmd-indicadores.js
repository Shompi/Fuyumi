"use strict";
const discord_js_1 = require("discord.js");
const undici_1 = require("undici");
const monedaCLP = "CLP";
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('indicadores')
        .setDescription('Muestra información de distintas monedas convertidas a CLP'),
    isGlobal: true,
    async execute(interaction) {
        // Your code...
        const info = await (0, undici_1.request)("https://mindicador.cl/api").then(response => response.body.json()).catch(err => console.error(err));
        if (!info) {
            return await interaction.reply("Ha ocurrido un error con este comando...");
        }
        const { dolar, euro, bitcoin } = info;
        const embed = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: 'Indicadores de hoy', iconURL: interaction.client.user.displayAvatarURL({ size: 64 }) })
            .setColor('Blue')
            .setDescription(`**${dolar.nombre}**\t -> \t${dolar.valor} ${monedaCLP}\n` +
            `**${euro.nombre}**\t -> \t${euro.valor} ${monedaCLP}\n` +
            `**${bitcoin.nombre}\***\t -> \t${bitcoin.valor} USD`)
            .setTimestamp()
            .setFooter({ text: "* Estos valores podrian tener un desfase de hasta 2 dias." });
        return await interaction.reply({ embeds: [embed] });
    }
};
//# sourceMappingURL=cmd-indicadores.js.map