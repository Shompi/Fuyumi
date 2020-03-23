const { Message, MessageEmbed } = require('discord.js');
const path = require('path');

const clean = text => {
  if (typeof (text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;
}

module.exports = {
  name: "eval",
  description: "Evalúa código javascript.",
  aliases: ["ev"],
  filename: path.basename(__filename),
  usage: "eval [codigo a evaluar]",
  nsfw: false,
  enabled: true,
  permissions: [],

  async execute(message = new Message(), args = new Array()) {
    const { channel, client: Muki, author } = message;

    if (author.id !== Muki.OWNER) return;


    try {
      const code = args.join(" ");
      let evaled = await eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      return channel.send(clean(evaled), { code: "js" });
    } catch (err) {
      return channel.send(err, { code: 'js' });
    }

  }
}