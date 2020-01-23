const { MessageEmbed, VoiceState, Collection, Client } = require('discord.js');
const keyv = require('keyv');
const db = new keyv("sqlite://./Databases/Streamings/streamings.sqlite");
db.on('error', error => console.log(error));

module.exports = async (old = new VoiceState(), now = new VoiceState(), Muki = new Client()) => {
  const isStreaming = await db.get(now.id);
  if (isStreaming) return;
  if (now.streaming && !old.streaming) {
    await db.set(now.id, 'streaming', 1000 * 60 * 60 * 2);
    const channel = now.guild.channels.find(ch => ch.type == 'text' && ch.name == 'directos');
    if (!channel) return;
    const activity = now.member.presence.activity;
    const image = activity ? getImage(activity.name) : getImage('Actividad Desconocida');
    const streamEmbed = new MessageEmbed()
      .setColor(now.member.displayColor)
      .setTitle(`${now.member.nickname ? now.member.nickname : now.member.user.tag} ha comenzado a transmitir ${activity ? activity.name : 'Actividad Desconocida.'} en ${now.guild.name}!`)
      .setThumbnail(now.member.user.displayAvatarURL({ size: 256 }))
      .setImage(image);
    await channel.send(streamEmbed);
    return;
  }
}

const getImage = (game) => {
  let image;
  switch (game) {
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
      image = "https://puu.sh/F2N8p/bf31fa1e6e.png"
      break;
  }
  return image;
}