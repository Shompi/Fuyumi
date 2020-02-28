module.exports = {
  name: "help",
  aliases: ["h"],
  description: "Comando de ayuda.",
  filename: path.basename(__filename),
  nsfw: false,
  enabled: true,
  permissions: [],
  usage: "help (comando)",

  async execute(message = new Message(), args = new Array()) {
    //For now lets just return a message.
    return await message.channel.send(`Este comando aún no está listo :(`);


    
  }
}