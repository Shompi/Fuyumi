"use strict";
const discord_js_1 = require("discord.js");
const info_server_1 = require("./SubCommands/info-server");
const info_user_1 = require("./SubCommands/info-user");
const info_role_1 = require("./SubCommands/info-role");
module.exports = {
    hasSubcommands: true,
    subcommands: ["info-server.js", "info-user.js", "info-role.js"],
    data: new discord_js_1.SlashCommandBuilder()
        .setName('info')
        .setDescription('Comandos de información general')
        .addSubcommand(guildInfo => {
        return guildInfo.setName('server')
            .setDescription('Información del servidor');
    })
        .addSubcommand(subcommand => {
        return subcommand.setName('user')
            .setDescription('Info de un usuario dentro de este servidor')
            .addUserOption(user => {
            return user.setName('usuario')
                .setDescription('El usuario del que quieres ver la info, default: Tú')
                .setRequired(false);
        })
            .addStringOption(id => {
            return id.setName('id')
                .setDescription('La id del usuario de Discord')
                .setRequired(false);
        });
    })
        .addSubcommand(roleInfo => {
        return roleInfo.setName('role')
            .setDescription('Información acerca de un rol de este servidor')
            .addRoleOption(role => {
            return role.setName('rol')
                .setDescription('El rol que quieres ver')
                .setRequired(true);
        });
    }),
    isGlobal: true,
    async execute(interaction) {
        const commandName = interaction.options.getSubcommand();
        switch (commandName) {
            case 'server':
                (0, info_server_1.ServerInfo)(interaction);
                break;
            case 'user':
                (0, info_user_1.UserInfo)(interaction);
                break;
            case 'role':
                (0, info_role_1.RoleInfo)(interaction);
                break;
        }
    }
};
