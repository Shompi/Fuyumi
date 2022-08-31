"use strict";
const discord_js_1 = require("discord.js");
module.exports = {
    data: new discord_js_1.ContextMenuCommandBuilder()
        .setName('Avatar')
        .setType(discord_js_1.ApplicationCommandType.User),
    isGlobal: true,
    async execute(interaction) {
        const target = interaction.targetId;
        const targetUser = await interaction.client.users.fetch(target);
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`Avatar de ${targetUser.tag}`)
            .setImage(targetUser.displayAvatarURL({ size: 2048 }))
            .setColor(interaction.inCachedGuild() ? interaction.member.displayColor : discord_js_1.Colors.Blue);
        return await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};
