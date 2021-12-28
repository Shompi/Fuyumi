const { CommandInteraction, MessageSelectMenu, MessageActionRow, Interaction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('enable')
    .setDescription('Autoriza a un rol / usuario a usar uno de mis comandos.')
    .addRoleOption(input => {
      return input.setName('rol')
        .setDescription('Rol que quieres autorizar para que use este comando.')
    })
    .addUserOption(input => {
      return input.setName('miembro')
        .setDescription('Miembro al que quieres autorizar para que use este comando.')
    }),
  isGlobal: false,
  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {

    if (!interaction.member.permissions.has('ADMINISTRATOR'))
      await interaction.reply({ content: 'No estás autorizado para usar este comando.' });


    const inputRole = interaction.options.getRole('rol') ?? null;
    const inputMember = interaction.options.getMember('miembro') ?? null;

    if (!inputRole && !inputMember)
      return await interaction.reply({ content: 'Debes seleccionar al menos un User o Rol para autorizar.' });

    await interaction.deferReply({ ephemeral: true });

    if (!interaction.client.application?.owner)
      await interaction.client.application?.fetch();



    const commands = await interaction.client.application.commands.fetch().then(commands => {
      return commands.map(command => {
        return {
          label: command.name,
          value: command.id,
          description: command.description
        }
      });
    }).catch((err) => console.log(err));

    if (!commands)
      return await interaction.editReply({ content: 'Ocurrió un error con esta interacción, por favor inténtalo más tarde.', ephemeral: true });



    const selectMenu = new MessageSelectMenu()
      .setCustomId('select-commands-enable')
      .setPlaceholder('Selecciona comandos...')
      .setMinValues(1)
      .setMaxValues(commands.length)
      .addOptions([...commands])

    const actionRow = new MessageActionRow().addComponents([selectMenu]);

    const selectMenuMessage = await interaction.channel.send({
      content: '¡Selecciona los comandos que quieres activar!\nPara cancelar este comando simplemente espera a que expire.',
      components: [actionRow]
    });
    /**
     * 
     * @param {Interaction} interaction 
     */


    const componentCollector = selectMenuMessage.createMessageComponentCollector({
      time: 15000 * 1000,
      componentType: 'SELECT_MENU',
    });


    componentCollector.on('collect', async (selectMenuInteraction) => {
      await interaction.reply({ content: `Collected ${interaction.values.join(", ")}` });
      const selectedOptions = interaction.values;

      const fullPermissions = [];

      for (const commandId of selectedOptions) {
        if (inputRole) {
          fullPermissions.push({
            id: commandId,
            permissions: [{
              type: 'ROLE',
              id: inputRole.id,
              permission: true
            }]
          });
        } else if (inputUser) {
          fullPermissions.push({
            id: commandId,
            permissions: [{
              type: 'USER',
              id: inputMember.id,
              permission: true,
            }]
          })
        }
      }
    });

    componentCollector.on('end', () => {
      interaction.editReply({
        content: 'La interacción ha finalizado con éxito.'
      });
    });
  }
}