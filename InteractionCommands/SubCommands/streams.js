"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEnabled = exports.setStreamerRole = exports.setStreamChannel = void 0;
const keyv_1 = __importDefault(require("keyv"));
const StreamsConfigPerGuild = new keyv_1.default('sqlite://StreamsConfigs.sqlite', { namespace: 'streamsConfig' });
const setStreamChannel = async ({ interaction, channel, configs }) => {
    if (!channel.permissionsFor(interaction.guild.members.me).has("SendMessages"))
        return await interaction.reply({ content: 'No tengo permisos para enviar mensajes en ese canal, asegúrate de darme los permisos correspondientes antes de asignar un canal para las transmisiones.', ephemeral: true });
    configs.channelId = channel.id;
    await StreamsConfigPerGuild.set(interaction.guildId, configs);
    return await interaction.reply({ content: `El canal ${channel} ha sido asignado como el nuevo canal para enviar las transmisiones en vivo! (Twitch, Youtube, Go Live)\nUna vez que configures el canal y el rol de streamer usa el comando \`/streams habilitar\`` });
};
exports.setStreamChannel = setStreamChannel;
const setStreamerRole = async ({ interaction, role, configs }) => {
    configs.roleId = role.id;
    await StreamsConfigPerGuild.set(interaction.guildId, configs);
    return await interaction.reply({ content: `El rol ${role} ha sido asignado como el rol de Streamer en este servidor. Se enviarán automáticamente las transmisiones de los miembros que tengan este rol.`, ephemeral: true });
};
exports.setStreamerRole = setStreamerRole;
const setEnabled = async ({ interaction, enabled, configs }) => {
    if (enabled) {
        if (!configs.channelId)
            return await interaction.reply({ content: 'Antes de habilitar los mensajes de streams debes configurar un canal de texto, usa el comando `/streams canal`', ephemeral: true });
        if (!configs.roleId)
            return await interaction.reply({ content: 'Antes de habilitar los mensajes de streams debes configurar un rol de streamer, usa el comando `/streams rol`', ephemeral: true });
        configs.enabled = enabled;
        await StreamsConfigPerGuild.set(interaction.guildId, configs);
        return await interaction.reply({ content: `¡Los mensajes de streams están activados!\nEstos serán enviados en el canal <#${configs.channelId}>` });
    }
    else {
        configs.enabled = enabled;
        await StreamsConfigPerGuild.set(interaction.guildId, configs);
        return interaction.reply({ content: 'Los mensajes de streams han sido desactivados.', ephemeral: true });
    }
};
exports.setEnabled = setEnabled;
//# sourceMappingURL=streams.js.map