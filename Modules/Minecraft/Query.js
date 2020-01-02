const { MessageEmbed, Message } = require('discord.js');
const MCquery = require('minecraft-query');
const query = new MCquery({ host: 'exiliados.ddns.net', port: 25565, timeout: 5000 });

const queryRequest = (message) => {
  query.fullStat()
    .then(async res => {
      const players = res.players.join('\n');
      if (res.gametype == 'SMP') res.gametype = 'Survival MultiPlayer';
      const embed = new MessageEmbed()
        .setTitle('Servidor de Minecraft Exiliados Oficial\nOnline')
        .setDescription(`**Modo de Juego:** ${res.gametype}\n**Version de Minecraft:** ${res.version}\n**MOTD:** ${res.motd}\n**Players:** ${res.online_players}/${res.max_players}\n**Dificultad:** Dificil`)
        .addField('Jugadores En Linea:', `${players || '0'}`)
        .setColor('GREEN')

      return await message.channel.send(embed);
    })
    .catch(async err => {
      console.log(err);
      return await message.channel.send('❌ Error en la petición. Al parecer el servidor no se encuentra online.');
    })
}


const plugins = async (message = new Message()) => {
  query.fullStat()
    .then(async res => {
      const plugins = res.plugins.split(";").join('\n');
      
      const embed = new MessageEmbed()
        .setColor('BLUE')
        .setDescription(`${plugins}`)

      return await message.channel.send(embed);
    })
    .catch(async err => {
      console.log(err);
      return await message.channel.send('❌ Error en la petición. Al parecer el sevidor no se encuentra online.');
    })
}

module.exports = { plugins, queryRequest };