"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildMemberRemoveListener = void 0;
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
class GuildMemberRemoveListener extends discord_akairo_1.Listener {
    constructor() {
        super('guildMemberRemove', {
            emitter: 'client',
            event: 'guildMemberRemove'
        });
    }
    async exec(member) {
        const { id, client } = member;
        const userInformation = await client.users.fetch(id);
        const embed = new discord_js_1.EmbedBuilder()
            .setDescription(`El usuario ${userInformation.tag} (${id})\nHa abandonado el servidor.`)
            .setColor("Random")
            .setThumbnail(userInformation.displayAvatarURL({ size: 256 }))
            .setTimestamp();
        client.getPrivateChannel().send({
            embeds: [embed]
        });
    }
}
exports.GuildMemberRemoveListener = GuildMemberRemoveListener;
