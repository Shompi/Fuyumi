import { ChatInputCommandInteraction, ChannelType, SlashCommandBuilder, TextChannel } from "discord.js";
import { setStreamChannel, setEnabled, setStreamerRole } from "./SubCommands/streams";

import Keyv from 'keyv';

type P = Keyv<{ channelId: string | null, roleId: string | null, enabled: boolean }>

const StreamsConfigPerGuild: P = new Keyv('sqlite://StreamsConfigs.sqlite', { namespace: 'streamsConfig' });


export = {
  data: new SlashCommandBuilder()
    .setName('streams')
    .setDMPermission(false)
    .setDescription('Configuraciones para transmisiones en el servidor')
    .addSubcommand(setChannelCommand => {
      return setChannelCommand.setName('canal')
        .setDescription('Configura el canal para enviar las transmisiones')
        .addChannelOption(channel => {
          return channel.setName('canal')
            .setDescription('Canal de texto en el que quieres que las transmisiones se envien')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText);
        })
    })
    .addSubcommand(toggleCommand => {
      return toggleCommand.setName('habilitar')
        .setDescription('Activar o desactivar los mensajes de streams.')
        .addBooleanOption(input => {
          return input.setName('value')
            .setDescription('Verdadero para activar, Falso para desactivar')
            .setRequired(true);
        })
    })
    .addSubcommand(streamerRoleCommand => {
      return streamerRoleCommand.setName('rol')
        .setDescription('Rol de streamer de este servidor')
        .addRoleOption(role => {
          return role.setName('rol')
            .setDescription('Rol de streamer de este servidor')
            .setRequired(true)
        })
    }),
  isGlobal: true,

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild())
      return await interaction.reply({ content: 'Este comando solo puede ser utilizado en un servidor.' });

    if (interaction.member.partial)
      await interaction.member.fetch();

    if (!interaction.member.permissions.has('Administrator')) {
      return await interaction.reply({
        content: "Solo miembros con el permiso de `Administrador` pueden usar este comando.",
        ephemeral: true
      });
    }

    let configs = await StreamsConfigPerGuild.get(interaction.guildId) ?? ({ channelId: null, roleId: null, enabled: false });

    const commandName = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel('canal', false) as TextChannel;

    switch (commandName) {
      case 'canal':
        return await setStreamChannel({ interaction, channel, configs });


      case 'habilitar':

        const enabled = interaction.options.getBoolean('value', true);

        return await setEnabled({ interaction, enabled, configs });

      case 'rol':

        const role = interaction.options.getRole('rol', true);

        return await setStreamerRole({ interaction, role, configs });
    }
  }
}