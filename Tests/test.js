import { ButtonBuilder, ButtonStyle } from "discord.js";

console.log(new ButtonBuilder()
  .setStyle(ButtonStyle.Link)
  .setCustomId('customid')
  .setLabel('Press me'));