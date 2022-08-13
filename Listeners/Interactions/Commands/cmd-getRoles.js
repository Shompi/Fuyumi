"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const discord_js_1 = require("discord.js");
const Keyv = require("keyv");
const dbpaths_json_1 = __importDefault(require("../../../Configs/dbpaths.json"));
const roles_assign_1 = require("./SubCommands/roles-assign");
const roles_remove_1 = require("./SubCommands/roles-remove");
const roles_setup_1 = require("./SubCommands/roles-setup");
const GUILDAUTOROLES = new Keyv(dbpaths_json_1.default.databases.guild_auto_roles);
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("roles")
        .setDMPermission(false)
        .setDescription('Multiples comandos para roles')
        .addSubcommand(asignarme => {
        return asignarme.setName('asignarme')
            .setDescription('Asignate los roles disponibles desde un Menú de selección multiple');
    })
        .addSubcommand(quitarme => {
        return quitarme.setName('quitarme')
            .setDescription('Te quita los roles que selecciones, en caso de que los tengas');
    })
        .addSubcommand(setup => {
        return setup.setName('setup')
            .setDescription('Configura los roles que los miembros se puede añadir, hasta 25 roles');
    }),
    async execute(interaction) {
        if (!interaction.inCachedGuild())
            return await interaction.reply({ content: 'No se supone que puedas usar este comando fuera de un servidor... 👀' });
        const subCommand = interaction.options.getSubcommand(false);
        if (["asignarme", "quitarme"].includes(subCommand) && !(await (GUILDAUTOROLES.has(interaction.guild.id)))) {
            return await interaction.reply({
                ephemeral: true,
                content: 'Este servidor no tiene configurados los roles auto asignables.\nSi eres administrador de este servidor, utiliza el comando **/roles setup** para configurar los roles.'
            });
        }
        switch (subCommand) {
            case 'setup':
                if (!interaction.member.permissions.has(["Administrator", "ManageRoles"]))
                    return await interaction.reply({
                        ephemeral: true,
                        content: 'Solo miembros de este servidor con el permiso **Administrador** o **Gestionar Roles** pueden utilizar este comando.'
                    });
                await (0, roles_setup_1.RolesSetup)(interaction);
                break;
            case 'asignarme':
                await (0, roles_assign_1.RolesAssign)(interaction);
                break;
            case 'quitarme':
                await (0, roles_remove_1.RolesRemove)(interaction);
                break;
        }
    }
};
