import { Listener } from "discord-akairo"
import { EmbedBuilder, GuildMember } from "discord.js"

export class GuildMemberRemoveListener extends Listener {
  constructor() {
    super('guildMemberRemove', {
      emitter: 'client',
      event: 'guildMemberRemove'
    })
  }

  async exec(member: GuildMember) {
    const { id, client } = member;

    const userInformation = await client.users.fetch(id);

    const embed = new EmbedBuilder()
      .setDescription(`El usuario ${userInformation.tag} (${id})\nHa abandonado el servidor.`)
      .setColor("Random")
      .setThumbnail(userInformation.displayAvatarURL({ size: 256 }))
      .setTimestamp()

    client.privateChannel?.send({
      embeds: [embed]
    })
  }
}
