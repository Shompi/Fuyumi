const Discord = require("discord.js")
module.exports = async (client, interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "ticketbutton") {

      interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
        type: 'GUILD_TEXT',
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [Discord.Permissions.FLAGS.VIEW_CHANNEL],
          },
          {
            id: interaction.user.id,
            allow: [Discord.Permissions.FLAGS.VIEW_CHANNEL],
            deny: [Discord.Permissions.FLAGS.SEND_MESSAGES],
          },
        ],
      }).then(async ch => {
        const start = new Discord.MessageEmbed()
          .setColor('#2f3136')
          .setTitle('Επιλέξτε το θέμα του ticket με μία από τις επιλογές παρακάτω')
          .setFooter({ text: 'Ticket System' })
          .setTimestamp()

        const reply = new Discord.MessageEmbed()
          .setColor('#2f3136')
          .setDescription(`Το ticket σου δημιουργήθηκε με επιτυχία. Μπορείς να πας τωρα στο κανάλι <#${ch.id}> για να συνεχίσεις την διαδικασία.`)
          .setFooter({ text: 'Ticket System' })
          .setTimestamp()

        const menu = new Discord.MessageActionRow()
          .addComponents(
            new Discord.MessageSelectMenu()
              .setCustomId('selectmenu')
              .setPlaceholder('Επιλογές')
              .addOptions([
                {
                  label: "Staff Team",
                  description: "Ένταξη στο staff team.",
                  value: "staff",
                  emoji: "🛡️"
                },
                {
                  label: "Invite Rewards ;",
                  description: "Απορία με τα invite rewards.",
                  value: "inviterewards",
                  emoji: "🎁"
                },
                {
                  label: "Bug",
                  description: "Αναφορά bug που υπάρχει στον server.",
                  value: "bug",
                  emoji: "💡"
                },
                {
                  label: "Other",
                  description: "Κάτι διαφορετικό.",
                  value: "other",
                  emoji: "❓"
                }
              ])
          )
        await interaction.reply({ embeds: [reply], ephemeral: true })
        await ch.send({ embeds: [start], components: [menu] })

      })
      if (interaction.isSelectMenu()) {
        console.log(interaction)

      }
    }
  }