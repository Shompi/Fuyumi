/**
 * @param DATE_FORMAT = YYYY-MM-DD
 * @see https://puu.sh/EDzA4/a72290a062.png
 * @author NASA
 * @description This module will get the pic of the from NASA API and throw it through a webhook to a Discord text channel.
 * @endpoint https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY
 * @response JSON
 * Nasa hook:
 * ID: 643700164602626058
 * Token:
 */
const { MessageEmbed, Webhook } = require('discord.js');
const NASA = require('../../Classes/NASA');
const endpoint = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASAKEY}`
const keyv = require('keyv');
const fetch = require('node-fetch');


module.exports = async (Hook = new Webhook()) => {
  let error = false;
  const db = new keyv("sqlite://./Databases/NASALASTPIC.sqlite")
    .on('error', (error) => console.log("Error en NASA POTD " + error));
  
  const fetchInfo = await fetch(endpoint).then(res => res.json()).catch(error => {
    console.log(error.message);
    console.log(error.code);
    error = true;
    return;
  });
  if (error) return console.log("Hubo un error en NASA POTD.");
  const response = new NASA.POTD(fetchInfo);
  const lastPic = await db.get("lastPic").catch(error => console.log(error));
  const embed = new MessageEmbed()
    .setTitle(response.title)
    .setImage(response.url)
    .setColor("BLUE")
    .setDescription(`${response.explanation}\n${response.hdurl}`)
    .setFooter(`${response.date ? response.date : Date()} - NASA API Astronomy Picture of the Day`);

  if (!lastPic) {
    await db.set("lastPic", response).catch(error => console.log(error));
    return await Hook.send(embed).catch(error => console.log(error));
  } else {
    if (lastPic.date == response.date) return undefined;
    await db.set("lastPic", response);
    return await Hook.send(embed).catch(error => console.log(error));
  }

}