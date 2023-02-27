import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { request } from "undici";

export default class EvalCommand extends Command {
  constructor() {
    super("ip", {
      aliases: ["ip"],
      ownerOnly: false,
    });
  }

  async exec(message: Message, { code }: { code: string }) {
    if (message.author.id !== "264035354019889154") return;

    if (!message.channel.isDMBased()) return;

    const ip = await request("https://api.ipify.org?format=json").then(
      (response) => response.body.json() as Promise<{ ip: string }>
    );

    return await message.reply(ip.ip);
  }
}
