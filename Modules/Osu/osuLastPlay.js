const Mods = require('./Mods');
const { TextChannel, MessageEmbed } = require('discord.js');
const osuAuth = require('../../Keys/osuToken');
const fetch = require('node-fetch');
const api = 'https://osu.ppy.sh/api/';
let { bmInfo, lastMap } = require('../../Classes/Osu');

module.exports = async (query, channel = new TextChannel()) => {
  //Responses son arrays.
  try {
    const userRecent = `${api}get_user_recent?k=${osuAuth}&u=${query}&limit=1`;
    lastMap = await fetch(userRecent).then(res => res.json()).then(info => info[0]).catch(error => console.log(error));
    if (!lastMap) return await channel.send(`${query} no registra partidas en las ultimas 24 horas.`).catch(error => console.log(error));
    //console.log(lastMap);

    const beatMapEndpoint = `${api}get_beatmaps?k=${osuAuth}&b=${lastMap.beatmap_id}`;
    bmInfo = await fetch(beatMapEndpoint).then(res => res.json()).then(info => info[0]).catch(error => console.log(error));
    //console.log(bmInfo);


    const specifics = {
      enabledMods: osuGetMods(lastMap.enabled_mods),
      accuracy: parseInt(getAccuracy(lastMap.count300, lastMap.count100, lastMap.count50, lastMap.countmiss)).toFixed(2),
      drainTime: fmtMSS(bmInfo.total_length),
      mapState: getMapState(bmInfo.approved),
      bmLink: `https://osu.ppy.sh/b/${bmInfo.beatmap_id}`,
      starRating: parseInt(bmInfo.difficultyrating).toFixed(2)
    }

    const Embed = new MessageEmbed()
      .setAuthor(`${bmInfo.title} - ${bmInfo.artist} | ⭐${specifics.starRating} | ${bmInfo.bpm} BPM`, null, specifics.bmLink)
      .setColor("LUMINOUS_VIVID_PINK")
      .setDescription(`**Jugador:** ${query}`)
      .addField("Información del Mapa",
        `**Mapper:** ${bmInfo.creator}\n` +
        `**Dificultad:** ${bmInfo.version}\n` +
        `**AR:** ${bmInfo.diff_approach} **CS:** ${bmInfo.diff_size} **OD:** ${bmInfo.diff_overall} **Drain:** ${bmInfo.diff_drain}\n` +
        `**Duracion:** ${specifics.drainTime}\n` +
        `**Combo Máximo:** ${bmInfo.max_combo}\n` +
        `**Estado:** ${specifics.mapState}`)
      .addBlankField()
      .addField("Puntuación obtenida",
        `**Score:** ${lastMap.score}\n` +
        `**Hits:** 300's: ${lastMap.count300}, 100's: ${lastMap.count100}, 50's: ${lastMap.count50} (No Gekis / Katus)\n` +
        `**Combo:** ${lastMap.maxcombo}\n` +
        `**Precisión:** ${specifics.accuracy}%\n` +
        `**Calificación:** ${lastMap.rank}\n` +
        `**Mods:** ${specifics.enabledMods}`)
      .setFooter(`Powered by osu! API by peppy`, "https://upload.wikimedia.org/wikipedia/commons/e/e3/Osulogo.png");

    return await channel.send(Embed).catch(error => console.log(error));
  } catch (error) {
    console.log("Ocurrio un error en alguna parte de osuLastPlay");
    console.log(error);
  }
}

function fmtMSS(s) { return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s } //Formato Tiempo

function getMapState(state) {
  // 4 = loved, 3 = qualified, 2 = approved, 1 = ranked, 0 = pending, -1 = WIP, -2 = graveyard
  if (parseInt(state) == -2) return "Cementerio 👻";
  if (parseInt(state) == -1) return "En Progreso";
  if (parseInt(state) == 0) return "Pendiente";
  if (parseInt(state) == 1) return "Ranked";
  if (parseInt(state) == 2) return "Aprovado ✔";
  if (parseInt(state) == 3) return "Calificado ✔";
  return "Loved ❤";
}

function getAccuracy(c300, c100, c50, misses) {
  let upper = (50 * parseInt(c50)) + (100 * parseInt(c100)) + (300 * parseInt(c300));
  let lower = 300 * (parseInt(misses) + parseInt(c50) + parseInt(c100) + parseInt(c300));
  return ((upper / lower) * 100);
}

function osuGetMods(bits) {
  let enabledMods = parseInt(bits);
  //Single Mods
  if (enabledMods == 0) return "No Mod";
  if (enabledMods == Mods.NF) return "No Fail";
  if (enabledMods == Mods.EZ) return "Easy";
  if (enabledMods == Mods.Touch) return "Touch";
  if (enabledMods == Mods.HD) return "Hidden";
  if (enabledMods == Mods.HR) return "Hardrock";
  if (enabledMods == Mods.SD) return "Sudden Death";
  if (enabledMods == Mods.DT) return "Double-Time";
  if (enabledMods == Mods.RX) return "Relax";
  if (enabledMods == Mods.HT) return "Half-Time";
  if (enabledMods == Mods.NC) return "Nightcore";
  if (enabledMods == Mods.FL) return "Flashlight";

  //Some Combinations
  if (enabledMods == Mods.NF + Mods.HD) return "NF + HD";
  if (enabledMods == Mods.NF + Mods.HR) return "NF + HR";
  if (enabledMods == Mods.EZ + Mods.HD) return "EZ + HD";
  if (enabledMods == Mods.HD + Mods.HR) return "HD + HR";
  if (enabledMods == Mods.HD + Mods.FL) return "HD + FL";
  if (enabledMods == Mods.HD + Mods.SO) return "HD + SO";
  if (enabledMods == Mods.HT + Mods.HD) return "HT + HD";
  if (enabledMods == Mods.DT + Mods.HD) return "DT + HD";
  if (enabledMods == Mods.NF + Mods.HR + Mods.HD) return "NF + HD + HR";
  if (enabledMods == Mods.EZ + Mods.HD + Mods.DT) return "EZ + HD + DT";
  if (enabledMods == Mods.EZ + Mods.HD + Mods.NC + Mods.DT) return "EZ + HD + NC";
  if (enabledMods == Mods.EZ + Mods.NF + Mods.HD + Mods.DT + Mods.NC) return "EZ+NF+HD+NC";
}