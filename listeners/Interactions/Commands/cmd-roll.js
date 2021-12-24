const { CommandInteraction, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Lanza un dado y obten un número')
    .addIntegerOption(dados => {
      return dados.setName('dados')
        .setDescription('Cantidad de dados que quieres lanzar (MAX: 10, DEF: 1)')
    })
    .addIntegerOption(input => {
      return input.setName('caras')
        .setDescription('Cantidad de caras del dado (MAX 100.000, DEF 6)')
    }),
  isGlobal: true,

  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {
    const caras = interaction.options.getInteger('caras', false) ?? 6;
    const dados = interaction.options.getInteger('dados', false) ?? 1;

    if (caras > 100_000)
      return await interaction.reply({
        content: 'La cantidad de caras que ingresaste excede el limite (100.000).',
        ephemeral: true
      });

    if (dados > 10)
      return await interaction.reply({
        content: 'La cantidad de dados que ingresaste excede el limite (10)',
        ephemeral: true
      });

    const rolls = rollDice(caras, dados);

    const embed = new MessageEmbed()
      .setTitle(`${interaction.member.displayName} has conseguido:`)
      .setDescription(`${rolls.map(number => `🎲- ${number}`).join("\n")}\nTotal: ${rolls.reduce((acc, value) => { return acc + value }, 0)}`)
      .setColor(interaction.member.displayColor);

    return await interaction.reply({
      embeds: [embed],
    });
  }
}

function rollDice(caras, dados) {
  const rolls = [];
  for (let i = 0; i < dados; i++) {
    rolls.push(Math.floor(Math.random() * caras) + 1);
  }

  return rolls;
}