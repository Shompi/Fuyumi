module.exports = (game = new String()) => {

  if (game.startsWith('NEKOPARA')) game = "NEKOPARA";
  if (game.startsWith('DayZ')) game = 'DayZ';
  //Make it an object literal
  const unknown = "https://puu.sh/F2ZUN/ea3856ca91.png"
  const images = {
    "PAYDAY 2": "https://steamcdn-a.akamaihd.net/steam/apps/218620/header.jpg",
    "Grand Theft Auto V": "https://steamcdn-a.akamaihd.net/steam/apps/271590/header.jpg",
    "Garry's Mod": "https://steamcdn-a.akamaihd.net/steam/apps/4000/header.jpg",
    "Tricky Towers": "https://steamcdn-a.akamaihd.net/steam/apps/437920/header.jpg",
    "Crypt of the NecroDancer": "https://steamcdn-a.akamaihd.net/steam/apps/247080/header.jpg",
    "Skullgirls": "https://steamcdn-a.akamaihd.net/steam/apps/245170/header.jpg",
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
    "NieR:Automata™": "https://steamcdn-a.akamaihd.net/steam/apps/524220/header.jpg",
    "DayZ": "https://steamcdn-a.akamaihd.net/steam/apps/221100/header.jpg",
    "Dota 2": "https://steamcdn-a.akamaihd.net/steam/apps/570/header.jpg",
  };

  const imageUrl = images[game];
  if (!imageUrl) return unknown;
  return imageUrl;
}
