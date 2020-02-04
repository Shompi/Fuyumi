const { MessageEmbed, Presence } = require('discord.js');
const streamings = require('../../LoadDatabase').streamings;
const getImage = require('../getImage');
module.exports = async (old = new Presence(), now = new Presence()) => {
  /**
   * 1.- Verificar que el usuario está stremeando
   * 2.- Verificar si el usuario estaba stremeando antes
   * 3.- Comparar la actividad anterior con la nueva:
   * >Si son iguales = retornar
   * >Si son distintas = Actualizar el mensaje relacionado con el primer livestream.
   */
  if (now.user.bot) return;
  const activity = now.activities[0];
  if (!activity) return console.log(`El usuario ${now.user.tag} no tiene actividades`);
  if (activity.type !== 'STREAMING') return;

  const streamingChannel = now.member.guild.channels.find(channel => channel.name == "directos" && channel.type == 'text');
  if (!streamingChannel) return console.log("No se encontró canal de streamings.");
  const image = getImage(activity.state) || getImage(now.activities[1].name);
  const embed = new MessageEmbed()
    .setColor(now.member.displayColor)
    .setThumbnail(`${now.member.user.displayAvatarURL({size:256})}`)
    .setTitle(`¡${old.member.displayName} está en vivo en ${activity.name}!`)
    .setDescription(`**${activity.details}**\nÚnete a la transmisión en ${activity.url || "NO URL"}`)
    .setTimestamp()
    .setImage(image);

  return await streamingChannel.send(embed);
}



const getImage = (game) => {
  let image;
  switch (game) {
    case "PAYDAY 2":
      image = "https://steamcdn-a.akamaihd.net/steam/apps/218620/header.jpg";
      break;
    case "Grand Theft Auto V":
      image = "https://steamcdn-a.akamaihd.net/steam/apps/271590/header.jpg";
      break;
    case "Garry's Mod":
      image = "https://steamcdn-a.akamaihd.net/steam/apps/4000/header.jpg";
      break;
    case "Tricky Towers":
      image = "https://steamcdn-a.akamaihd.net/steam/apps/437920/header.jpg";
      break;
    case "Crypt of the NecroDancer":
      image = "https://steamcdn-a.akamaihd.net/steam/apps/247080/header.jpg";
      break;
    case "Skullgirls":
      image = "https://steamcdn-a.akamaihd.net/steam/apps/245170/header.jpg";
      break;
    case "Killing Floor 2":
      image = "https://steamcdn-a.akamaihd.net/steam/apps/232090/header.jpg";
      break;
    case "League of Legends":
      image = "http://www.masgamers.com/wp-content/uploads/2015/04/LoL-Banner.png";
      break;
    case "Overcooked! 2":
      image = "https://steamcdn-a.akamaihd.net/steam/apps/728880/header.jpg";
      break;
    case "TruckersMP":
      image = "https://steamcdn-a.akamaihd.net/steam/apps/227300/header.jpg";
      break;
    case "Cities: Skylines":
      image = "https://steamcdn-a.akamaihd.net/steam/apps/255710/header.jpg";
      break;
    case "Counter-Strike: Global Offensive":
      image = "https://steamcdn-a.akamaihd.net/steam/apps/730/header.jpg";
      break;
    case 'Rocket League':
      image = "https://steamcdn-a.akamaihd.net/steam/apps/252950/header.jpg";
      break;
    case 'Rust':
      image = "https://steamcdn-a.akamaihd.net/steam/apps/252490/header.jpg";
      break;
    case 'DRAGON BALL Z: KAKAROT':
      image = "https://steamcdn-a.akamaihd.net/steam/apps/851850/header.jpg";
      break;
    case 'Arma 3':
      image = "https://steamcdn-a.akamaihd.net/steam/apps/107410/header.jpg";
      break;
    case 'Keep Talking and Nobody Explodes':
      image = "https://steamcdn-a.akamaihd.net/steam/apps/341800/header.jpg";
      break;
    case 'VRChat':
      image = "https://steamcdn-a.akamaihd.net/steam/apps/438100/header.jpg";
      break;
    case 'Euro Truck Simulator 2':
      image = "https://steamcdn-a.akamaihd.net/steam/apps/227300/header.jpg";
      break;
    case 'Dead by Daylight':
      image = "https://steamcdn-a.akamaihd.net/steam/apps/381210/header.jpg";
      break;
    case "PLAYERUNKNOWN'S BATTLEGROUNDS":
      image = "https://steamcdn-a.akamaihd.net/steam/apps/578080/header.jpg";
      break;
    case "osu!":
      image = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Osulogo.png/490px-Osulogo.png"
      break;
    case "Fortnite":
      image = "https://wwwhatsnew.com/wp-content/uploads/2019/10/10-diferencias-entre-el-nuevo-Fortnite-y-el-anterior.jpg";
      break;
    case "PUBG LITE":
      image = "https://sm.ign.com/ign_es/screenshot/default/pubglite2_x4gc.jpg";
      break;
    case "Minecraft":
      image = "https://img.poki.com/cdn-cgi/image/width=314,height=314,fit=cover,g=0x0,f=auto/12a0ed7c6bc09b73d6558c6f69ed7f5f.png"
      break;
    case "Actividad Desconocida":
      image = "https://puu.sh/F2ZUN/ea3856ca91.png"
      break;
    case "Google Chrome":
      image = "https://www.techsling.com/wp-content/uploads/2019/12/google-chrome-extensions.jpg"
      break;
    default:
      image = null;
  }
  return image;
}