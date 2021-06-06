const { Presence, MessageEmbed } = require('discord.js');
const TWOHOURS = 1000 * 60 * 60 * 2; // 2 Horas.
const enmap = require('enmap');
const database = new enmap({ name: 'streamings' });


/**
 * @param {Presence} old 
 * @param {Presence} now 
 */
module.exports = async (old, now) => {

	console.log("GOLIVE TRIGGERED");
}