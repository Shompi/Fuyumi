"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
const keyv_1 = __importDefault(require("keyv"));
const dbpaths_json_1 = require("../../Configs/dbpaths.json");
const lastpresence = new keyv_1.default(dbpaths_json_1.databases.last_presence, { namespace: 'presence' });
module.exports = class HostCommand extends discord_akairo_1.Command {
    constructor() {
        super('host', {
            aliases: ['host'],
            ownerOnly: true,
            args: [{
                    id: 'targetId',
                    type: "string",
                }]
        });
    }
    async exec(message, { targetId }) {
        if (!targetId) {
            return await message.channel.send({ content: 'Te faltó un argumento: `targetId`.' });
        }
        const target = await message.guild.members.fetch(targetId);
        const userActivity = target.presence.activities.find(activity => activity.type === discord_js_1.ActivityType.Streaming);
        if (!userActivity)
            return await message.channel.send({ content: 'No encontre la actividad siendo transmitida por el usuario.' });
        this.client.user.setActivity({ name: userActivity.name, type: discord_js_1.ActivityType.Streaming, url: userActivity.url });
        await lastpresence.set('0', { name: userActivity.name, type: discord_js_1.ActivityType.Streaming, url: userActivity.url });
        return;
    }
};
//# sourceMappingURL=host.js.map