"use strict";
const discord_js_1 = require("discord.js");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('invite')
        .setDescription('Mi enlace de invitación para que me añadas a tu servidor!'),
    isGlobal: true,
    async execute(interaction) {
        const invite = interaction.client.generateInvite({
            scopes: [discord_js_1.OAuth2Scopes.Bot, discord_js_1.OAuth2Scopes.ApplicationsCommands],
            permissions: ["AddReactions", "EmbedLinks", "ModerateMembers", "KickMembers", "BanMembers",
                "AttachFiles", "ManageChannels", "ManageRoles", "MuteMembers", "ViewChannel", "SendMessages", "SendMessagesInThreads",
                "ManageMessages", "UseExternalStickers", "UseExternalEmojis", "ReadMessageHistory", "ManageGuild", "ManageEmojisAndStickers"]
        });
        const inviteEmbed = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: interaction.client.user.tag, iconURL: interaction.client.user.displayAvatarURL({ size: 128 }) })
            .setDescription(`[-> **¡Aqui tienes mi enlace de invitación!** <-](${invite})`)
            .setColor(discord_js_1.Colors.Blue);
        return await interaction.reply({ embeds: [inviteEmbed] });
    }
};
