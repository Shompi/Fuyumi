const { MessageEmbed, VoiceState } = require('discord.js');
const TWOHOURS = 1000 * 60 * 60 * 2; // 2 Horas.
const enmap = require('enmap');

const database = new enmap({ name: 'streamings' });

/**
 * @param {VoiceState} old 
 * @param {VoiceState} now 
 */
module.exports = async (old, now) => {

}