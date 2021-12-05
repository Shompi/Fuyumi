const { CommandInteraction, MessageEmbed, MessageReaction, User, Collection } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');


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
        .setRequired(true)
    })
    .addStringOption(input => {
      return input.setName("mensaje")
        .setDescription('Tu mensaje para crear este grupo')
        .setRequired(false);
    }),
  isGlobal: false,

  /**
  * @param {CommandInteraction} interaction
  * @return {Promise<string|MessageEmbed>}
  */
  async execute(interaction) {
    if (interaction.inGuild()) {

      const check = validateArgs(interaction);
      await interaction.deferReply({ ephemeral: true });

      if (check.error) return await interaction.editReply({ content: `**Error:** ${check.message}` });

      /** @type {Collection<string, User>} */
      const partyMembers = new Collection();

      partyMembers.set(interaction.user.id, interaction.user);

      const lfgMessage = interaction.options.getString('mensaje', false);

      const partyEmbed = new MessageEmbed()
        .setTitle(`¡${interaction.member.user.tag} está buscando compañeros de grupo!`)
        .setThumbnail(interaction.user.displayAvatarURL({ size: 512, dynamic: true }))
        .setDescription(`${lfgMessage ?? ""}\n${partyMembers.map(user => `<@${user.id}>`).join("\n")}`)
        .setFooter(`¡Se necesitan ${check.partySize} jugadores más!`)
        .setColor(interaction.member.displayColor);

      const partyMessage = await interaction.channel.send({ embeds: [partyEmbed] });
      await partyMessage.react('✅');

      /** 
      * @param {MessageReaction} reaction the reaction being added
      * @param {User} user the user who added the reaction
      */

      const reactionCollector = partyMessage.createReactionCollector({ time: 1000 * 60 * 5 });

      reactionCollector.on('collect', async (reaction, user) => {

        if (reaction.emoji.name !== '✅') return;
        if (user.id === interaction.user.id) return console.log('Reaction ignored');
        if (user.id === interaction.client.user.id) return console.log('Reaction ignored');
        if (partyMembers.has(user.id)) return console.log("Reaction ignores (User already was on the party)");

        console.log("Reaction count: ", reaction.count);

        if (reaction.count > check.partySize) {
          // Check partyMembers
          if (partyMembers.size === check.partySize + 1) {
            reactionCollector.stop();
          } else {
            partyMembers.set(user.id, user);
          }
        } else {
          partyMembers.set(user.id, user);
        }

        // update embed
        const newEmbed = new MessageEmbed(partyEmbed)
          .setDescription(`${lfgMessage ?? ""}\n${partyMembers.map(user => `<@${user.id}>`).join("\n")}`)
          .setFooter(`¡Se necesitan ${(check.partySize + 1) - partyMembers.size} jugadores más!`);

        await partyMessage.edit({ embeds: [newEmbed] });

      }).on('end', async (collected, reason) => {

        // Chequear si la cantidad de usuarios en partyMembers es igual a check.partySize
        try {
          if (partyMembers.size < check.partySize + 1) {

            const partyFail = new MessageEmbed(partyEmbed)
              .setTitle('El grupo no se ha completado en el tiempo dado.')
              .setDescription('')
              .setColor('RED')
              .setFooter('');

            await partyMessage.edit({
              embeds: [partyFail]
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
              embeds: [partySuccessful]
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