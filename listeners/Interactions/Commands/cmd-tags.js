const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tag')
    .setDescription("Comandos para guardar, editar, eliminar y mostrar tus tags")
    .addSubcommand(get => {
      return get.setName('get')
        .setDescription('Obtiene un tag tuyo con el nombre que ingreses')
        .addStringOption(tagname => {
          return tagname.setName('nombre')
            .setDescription('El nombre del tag')
            .setRequired(true);
        })
    })

    // Create
    .addSubcommand(create => {
      return create.setName('crear')
        .setDescription('Crea un tag')
        .addStringOption(input => {
          return input.setName('nombre')
            .setDescription('Nombre del tag para despues obtenerlo con /tag <nombre>')
            .setRequired(true)
        })
        .addStringOption(content => {
          return content.setName('contenido')
            .setDescription('Contenido de este tag, básicamente que es lo que quieres que devuelva este tag')
            .setRequired(true)
        })
    })

    // Delete
    .addSubcommand(borrar => {
      return borrar.setName('borrar')
        .setDescription('Borra un tag tuyo')
        .addStringOption(nombre => {
          return nombre.setName('nombre')
            .setDescription("Nombre de uno de los tags tuyos que quieres borrar")
            .setRequired(true)
        })
    })

    // edit
    .addSubcommand(edit => {
      return edit.setName('editar')
        .setDescription('Edita uno de tus tags')
        .addStringOption(tagname => {
          return tagname.setName('nombre')
            .setDescription('Nombre del tag que quieres editar')
            .setRequired(true)
        })
        .addStringOption(content => {
          return content.setName('contenido')
            .setDescription('Contenido con el que quieres reemplazar al contenido actual de este tag')
            .setRequired(true)
        })
    })
    .addSubcommand(show => {
      return show.setName('mostrar')
        .setDescription('Muestra tus tags')
    }),
  isGlobal: false,

  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async execute(interaction) {

    const command = interaction.options.getSubcommand();


    switch (command) {

      case 'get':
        break;
      case 'mostrar':
        break;
      case 'editar':
        break;
      case 'borrar':
        break;
      case 'crear':
        break;
    }
  }
}