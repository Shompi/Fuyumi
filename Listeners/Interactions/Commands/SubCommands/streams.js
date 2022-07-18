//@ts-check
const { ChatInputCommandInteraction, TextChannel, Role } = require('discord.js');
const Keyv = require('keyv');

/**
 * @type {Keyv<{channelId: string?, roleId: string?, enabled: Boolean}>}
 */
const StreamsConfigPerGuild = new Keyv('sqlite://StreamsConfigs.sqlite', { namespace: 'streamsConfig' });


/**
 * @param {{ interaction: ChatInputCommandInteraction<'cached'>, channel: TextChannel, configs: {channelId: string?, roleId: string?, enabled: Boolean}}}
 */
module.exports.setStreamChannel = async ({ interaction, channel, configs }) => {


  if (!channel.permissionsFor(interaction.guild.members.me).has("SendMessages"))
    return await interaction.reply({ content: 'No tengo permisos para enviar mensajes en ese canal, asegúrate de darme los permisos correspondientes antes de asignar un canal para las transmisiones.', ephemeral: true });

  configs.channelId = channel.id;
  await StreamsConfigPerGuild.set(interaction.guildId, configs);

  return await interaction.reply({ content: `El canal ${channel} ha sido asignado como el nuevo canal para enviar las transmisiones en vivo! (Twitch, Youtube, Go Live)\nUna vez que configures el canal y el rol de streamer usa el comando \`/streams habilitar\`` });
}

/**
 * 
 * @param {{interaction:ChatInputCommandInteraction<'cached'>, role: Role, configs: {channelId: string?, roleId: string?, enabled: Boolean}}} param0 
 */
module.exports.setStreamerRole = async ({ interaction, role, configs }) => {
  configs.roleId = role.id;

  await StreamsConfigPerGuild.set(interaction.guildId, configs);

  return await interaction.reply({ content: `El rol ${role} ha sido asignado como el rol de Streamer en este servidor. Se enviarán automáticamente las transmisiones de los miembros que tengan este rol.`, ephemeral: true });
}

/**
 * 
 * @param {{interaction:ChatInputCommandInteraction<'cached'>, enabled: Boolean, configs: {channelId: string?, roleId: string?, enabled: Boolean}}} param0 
 */
module.exports.setEnabled = async ({ interaction, enabled, configs }) => {
  if (enabled) {
    if (!configs.channelId)
      return await interaction.reply({ content: 'Antes de habilitar los mensajes de streams debes configurar un canal de texto, usa el comando `/streams canal`', ephemeral: true });

    if (!configs.roleId)
      return await interaction.reply({ content: 'Antes de habilitar los mensajes de streams debes configurar un rol de streamer, usa el comando `/streams rol`', ephemeral: true });

    configs.enabled = enabled;
    await StreamsConfigPerGuild.set(interaction.guildId, configs);

    return await interaction.reply({ content: `¡Los mensajes de streams están activados!\nEstos serán enviados en el canal <#${configs.channelId}>` });
  } else {
    configs.enabled = enabled;

    await StreamsConfigPerGuild.set(interaction.guildId, configs);
    return interaction.reply({ content: 'Los mensajes de streams han sido desactivados.', ephemeral: true });
  }
}