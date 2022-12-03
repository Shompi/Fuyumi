"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeVoiceRegion = void 0;
//@ts-check
const discord_js_1 = require("discord.js");
const ChangeVoiceRegion = async (interaction) => {
    // This command must be issued on a guild
    // This command must be issued by someone on a voice channel
    if (!interaction.inCachedGuild())
        return;
    // We dont need to check for the member permissions since we do that in the main file
    // First check: if the member that issued the command is on a voice channel
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel)
        return await interaction.reply({
            content: "Debes estar dentro de un canal de voz para usar este comando.",
            ephemeral: true
        });
    const inputRegion = interaction.options.getString('region', false);
    try {
        if (!inputRegion || inputRegion === 'auto')
            await voiceChannel.setRTCRegion(null);
        else
            await voiceChannel.setRTCRegion(inputRegion);
    }
    catch (e) {
        console.error(e);
        return await interaction.reply({
            content: 'Ocurrió un error al intentar cambiar la región del canal de voz.',
            ephemeral: true
        });
    }
    return await interaction.reply({
        embeds: [new discord_js_1.EmbedBuilder().setColor(discord_js_1.Colors.Blue).setDescription(`Se ha cambiado la region de voz del canal **${voiceChannel.name}** a **${inputRegion}**`)]
    });
};
exports.ChangeVoiceRegion = ChangeVoiceRegion;
//# sourceMappingURL=mod-voiceRegion.js.map