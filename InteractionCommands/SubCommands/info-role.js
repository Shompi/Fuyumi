"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleInfo = void 0;
//@ts-check
const discord_js_1 = require("discord.js");
const formatDate_1 = require("../Helpers/formatDate");
const RoleInfo = async (interaction) => {
    if (interaction.inCachedGuild()) {
        const role = interaction.options.getRole('rol');
        const roleAttr = {
            kick: role.permissions.has("KickMembers") ? "Si" : "No",
            ban: role.permissions.has("BanMembers") ? "Si" : "No",
            moderate: role.permissions.has("ModerateMembers") ? "Si" : "No",
            admin: role.permissions.has("Administrator") ? "Si" : "No",
            mentionable: role.mentionable ? "Si" : "No",
            editable: role.editable ? "Si" : "No"
        };
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`Rol: ${role.name} (${role.id})`)
            .setDescription(`**N° de miembros con este rol**: ${role.members.size}\n**Color (hex)**: ${role.hexColor}\n**Rol creado**: ${(0, formatDate_1.FormatDate)(role.createdAt)}\n**Icono**: ${role.icon ?? "No tiene"}\n\n**__Permisos__:**\n**Kick**: ${roleAttr.kick}\n**Ban**: ${roleAttr.ban}\n**Moderar**: ${roleAttr.moderate}\n**Es rol de Admin**: ${roleAttr.admin}\n**Mencionable**: ${roleAttr.mentionable}\n**Es editable por mi**: ${roleAttr.editable}`)
            .setColor(role.color)
            .setThumbnail(role.iconURL({ size: 256 }));
        return await interaction.reply({ embeds: [embed] });
    }
};
exports.RoleInfo = RoleInfo;
//# sourceMappingURL=info-role.js.map