/**
 * @param DATE_FORMAT = YYYY-MM-DD
 * @see https://puu.sh/EDzA4/a72290a062.png
 * @author NASA
 * @description This module will get the pic of the from NASA API and throw it through a webhook to a Discord text channel.
 * @endpoint https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY
 * @response JSON
 * Nasa hook:
 * ID: 
 * Token:
 */
const { MessageEmbed, Webhook } = require('discord.js');
const { NASAkey } = require('../../Keys/auth');
const endpoint = `https://api.nasa.gov/planetary/apod?api_key=${NASAkey}`
const fetch = require('node-fetch');
const database = require('../LoadDatabase');

const imageEmbed = (response) => {
  const embed = new MessageEmbed()
    .setTitle(response.title)
    .setColor("BLUE")
    .setDescription(`${response.explanation}`)
    .setFooter(`${  response.date ? response.date : Date()} - NASA API Astronomy Picture of the Day`);

  if (response.media_type == 'image') embed.setImage(response.hdurl);
  if (response.media_type == 'video') embed.attachFiles([response.url]);

  return embed;
}

module.exports = async (Hook = new Webhook()) => {
  try {
    const response = await fetch(endpoint).then(res => res.json());
    let lastPicDate = database.nasaLastPicture.get('LASTPIC');
    console.log(lastPicDate + "   " + response.date);
    if (lastPicDate != response.date) {

      database.nasaLastPicture.set('LASTPIC', response.date);
      return Hook.send(imageEmbed(response));

    } else return console.log('La foto de la NASA no ha cambiado.');
  } catch (error) {
    if(error.code === 'ETIMEDOUT') {
      console.log("El request a la API de la NASA ha excedido el tiempo límite.\nETIMEDOUT.");
    }
  }
}