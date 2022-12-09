"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const keyv_1 = __importDefault(require("keyv"));
const lastPresence = new keyv_1.default("sqlite://presence.sqlite", { namespace: 'presence' });
const discord_js_1 = require("discord.js");
module.exports = class SetActivityCommand extends discord_akairo_1.Command {
    constructor() {
        super('activity', {
            aliases: ['activity', 'setactivity'],
            description: 'Comando para cambiarle el nombre de la actividad al bot',
            ownerOnly: true,
            args: [
                { type: "string", id: "type" },
                { type: "string", id: "activity" },
            ],
            editable: true
        });
    }
    async exec(message, { type, activity }) {
        if (!type || !activity)
            return await message.reply(`Faltaron argumentos para usar este comando: Tipo: ${type} - Actividad: ${activity}`);
        this.client.user.setActivity({
            name: activity,
            type: discord_js_1.ActivityType[type]
        });
        await lastPresence.set('0', { name: activity, type: discord_js_1.ActivityType[type] });
        return await message.reply({ content: `La actividad **${type} ${activity}** se ha guardado con éxito.` });
    }
};
