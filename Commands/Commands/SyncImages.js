const { Message, MessageEmbed } = require('discord.js');
const path = require('path');

const images = {
  "PAYDAY 2": "https://steamcdn-a.akamaihd.net/steam/apps/218620/header.jpg",
  "Grand Theft Auto V": "https://steamcdn-a.akamaihd.net/steam/apps/271590/header.jpg",
  "Garry's Mod": "https://steamcdn-a.akamaihd.net/steam/apps/4000/header.jpg",
  "Tricky Towers": "https://steamcdn-a.akamaihd.net/steam/apps/437920/header.jpg",
  "Crypt of the NecroDancer": "https://steamcdn-a.akamaihd.net/steam/apps/247080/header.jpg",
  "Skullgirls": "https://steamcdn-a.akamaihd.net/steam/apps/245170/header.jpg",
  "Killing Floor": "https://steamcdn-a.akamaihd.net/steam/apps/1250/header.jpg?t=1581466418",
  "Killing Floor 2": "https://steamcdn-a.akamaihd.net/steam/apps/232090/header.jpg",
  "League of Legends": "http://www.masgamers.com/wp-content/uploads/2015/04/LoL-Banner.png",
  "Overcooked! 2": "https://steamcdn-a.akamaihd.net/steam/apps/728880/header.jpg",
  "TruckersMP": "https://steamcdn-a.akamaihd.net/steam/apps/227300/header.jpg",
  "Cities: Skylines": "https://steamcdn-a.akamaihd.net/steam/apps/255710/header.jpg",
  "Counter-Strike: Global Offensive": "https://steamcdn-a.akamaihd.net/steam/apps/730/header.jpg",
  "Rocket League": "https://steamcdn-a.akamaihd.net/steam/apps/252950/header.jpg",
  "Rust": "https://steamcdn-a.akamaihd.net/steam/apps/252490/header.jpg",
  "DRAGON BALL Z: KAKAROT": "https://steamcdn-a.akamaihd.net/steam/apps/851850/header.jpg",
  "Arma 3": "https://steamcdn-a.akamaihd.net/steam/apps/107410/header.jpg",
  "Keep Talking and Nobody Explodes": "https://steamcdn-a.akamaihd.net/steam/apps/341800/header.jpg",
  "VRChat": "https://steamcdn-a.akamaihd.net/steam/apps/438100/header.jpg",
  "Euro Truck Simulator 2": "https://steamcdn-a.akamaihd.net/steam/apps/227300/header.jpg",
  "Dead by Daylight": "https://steamcdn-a.akamaihd.net/steam/apps/381210/header.jpg",
  "PLAYERUNKNOWN'S BATTLEGROUNDS": "https://steamcdn-a.akamaihd.net/steam/apps/578080/header.jpg",
  "osu!": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Osulogo.png/490px-Osulogo.png",
  "Fortnite": "https://wwwhatsnew.com/wp-content/uploads/2019/10/10-diferencias-entre-el-nuevo-Fortnite-y-el-anterior.jpg",
  "PUBG LITE": "https://sm.ign.com/ign_es/screenshot/default/pubglite2_x4gc.jpg",
  "Minecraft": "https://img.poki.com/cdn-cgi/image/width=314,height=314,fit=cover,g=0x0,f=auto/12a0ed7c6bc09b73d6558c6f69ed7f5f.png",
  "Google Chrome": "https://www.techsling.com/wp-content/uploads/2019/12/google-chrome-extensions.jpg",
  "Just Dance Now": "https://secure.surveymonkey.com/_resources/24770/52794770/03b1ec4d-fe52-46e7-87ad-6e40cc45a569.jpg",
  "Spotify": "https://www.scdn.co/i/_global/open-graph-default.png",
  "Farming Simulator 19": "https://www.que.es/wp-content/uploads/2018/11/farming-simulator-portada.jpg",
  "Super Animal Royale": "https://steamcdn-a.akamaihd.net/steam/apps/843380/header.jpg",
  "Tom Clancy's Rainbow Six Siege": "https://steamcdn-a.akamaihd.net/steam/apps/359550/header.jpg",
  "RESIDENT EVIL 2 'R.P.D. Demo'": "https://steamcdn-a.akamaihd.net/steam/apps/1168280/header.jpg",
  "Resident Evil 7 / Biohazard 7 Teaser: Beginning Hour": "https://steamcdn-a.akamaihd.net/steam/apps/530620/header.jpg",
  "RESIDENT EVIL 3": "https://steamcdn-a.akamaihd.net/steam/apps/952060/header.jpg",
  "Resident Evil 5 / Biohazard 5": "https://steamcdn-a.akamaihd.net/steam/apps/21690/header.jpg",
  "Resident Evil 6 / Biohazard 6": "https://steamcdn-a.akamaihd.net/steam/apps/221040/header.jpg",
  "RESIDENT EVIL 2 / BIOHAZARD RE:2": "https://steamcdn-a.akamaihd.net/steam/apps/883710/header.jpg",
  "Untitled Goose Game": "https://steamcdn-a.akamaihd.net/steam/apps/837470/header.jpg",
  "Move or Die": "https://steamcdn-a.akamaihd.net/steam/apps/323850/header.jpg",
  "Visual Studio Code": "https://barnamenevisan.org/ImagesArticle/93e8576731dc44cabf0f8a51dfab9604.jpg",
  "NEKOPARA": "https://gaminguardian.com/wp-content/uploads/2018/01/Nekopara.jpg",
  "NieR:Automata": "https://steamcdn-a.akamaihd.net/steam/apps/524220/header.jpg",
  "DayZ": "https://steamcdn-a.akamaihd.net/steam/apps/221100/header.jpg",
  "Dota 2": "https://steamcdn-a.akamaihd.net/steam/apps/570/header.jpg",
  "Business Tour - Online Multiplayer Board Game": "https://steamcdn-a.akamaihd.net/steam/apps/397900/logo.png",
  "Escape from Tarkov": "https://steam.cryotank.net/wp-content/gallery/escapefromtarkov/Escape-From-Tarkov-09.png",
  "Apex Legends": "https://puu.sh/F9GVj/ccc699d37b.jpeg",
  "Warframe": "https://steamcdn-a.akamaihd.net/steam/apps/230410/header.jpg",
  "War Thunder": "https://steamcdn-a.akamaihd.net/steam/apps/236390/header.jpg",
  "Destiny 2": "https://steamcdn-a.akamaihd.net/steam/apps/1085660/header.jpg",
  "MONSTER HUNTER: WORLD": "https://steamcdn-a.akamaihd.net/steam/apps/582010/header.jpg",
  "ARK: Survival Evolved": "https://steamcdn-a.akamaihd.net/steam/apps/346110/header.jpg",
  "Football Manager 2020": "https://steamcdn-a.akamaihd.net/steam/apps/1100600/header.jpg",
  "Paladins": "https://steamcdn-a.akamaihd.net/steam/apps/444090/header.jpg",
  "Twitch Sings": "https://puu.sh/FecmM/11f4534e24.png",
  "VALORANT": "https://vgezone.com/wp-content/uploads/2020/03/valorant.jpg",
  "Among Us": "https://steamcdn-a.akamaihd.net/steam/apps/945360/header.jpg",
  "Fall Guys": "https://depor.com/resizer/pZkkvZ-_ICtrsqSEWWJTP6rIQd4=/580x330/smart/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/KJD63BKH5VFNFOMA6XTJ4DLZLA.jpg",
  "Call of Duty®: Modern Warfare®": "https://hardzone.es/app/uploads-hardzone.es/2019/10/COD-MW.jpg",
  "Wallpaper Engine": "https://steamcdn-a.akamaihd.net/steam/apps/431960/capsule_616x353.jpg",
  "FiveM": "https://cheatingingaming.com/wp-content/uploads/2019/12/fivem-logo-3.png",
  "Custom Status": "https://www.esportsportal.com/wp-content/uploads/2019/09/discord-banner-3.png",
  "Heroes of the Storm": "https://static.heroesofthestorm.com/images/global/fb-share-1fcc54becc.jpg"
};



module.exports = {
  name: "sync",
  description: "sync.",
  aliases: [],
  filename: path.basename(__filename),
  usage: "sync",
  nsfw: false,
  enabled: true,
  permissions: [],
  botOwnerOnly: true,
  guildOnly: false,
  moderationOnly: false,
  /**
   * 
   * @param {Message} message 
   * @param {Array} args 
   */
  async execute(message, args) {
    const { client } = message;

    for (const key in images) {
      if (images.hasOwnProperty(key)) {
        const url = images[key];

        if (client.db.gameImages.has(key))
          continue;

        client.db.gameImages.set(key, url);

        console.log(`Game: ${key}, URL: ${url}`);
      }
    }
  }
}