// @ts-check
const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, User, Collection, ButtonBuilder, ActionRowBuilder, Colors, ButtonStyle } = require("discord.js");

/**@type {Collection<string, {t_expires: number, user:User}>} */
const timeouts = new Collection();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('party')
    .setDMPermission(false)
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
        .addChoices(
          { name: "8 Minutos", value: 8 },
          { name: "10 Minutos", value: 10 },
          { name: "15 Minutos", value: 14 }
        )
    }),

  isGlobal: true,

  /**
  * @param {ChatInputCommandInteraction} interaction
  */
  async execute(interaction) {

    if (timeouts.has(interaction.user.id)) {
      return await interaction.reply({
        ephemeral: true,
        content: `Debes esperar ${Math.round((timeouts.get(interaction.user.id).t_expires - Date.now()) / 1000)} segundos más antes de utilizar este comando de nuevo.`
      });
    }

    if (interaction.inCachedGuild()) {

      timeouts.set(interaction.user.id, { t_expires: Date.now() + (1000 * 60 * 5), user: interaction.user });
      setTimeout(() => timeouts.delete(interaction.user.id), 1000 * 60 * 5);

      await interaction.deferReply({ ephemeral: true });

      /** @type {Collection<string, User>} */
      const partyMembers = new Collection();
      partyMembers.set(interaction.user.id, interaction.user);

      let spotsLeft = interaction.options.getInteger('faltan', true);

      const lfgMessage = interaction.options.getString('mensaje', false) ?? "";

      let lfgCanceled = false;

      const partyEmbed = new EmbedBuilder()
        .setTitle(`¡${interaction.member.user.username} está buscando compañeros de grupo!`)
        .setThumbnail(interaction.user.displayAvatarURL({ size: 512 }))
        .setDescription(`**Grupo:**\n${partyMembers.map(user => `<@${user.id}>`).join("\n")}`)
        .setFooter({ text: `¡Se necesitan ${spotsLeft} jugadores más!` })
        .setColor(interaction.member.displayColor);

      const actionRow = createActionRow();

      const partyMessage = await interaction.channel?.send({ content: lfgMessage, embeds: [partyEmbed], components: [actionRow] }).catch(err => console.log(err));

      if (!partyMessage)
        return await interaction.editReply({ content: "Ocurrió un error al intentar enviar el mensaje, verifica que yo tenga permisos para enviar mensajes en este canal." });

      const waitTime = interaction.options.getInteger('esperar') ?? 5;
      const componentCollector = partyMessage.createMessageComponentCollector({ time: waitTime * 1000 * 60 });

      componentCollector.on('collect', async (buttonInteraction) => {

        if (buttonInteraction.isButton()) {

          switch (buttonInteraction.customId) {

            case 'party-join':
              if (buttonInteraction.user.id === interaction.user.id) {
                await buttonInteraction.reply({ content: 'No puedes unirte a tu propio grupo.', ephemeral: true });

              } else if (partyMembers.has(buttonInteraction.user.id)) {
                await buttonInteraction.reply({ ephemeral: true, content: "Ya estás en el grupo." });

              } else {
                // Agregar al usuario a la party
                partyMembers.set(buttonInteraction.user.id, buttonInteraction.user);
                spotsLeft = spotsLeft - 1;
                await buttonInteraction.reply({ ephemeral: true, content: "¡Has sido agregado a la party!" });
              }

              break;

            case 'party-leave':
              if (buttonInteraction.user.id === interaction.user.id)
                await buttonInteraction.reply({ content: 'No puedes abandonar a tu propio grupo.', ephemeral: true });

              else if (partyMembers.delete(buttonInteraction.user.id)) {
                spotsLeft = spotsLeft + 1;
                await buttonInteraction.reply({ ephemeral: true, content: "Has abandonado el grupo." });

              } else {
                await buttonInteraction.reply({ ephemeral: true, content: "No estás en el grupo." });
              }

              break;

            case 'party-cancel':

              // Si el que presiona el botón es el mismo que inició la búsqueda de grupo
              if (buttonInteraction.user.id === interaction.user.id) {
                lfgCanceled = true;
                componentCollector.stop();
              } else {
                await buttonInteraction.reply({ ephemeral: true, content: 'No puedes cancelar esta interacción.' });
              }
          }
        }

        if (spotsLeft === 0) {
          componentCollector.stop();
        } else {

          // update embed
          const newEmbed = EmbedBuilder.from(partyEmbed)
            .setDescription(`**Grupo:**\n${partyMembers.map((user) => `<@${user.id}>`).join("\n")}`)
            .setFooter({ text: `¡Se necesitan ${spotsLeft} jugadores más!` });

          await partyMessage.edit({ embeds: [newEmbed] });
        }
      })
        // End
        .on('end', async () => {

          if (lfgCanceled) {
            const partyCanceled = new EmbedBuilder()
              .setColor(Colors.Red)
              .setTitle(`${interaction.user.username} ha cancelado la búsqueda de grupo.`);

            await interaction.editReply({ content: 'La interacción ha sido cancelada.' });
            await partyMessage.edit({ embeds: [partyCanceled], components: [] });
            return undefined;
          }

          try {
            if (spotsLeft > 0) {

              const partyFail = EmbedBuilder.from(partyEmbed)
                .setTitle('El grupo no se ha completado en el tiempo dado.')
                .setDescription(`${partyMembers.map(user => `<@${user.id}>`).join("\n")}\n**Faltaron**: ${spotsLeft} jugador/es más.`)
                .setColor(Colors.Red)
                .setFooter({ text: "" });

              await partyMessage.edit({
                embeds: [partyFail], components: []
              });

              await interaction.editReply({
                content: 'El grupo no se completó en el tiempo dado.'
              });

            } else {

              const partySuccessful = EmbedBuilder.from(partyEmbed)
                .setTitle(`¡El grupo se ha completado!`)
                .setDescription(`${interaction.user}\n${partyMembers.map(user => `${user}`).join("\n")}`)
                .setColor(Colors.Green)
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
            await interaction.editReply({ content: 'ocurrió un error con la interacción.' }).catch((e) => console.log("Something happened...", e));
          }
        });

    } else {
      await interaction.reply({ content: "Esta interacción no puede ser usada en mensajes privados." });
    }
  }
}

function createActionRow() {

  const JoinButton = new ButtonBuilder()
    .setCustomId('party-join')
    .setLabel('Unirse')
    .setStyle(ButtonStyle.Primary)

  const LeaveButton = new ButtonBuilder()
    .setCustomId('party-leave')
    .setLabel('Abandonar')
    .setStyle(ButtonStyle.Secondary)

  const CancelButton = new ButtonBuilder()
    .setCustomId('party-cancel')
    .setLabel('Cancelar')
    .setStyle(ButtonStyle.Danger)

  return new ActionRowBuilder().addComponents([JoinButton, LeaveButton, CancelButton]);
}