"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const node_fs_1 = __importDefault(require("node:fs"));
class CommandUsed extends discord_akairo_1.Listener {
    constructor() {
        super('commandReload', {
            emitter: 'client',
            event: 'commandReload'
        });
    }
    async exec({ commandName, channelId, client }) {
        const slashCommandsFiles = node_fs_1.default.readdirSync('./InteractionCommands').filter(file => file.endsWith('.ts'));
        const LogChannel = client.channels.cache.get(channelId);
        for (const filename of slashCommandsFiles) {
            // Leer el archivo para poder encontrar el comando por su nombre
            const command = await Promise.resolve().then(() => __importStar(require(`../../InteractionCommands/${filename}`)));
            if (command.data.name === commandName) {
                // Borramos el comando de la colección
                client.commands.delete(commandName);
                const reloadedCommand = await Promise.resolve().then(() => __importStar(require(`../../InteractionCommands/${filename}`)));
                // Agregamos el comando a la colección de comandos
                client.commands.set(command.data.name, reloadedCommand);
                return LogChannel.send({ content: `El comando ${commandName} ha sido reiniciado!` });
            }
        }
        return LogChannel.send({ content: 'No se encontró ningún comando con ese nombre.' });
    }
}
module.exports = CommandUsed;
