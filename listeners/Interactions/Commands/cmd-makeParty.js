// @ts-check

const { CommandInteraction, MessageEmbed, User, Collection, MessageButton, MessageActionRow, GuildMember } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

/**@type {Collection<string, {t_expires: number, user:User}>} */
const timeouts = new Collection();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('party')
    .setDefaultPermission(true)
    .setDescription('Inicia una busqueda de grupo para que los miembros puedan unirse')
    .addIntegerOption(input => {
      return input.setName('faltan')
        .setDescription('Cantidad de jugadores que faltan para que el grupo esté completo, sin contarte a tí')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(32)
    })
    .addStringOption(input => {
      return input.setName("mensaje")
        .setDescription('Tu mensaje para crear este grupo')
        .setRequired(false);
    })
    .addRoleOption(role => {
      return role.setName('mencionar')
        .setDescription('Role que quieres mencionar en esta interacción')
        .setRequired(false);
    })
    .addIntegerOption(waitTime => {
      return waitTime.setName('esperar')
        .setDescription('Tiempo de espera para que el grupo se complete, en minutos.')
        .addChoices([
          ["8 Minutos", 8],
          ["10 Minutos", 10],
          ["15 Minutos", 14] // 14 por restricciones de discord
        ])
    }),

  isGlobal: true,

  /**
  * @param {CommandInteraction} interaction
  */
  async execute(interaction) {

    if (timeouts.has(interaction.user.id)) {
      return await interaction.reply({
        ephemeral: true,
        content: `Debes esperar ${Math.round((timeouts.get(interaction.user.id).t_expires - Date.now()) / 1000)} segundos más.`
      });
    }

    if (interaction.inGuild() && interaction.member instanceof GuildMember) {

      timeouts.set(interaction.user.id, { t_expires: Date.now() + (1000 * 60 * 5), user: interaction.user });
      setTimeout(() => timeouts.delete(interaction.user.id), 1000 * 60 * 5);

      await interaction.deferReply({ ephemeral: true });

      /** @type {Collection<string, User>} */
      const partyMembers = new Collection();

      let spotsLeft = interaction.options.getInteger('faltan', true);

      // partyMembers.set(interaction.user.id, interaction.user);

      const lfgMessage = interaction.options.getString('mensaje', false);

      let lfgCanceled = false;


      const partyEmbed = new MessageEmbed()
        .setTitle(`¡${interaction.member.user.tag} está buscando compañeros de grupo!`)
        .setThumbnail(interaction.user.displayAvatarURL({ size: 512, dynamic: true }))
        .setDescription(`**Grupo:**\n${partyMembers.map(user => `<@${user.id}>`).join("\n")}`)
        .setFooter({ text: `¡Se necesitan ${spotsLeft} jugadores más!` })
        .setColor(interaction.member.displayColor);

      const actionRow = createActionRow();

      const partyMessage = await interaction.channel.send({ content: lfgMessage, embeds: [partyEmbed], components: [actionRow] }).catch(err => console.log(err));

      if (!partyMessage)
        return await interaction.editReply({ content: "Ocurrió un error al intentar enviar el mensaje, verifica que yo tenga permisos para enviar mensajes en este canal." });


      const waitTime = interaction.options.getInteger('esperar') ?? 5;
      const componentCollector = partyMessage.createMessageComponentCollector({ time: waitTime * 1000 * 60 });

      componentCollector.on('collect', async (buttonInteraction) => {

        if (buttonInteraction.isButton()) {

          switch (buttonInteraction.customId) {

            case 'party-join':
              if (buttonInteraction.user.id === interaction.user.id)
                return await buttonInteraction.reply({ content: 'No puedes unirte a tu propio grupo.', ephemeral: true });

              if (partyMembers.has(buttonInteraction.user.id)) {
                return await buttonInteraction.reply({ ephemeral: true, content: "Ya estás en el grupo." });

              } else {
                // Agregar al usuario a la party
                partyMembers.set(buttonInteraction.user.id, buttonInteraction.user);
                spotsLeft = spotsLeft - 1;
                await buttonInteraction.reply({ ephemeral: true, content: "¡Has sido agregado a la party!" });
              }
              break;

            case 'party-leave':
              if (buttonInteraction.user.id === interaction.user.id)
                return await buttonInteraction.reply({ content: 'No puedes abandonar a tu propio grupo.', ephemeral: true });

              if (partyMembers.delete(buttonInteraction.user.id)) {
                spotsLeft = spotsLeft + 1;
                await buttonInteraction.reply({ ephemeral: true, content: "Has abandonado el grupo." });
              } else {
                return await buttonInteraction.reply({ ephemeral: true, content: "No estás en el grupo." });
              }
              break;

            case 'party-cancel':

              // Si el que presiona el botón es el mismo que inició la búsqueda de grupo
              if (buttonInteraction.user.id === interaction.user.id) {
                lfgCanceled = true;
                return componentCollector.stop();
              } else {
                return await buttonInteraction.reply({ ephemeral: true, content: 'No puedes cancelar esta interacción.' });
              }
          }
        }

        if (spotsLeft === 0) {
          componentCollector.stop();
        } else {

          // update embed
          const newEmbed = new MessageEmbed(partyEmbed)
            .setDescription(`**Grupo:**\n${partyMembers.map((user) => `<@${user.id}>`).join("\n")}`)
            .setFooter({ text: `¡Se necesitan ${spotsLeft} jugadores más!` });

          await partyMessage.edit({ embeds: [newEmbed] });
        }
      })
        // End
        .on('end', async () => {

          if (lfgCanceled) {
            const partyCanceled = new MessageEmbed()
              .setColor('RED')
              .setTitle(`${interaction.user.tag} ha cancelado la búsqueda de grupo.`);

            await interaction.editReply({ content: 'La interacción ha sido cancelada.' });
            await partyMessage.edit({ embeds: [partyCanceled], components: [] });
            return undefined;
          }

          try {
            if (spotsLeft > 0) {

              const partyFail = new MessageEmbed(partyEmbed)
                .setTitle('El grupo no se ha completado en el tiempo dado.')
                .setDescription(`${partyMembers.map(user => `<@${user.id}>`).join("\n")}\n**Faltaron**: ${spotsLeft} jugador/es más.`)
                .setColor('RED')
                .setFooter({ text: "" });

              await partyMessage.edit({
                embeds: [partyFail], components: []
              });

              await interaction.editReply({
                content: 'El grupo no se completó en el tiempo dado.'
              });

            } else {

              const partySuccessful = new MessageEmbed(partyEmbed)
                .setTitle(`¡El grupo se ha completado!`)
                .setDescription(`${interaction.user}\n${partyMembers.map(user => `${user}`).join("\n")}`)
                .setColor('GREEN')
                .setFooter({ text: "" });

              await partyMessage.edit({
                embeds: [partySuccessful], components: []
              });

              await partyMessage.reply({
                content: `¡${partyMembers.map(user => `${user}`).join(", ")} su grupo está completo!`
              });

              await interaction.editReply({ content: "El grupo se ha completado con éxito, puedes quitar este mensaje." });
            }
          } catch (error) {
            console.log(error);
            await interaction.editReply({ content: 'ocurrió un error con la interacción.' });
          }
        });

    } else {
      await interaction.reply({ content: "Esta interacción no puede ser usada en mensajes privados." });
    }
  }
}

function createActionRow() {

  const JoinButton = new MessageButton()
    .setCustomId('party-join')
    .setLabel('Unirse')
    .setStyle('PRIMARY')

  const LeaveButton = new MessageButton()
    .setCustomId('party-leave')
    .setLabel('Abandonar')
    .setStyle('SECONDARY')

  const CancelButton = new MessageButton()
    .setCustomId('party-cancel')
    .setLabel('Cancelar')
    .setStyle('DANGER')

  return new MessageActionRow().addComponents([JoinButton, LeaveButton, CancelButton]);
}