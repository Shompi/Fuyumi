"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
module.exports = class ReloadCommand extends discord_akairo_1.Command {
    constructor() {
        super('reload', {
            aliases: ['reload', 'reloadcmd'],
            ownerOnly: true,
            args: [{
                    id: 'comando',
                    type: "string",
                }]
        });
    }
    async exec(message, { comando }) {
        if (comando === 'all') {
            message.client.commandHandler.reloadAll();
            return await message.channel.send({ content: 'Se han recargado los comandos de mensajes.' });
        }
        else {
            message.client.emit("commandReload", { commandName: comando, channelId: message.channel.id });
            return;
        }
    }
};
//# sourceMappingURL=reloadCommand.js.map