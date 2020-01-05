const { TextChannel, MessageEmbed } = require('discord.js');
const Mods = require("./Mods");
const osuToken = process.env.OSUTOKEN;
const apiBase = "https://osu.ppy.sh/api/";
const Osu = require('../../Classes/Osu');

const endpoint = `${apiBase}get_user_best?k=${osuToken}&limit=1&type=string&u=`;
const fetch = require('node-fetch');
const beatmapEndpoint = `${apiBase}get_beatmaps?k=${osuToken}&b=`
//Beatmap img https://b.ppy.sh/thumb/${map.beatmapsetID}l.jpg
module.exports = async (username, channel = new TextChannel()) => {

  const embed = new MessageEmbed()
    .setColor("LUMINOUS_VIVID_PINK")
    .setFooter("Powered by osu! API by peppy", "https://upload.wikimedia.org/wikipedia/commons/e/e3/Osulogo.png");

  const play = new Osu.TopScore(await fetch(endpoint + username).then(res => res.json()).then(plays => plays[0]));
  if (!play) return await channel.send("El usuario no registra ningún top.");

  const bminfo = new Osu.BeatmapInfo(await fetch(beatmapEndpoint + play.beatmap_id).then(res => res.json()).then(maps => maps[0]));
  embed.setTitle(`TOP play de ${username}:\n${bminfo.title} - ${bminfo.artist} | ${bminfo.stars.toFixed(2)} ⭐`)
    .setDescription(`**PP:** ${play.pp.toFixed(2)}\n**Precisión:** ${accuracyCalc(play).toFixed(2)}%\n**Rank:** ${play.rank}\n**Mods:** ${modCalc(play.mods)}`
    + `\n\n**Mapa:** https://osu.ppy.sh/b/${play.beatmap_id}`)
    .setThumbnail(`https://b.ppy.sh/thumb/${bminfo.beatmapSetId}l.jpg`)

  return await channel.send(embed);
}

const accuracyCalc = (play = new Osu.TopScore()) => {
  let upper = (50 * play.count50) + (100 * play.count100) + (300 * play.count300);
  let lower = 300 * (play.misses + play.count50 + play.count100 + play.count300);
  return Number((upper / lower) * 100);
}


const modCalc = (mods) => {
  //Single Mods
  if (mods == 0) return "No Mod";
  if (mods == Mods.NF) return "No Fail";
  if (mods == Mods.EZ) return "Easy";
  if (mods == Mods.Touch) return "Touch";
  if (mods == Mods.HD) return "Hidden";
  if (mods == Mods.HR) return "Hardrock";
  if (mods == Mods.SD) return "Sudden Death";
  if (mods == Mods.DT) return "Double-Time";
  if (mods == Mods.RX) return "Relax";
  if (mods == Mods.HT) return "Half-Time";
  if (mods == Mods.NC) return "Nightcore";
  if (mods == Mods.FL) return "Flashlight";

  //Some Combinations
  if (mods == Mods.NF + Mods.HD) return "NF + HD";
  if (mods == Mods.NF + Mods.HR) return "NF + HR";
  if (mods == Mods.EZ + Mods.HD) return "EZ + HD";
  if (mods == Mods.HD + Mods.HR) return "HD + HR";
  if (mods == Mods.HD + Mods.FL) return "HD + FL";
  if (mods == Mods.HD + Mods.SO) return "HD + SO";
  if (mods == Mods.HT + Mods.HD) return "HT + HD";
  if (mods == Mods.DT + Mods.HD) return "DT + HD";
  if (mods == Mods.NC + Mods.HD + Mods.DT) return "HD + NC";
  if (mods == Mods.NF + Mods.HR + Mods.HD) return "NF + HD + HR";
  if (mods == Mods.EZ + Mods.HD + Mods.DT) return "EZ + HD + DT";
  if (mods == Mods.EZ + Mods.HD + Mods.NC + Mods.DT) return "EZ + HD + NC";
  if (mods == Mods.EZ + Mods.NF + Mods.HD + Mods.DT + Mods.NC) return "EZ+NF+HD+NC";
}