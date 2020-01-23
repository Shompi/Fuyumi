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
    const image = activity ? getImage(activity.name) : null;
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
    case 'Rocket League':
      image = "https://static.13.cl/7/sites/default/files/esports/articulos/field-image/ae475dd426714e9e7857b28f92009011d16ac98e_1.jpg";
      break;
    case 'Rust':
      image = "https://xpic8.igvimg.com/group_c/1909/3019/122/ec7e532b-128a-48bf-8f5b-f571488e275d.jpg";
      break;
    case 'DRAGON BALL Z: KAKAROT':
      image = "https://redgol.cl/__export/1579295186682/sites/redgol/img/2020/01/17/dragon-ball-z-kakarot-2-1620x800_crop1579295040131.jpg_2024461655.jpg";
      break;
    case 'Arma 3':
      image = "https://http2.mlstatic.com/arma-3-pc-original-steam-D_NQ_NP_816914-MLA29380135702_022019-F.jpg";
      break;
    case 'Keep Talking and Nobody Explodes':
      image = "http://www.bombmanual.com/es/img/header.png";
      break;
    case 'VRChat':
      image = "https://www.psu.com/wp/wp-content/uploads/2019/11/VRChat-1024x576.jpg";
      break;
    case 'Euro Truck Simulator 2':
      image = "https://cdn-cf.gamivo.com/image_cover.jpg?f=46408&n=9220184845401234.jpg&h=276afdbd7f7da67694ef0b9aff7fcccf";
      break;
    case 'Dead by Daylight':
      image = "https://www.gameprotv.com/archivos/201704/dead-by-daylight-principal.jpg";
      break;
    case "osu!":
      image = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Osulogo.png/490px-Osulogo.png"
      break;
    case "Fortnite":
      image = "https://wwwhatsnew.com/wp-content/uploads/2019/10/10-diferencias-entre-el-nuevo-Fortnite-y-el-anterior.jpg";
      break;
    default:
      image = "https://www.dafont.com/forum/attach/orig/4/7/474158.png";
  }
  return image;
}