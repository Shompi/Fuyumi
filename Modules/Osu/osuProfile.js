const { MessageEmbed, TextChannel } = require('discord.js');
const fetch = require('node-fetch');
const keyv = require('keyv');
const osuApiKey = require('../../Keys/osuToken');
const endpoint = `https://osu.ppy.sh/api/get_user?k=${osuApiKey.osuToken}&u=`;
const Calculations = require('./calculations.js');
const {Profile} = require('../../Classes/Osu');

module.exports = async (username, channel = new TextChannel()) => {
  const osudb = new keyv('sqlite://./Databases/osudb.sqlite');
  osudb.on('error', (error) => {
    console.log("error en osudb");
    console.log(error)
    return;
  });
  let newValues = {};
  try {
    const request = await fetch(`${endpoint + username}`);
    if (!request.ok) return await channel.send('hubo un error al hacer el request.');
    //console.log("request" + request);
    const body = await request.json();
    if (!body.length) return await channel.send('no encontré a nadie con ese nombre.');
    //console.log("body:" + body);
    let info = new Profile(body[0]);
    //console.log("info:" + info);


    let dbInfo = await osudb.get(info.username);
    if (!dbInfo) {
      info.timestamp = Date.now();
      await osudb.set(info.username, info);
      dbInfo = await osudb.get(info.username);
    }
    newValues = await Calculations(info, dbInfo);
    let accuracy = new Number(info.accuracy);
    const osuCard = new MessageEmbed()
      .setColor("LUMINOUS_VIVID_PINK")
      .setThumbnail(`https://s.ppy.sh/a/${info.id}.png`)
      .setAuthor(`Perfil de ${info.username}`)
      .setDescription(`Pais del jugador: \:flag_${info.country.toLowerCase()}:`)
      .addField(`Consulta anterior:`, `${new Date(dbInfo.timestamp)}`)
      .addField(`Nivel`, `${info.level} (${newValues.level})`, true)
      .addField("Partidas", `${info.playcount} (${newValues.playcount})`, true)
      .addField("PP", `${info.pp} (${newValues.pp})`, true)
      .addField("Ranking Mundial", `#${info.pprank} (${newValues.pprank})`, true)
      .addField("Ranking Nacional", `#${info.countryRank} (${newValues.countryRank})`, true)
      .addField("Precisión", `${accuracy.toFixed(2)}% (${newValues.accuracy})`, true)
      .setFooter("Powered by osu! API by peppy", "https://upload.wikimedia.org/wikipedia/commons/e/e3/Osulogo.png");

    info.timestamp = Date.now();
    await osudb.set(info.username, info);
    return await channel.send(osuCard);
  } catch (error) {
    console.log(error);
  }
}