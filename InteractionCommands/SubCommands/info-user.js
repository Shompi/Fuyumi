"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInfo = void 0;
//@ts-check
const discord_js_1 = require("discord.js");
const formatDate_1 = require("../Helpers/formatDate");
const UserInfo = async (interaction) => {
    const user = interaction.options.getMember('usuario') ?? interaction.options.getString('id', false) ?? interaction.user;
    if (user instanceof discord_js_1.GuildMember) {
        return await interaction.reply({
            embeds: [getMemberInfo(user)]
        });
    }
    else if (user instanceof discord_js_1.User) {
        const fetchedUser = await interaction.client.users.fetch(user.id, { force: true });
        return await interaction.reply({
            embeds: [getUserInfo(fetchedUser)]
        });
    }
    else if (typeof user === "string") {
        const fetchedUser = await interaction.client.users.fetch(user, { force: true });
        return await interaction.reply({
            embeds: [getUserInfo(fetchedUser)]
        });
    }
};
exports.UserInfo = UserInfo;
function getUserInfo(user) {
    return new discord_js_1.EmbedBuilder()
        .setTitle(user.tag)
        .setThumbnail(user.displayAvatarURL({ size: 512 }))
        .setDescription(`Creación de la cuenta: ${(0, formatDate_1.FormatDate)(user.createdAt)}\nColor personalizado: ${user.accentColor} (${user.hexAccentColor})\n¿Bot?: ${user.bot ? "Si" : "No"}`)
        .setColor(discord_js_1.Colors.Blue);
}
/**
 *
 * @param {GuildMember} member
 * @returns
 */
function getMemberInfo(member) {
    const joinedAt = (0, formatDate_1.FormatDate)(member.joinedAt);
    return new discord_js_1.EmbedBuilder()
        .setTitle(`Info de ${member.user.tag}`)
        .setDescription(`Nombre en el servidor: ${member.displayName}\nMiembro desde: ${joinedAt}\nRoles: ${member.roles.cache.size}\nRol más alto: <@&${member.roles.highest.id}>`)
        .setThumbnail(member.user.displayAvatarURL({ size: 512 }))
        .setColor(member.displayColor ?? discord_js_1.Colors.Blue)
        .setFooter({ text: isSomething(member) });
}
function isSomething(member) {
    if (member.id === member.guild.ownerId)
        return "Este miembro es dueño de este servidor";
    if (member.permissions.has("Administrator"))
        return "Este miembro es Administrador de este servidor";
    if (member.permissions.any(["KickMembers", "BanMembers", "ModerateMembers"]))
        return "Este miembro es Moderador de este servidor";
    return " ";
}
//# sourceMappingURL=info-user.js.map