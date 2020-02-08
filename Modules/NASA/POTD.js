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
const fetch = require('node-fetch');
const database = require('../LoadDatabase');


module.exports = async (Hook = new Webhook()) => {
  try {
    const fetchInfo = await fetch(endpoint).then(res => res.json());
    const response = new NASA.POTD(fetchInfo);
    let lastPicDate = database.nasaLastPicture.get('LASTPIC');

    if (lastPicDate != response.date) {
      const embed = new MessageEmbed()
        .setTitle(response.title)
        .setImage(response.url)
        .setColor("BLUE")
        .setDescription(`${response.explanation}\n${response.hdurl}`)
        .setFooter(`${response.date ? response.date : Date()} - NASA API Astronomy Picture of the Day`);


      database.nasaLastPicture.set('LASTPIC', response.date);
      return await Hook.send(embed);
    }
    return console.log('La foto de la NASA no ha cambiado.');
  } catch (error) {
    console.log(error);
  }
}