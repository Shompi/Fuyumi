//@ts-check
import { ChatInputCommandInteraction, TextChannel, Role } from 'discord.js';
import Keyv from 'keyv';

type P = Keyv<{ channelId: string | null, roleId: string | null, enabled: boolean }>

interface Configs {
  channelId: string | null;
  roleId: string | null;
  enabled: boolean
}
interface SetStreamChannelParams {
  interaction: ChatInputCommandInteraction;
  channel?: TextChannel;
  role?: Role;
  enabled?: boolean;
  configs: Configs;
}

const StreamsConfigPerGuild: P = new Keyv('sqlite://StreamsConfigs.sqlite', { namespace: 'streamsConfig' });

export const setStreamChannel = async ({ interaction, channel, configs }: SetStreamChannelParams) => {


  if (!channel.permissionsFor(interaction.guild.members.me).has("SendMessages"))
    return await interaction.reply({ content: 'No tengo permisos para enviar mensajes en ese canal, asegúrate de darme los permisos correspondientes antes de asignar un canal para las transmisiones.', ephemeral: true });

  configs.channelId = channel.id;
  await StreamsConfigPerGuild.set(interaction.guildId, configs);

  return await interaction.reply({ content: `El canal ${channel} ha sido asignado como el nuevo canal para enviar las transmisiones en vivo! (Twitch, Youtube, Go Live)\nUna vez que configures el canal y el rol de streamer usa el comando \`/streams habilitar\`` });
}


export const setStreamerRole = async ({ interaction, role, configs }: SetStreamChannelParams) => {
  configs.roleId = role.id;

  await StreamsConfigPerGuild.set(interaction.guildId, configs);

  return await interaction.reply({ content: `El rol ${role} ha sido asignado como el rol de Streamer en este servidor. Se enviarán automáticamente las transmisiones de los miembros que tengan este rol.`, ephemeral: true });
}

export const setEnabled = async ({ interaction, enabled, configs }: SetStreamChannelParams) => {
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