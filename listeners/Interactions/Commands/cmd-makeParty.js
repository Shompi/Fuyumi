const { CommandInteraction, MessageEmbed, MessageReaction, User, Collection, MessageButton, MessageActionRow } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

/**@type {Collection<string, {t_expires: number, user:User}>} */
const timeouts = new Collection();


/**
   * @param {CommandInteraction} interaction
   */
function validateArgs(interaction) {
  const partySize = interaction.options.getInteger('faltan', true);

  if (partySize < 1) {
    return {
      error: true,
      message: "No puedes solicitar una party con menos de **1** espacios.\n**Nota:** Al momento de usar este comando, tú estás siendo contado automáticamente como integrante del grupo por lo que no es necesario que reacciones.",
    }
  } else {
    return {
      error: false,
      partySize: partySize
    }
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('party')
    .setDescription('¡Crea un grupo con los miembros que reaccionen!')
    .addIntegerOption(input => {
      return input.setName('faltan')
        .setDescription('Cantidad de jugadores que faltan para que el grupo esté completo, sin contarte a tí')
        .setRequired(true);
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
    }),

  isGlobal: false,

  /**
  * @param {CommandInteraction} interaction
  * @return {Promise<string|MessageEmbed>}
  */
  async execute(interaction) {


    if (timeouts.has(interaction.user.id)) {
      return await interaction.reply({
        ephemeral: true,
        content: `Debes esperar ${Math.round((timeouts.get(interaction.user.id).t_expires - Date.now()) / 1000)} segundos más.`
      });
    }
    if (interaction.inGuild()) {

      timeouts.set(interaction.user.id, { t_expires: Date.now() + (1000 * 60 * 5) });
      setTimeout(() => timeouts.delete(interaction.user.id), 1000 * 60 * 5);

      const check = validateArgs(interaction);
      await interaction.deferReply({ ephemeral: true });

      if (check.error) return await interaction.editReply({ content: `**Error:** ${check.message}` });

      /** @type {Collection<string, User>} */
      const partyMembers = new Collection();

      partyMembers.set(interaction.user.id, interaction.user);


      const lfgMessageTemp = interaction.options.getString('mensaje', false);
      const lfgMentionTemp = interaction.options.getRole('mencionar', false);

      const lfgMessage = `${lfgMentionTemp ? `${lfgMentionTemp} ${lfgMessageTemp ?? ""}` : `${lfgMessageTemp ?? ""}`} `;

      const partyEmbed = new MessageEmbed()
        .setTitle(`¡${interaction.member.user.tag} está buscando compañeros de grupo!`)
        .setThumbnail(interaction.user.displayAvatarURL({ size: 512, dynamic: true }))
        .setDescription(`**Grupo:**\n${partyMembers.map(user => `<@${user.id}>`).join("\n")}`)
        .setFooter(`¡Se necesitan ${check.partySize} jugadores más!`)
        .setColor(interaction.member.displayColor);

      const JoinButton = new MessageButton()
        .setCustomId('join')
        .setLabel('Unirse')
        .setStyle('PRIMARY')

      const LeaveButton = new MessageButton()
        .setCustomId('leave')
        .setLabel('Abandonar')
        .setStyle('SECONDARY')

      const actionRow = new MessageActionRow()
        .addComponents([JoinButton, LeaveButton]);

      const partyMessage = await interaction.channel.send({ content: lfgMessage, embeds: [partyEmbed], components: [actionRow] });

      /** 
      * @param {MessageReaction} reaction the reaction being added
      * @param {User} user the user who added the reaction
      */

      //TODO: usar interaccion con botones en vez de usar una reacción.
      const componentCollector = partyMessage.createMessageComponentCollector({ time: 1000 * 60 * 5 });

      componentCollector.on('collect', async (buttonInteraction) => {

        if (buttonInteraction.isButton()) {

          switch (buttonInteraction.customId) {

            case 'join':
              if (partyMembers.has(buttonInteraction.user.id)) {
                return await buttonInteraction.reply({ ephemeral: true, content: "Ya estás en la party." })
              } else {
                // Agregar al usuario a la party
                partyMembers.set(buttonInteraction.user.id, buttonInteraction.user);
                await buttonInteraction.reply({ ephemeral: true, content: "¡Has sido agregado a la party!" });
              }
              break;

            case 'leave':
              if (partyMembers.delete(buttonInteraction.user.id)) {
                await buttonInteraction.reply({ ephemeral: true, content: "Has abandonado el grupo." });
              } else {
                return await buttonInteraction.reply({ ephemeral: true, content: "No estás en el grupo." });
              }
              break;
          }
        }

        if (((check.partySize + 1) - partyMembers.size) === 0) {
          componentCollector.stop();
        } else {

          // update embed
          const newEmbed = new MessageEmbed(partyEmbed)
            .setDescription(`**Grupo:**\n${partyMembers.map((user) => `<@${user.id}>`).join("\n")}`)
            .setFooter(`¡Se necesitan ${(check.partySize + 1) - partyMembers.size} jugadores más!`);

          await partyMessage.edit({ embeds: [newEmbed] });
        }
      }).on('end', async (collected) => {

        // Chequear si la cantidad de usuarios en partyMembers es igual a check.partySize
        try {
          if (partyMembers.size < check.partySize + 1) {

            const partyFail = new MessageEmbed(partyEmbed)
              .setTitle('El grupo no se ha completado en el tiempo dado.')
              .setDescription('')
              .setColor('RED')
              .setFooter('');

            await partyMessage.edit({
              embeds: [partyFail], components: []
            });

            await interaction.editReply({
              content: 'El grupo no se completó en el tiempo dado.'
            });

          } else {

            const partySuccessful = new MessageEmbed(partyEmbed)
              .setTitle(`¡El grupo se ha completado!`)
              .setDescription(`${partyMembers.map(user => `<@${user.id}>`).join("\n")}`)
              .setColor('GREEN')
              .setFooter('');

            await partyMessage.edit({
              embeds: [partySuccessful], components: []
            });

            await interaction.editReply({
              content: 'La interacción ha finalizado exitosamente.'
            });
          }
        } catch (error) {
          console.log(error);
        }
      });

    } else {
      await interaction.reply({ content: "Esta interacción no puede ser usada en mensajes privados." });
    }
  }
}