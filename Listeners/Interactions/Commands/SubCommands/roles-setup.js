"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesSetup = void 0;
const discord_js_1 = require("discord.js");
const Keyv = require("keyv");
const dbpaths_json_1 = __importDefault(require("../../../../Configs/dbpaths.json"));
const GUILDAUTOROLES = new Keyv(dbpaths_json_1.default.databases.guild_auto_roles);
const RolesSetup = async (interaction) => {
    const { channel, guild, user: { id: userId } } = interaction;
    // Step 1: The presentation
    await interaction.reply({ content: 'Bienvenido a la configuración de los roles automaticos.\nAquí podrás configurar los roles que los miembros de este servidor podran añadirse de forma automática usando el comando **/roles obtener.**\n\nPor favor, menciona los roles que quieres agregar a la lista, **máximo 25**: `@Mencion del Rol` (El comando expirará luego de un minuto)' });
    // Step 2: Wait for the mentions
    const messageWithMentions = await channel.awaitMessages({
        filter: (message) => message.author.id === userId,
        time: 60000,
        max: 1
    }).then(messages => messages.first()).catch(() => interaction.editReply({ content: 'La interacción ha expirado.' }));
    // Step 3: Check if the message contains any mentioned roles or if there is a message at all
    if (!messageWithMentions || messageWithMentions.mentions.roles.size === 0)
        return await interaction.followUp({ content: 'No se recibió un mensaje o no se encontraron menciones validas de al menos un rol en el mensaje. El comando se ha cancelado.' });
    const { roles: mentionedRoles } = messageWithMentions.mentions;
    const rolesAboveBot = mentionedRoles.filter(role => role.position >= interaction.guild.members.me.roles.highest.position);
    const rolesFromDb = await GUILDAUTOROLES.get(guild.id) ?? [];
    // TODO: filter roles to remove duplicates
    for (const [id, role] of mentionedRoles) {
        if (rolesFromDb.includes(id))
            continue;
        rolesFromDb.push(id);
    }
    // inform the user about roles that are above the bot's highest role
    let description;
    const infoEmbed = new discord_js_1.EmbedBuilder()
        .setTitle('¡Se han actualizado los auto roles!')
        .setColor("Blue");
    if (rolesAboveBot.size > 0) {
        description += "Atención, **no podré asignar los siguientes roles** ya que están en una **posición igual o más alta** que mi rol:\n";
        description += rolesAboveBot.map(role => role.name).join(", ");
        description += "\n\nMi rol con permisos de asignar roles debe estar más arriba de los roles que debo asignar.";
        infoEmbed.setDescription(description);
    }
    // Filter out roles that no longer exist
    const finalRoles = rolesFromDb.filter(roleId => guild.roles.cache.has(roleId));
    // Update roles in the database
    await GUILDAUTOROLES.set(guild.id, finalRoles);
    return await interaction.followUp({ embeds: [infoEmbed] });
};
exports.RolesSetup = RolesSetup;
