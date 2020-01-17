const {MessageEmbed} = require('discord.js')
const pic = 'https://puu.sh/F0A4R/87a0e0426d.png'
const plugins = 'TP | Mini Juegos | Misiones | Mercado | Protección Personal | Muerte Personalizada | LockChest | AuthMe | ElevatorSings | WirelessRedStone'
const description = `**IP:** 104.41.3.220:25565
**Hosteado en:** Brazil
**Modo:** Hard Survival
\n__Reglas:__
- **No Toxicidad**
- **PvP excesivo sancionado**
- ** Respeto a todos los jugadores**
\nServidor con constantes actualizaciones.
**Misiones - Eventos - Minijuegos. Mercado por tiempo limitado.**`
module.exports = new MessageEmbed()
  .setTitle('Servidor de Minecraft "AUSTRAL COMMUNITY"')
  .setDescription(description)
  .setThumbnail(pic)
  .addField('Versión:', "1.11")
  .addField('Administradores:', '<@279716541891608576> - <@340577506752987146> - <@219919130185170944>')
  .addField('Slots:', '**20**')
  .addField('Plugins:', plugins)
  .setColor('ORANGE')
