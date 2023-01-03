"use strict";
const discord_js_1 = require("discord.js");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Ve el avatar tuyo o de otro usuario')
        .addUserOption(user => user.setName('user').setDescription('El usuario del cual quieres obtener el avatar').setRequired(false)),
    isGlobal: false,
    async execute(interaction) {
        // Your code...
        // Esta interacción puede ser usada en cualquier contexto (DM, Guild)
        const user = interaction.options.getUser('user', false) ?? interaction.user;
        await user.fetch();
        return await interaction.reply({
            ephemeral: true,
            embeds: [new discord_js_1.EmbedBuilder()
                    .setColor(discord_js_1.Colors.Blue)
                    .setTitle(`Avatar de ${user.tag}`)
                    .setImage(user.displayAvatarURL({ size: 512 }))
            ]
        });
    }
};
