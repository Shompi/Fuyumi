import { ButtonBuilder, ButtonStyle } from "discord.js";

console.log(new ButtonBuilder()
  .setStyle(ButtonStyle.Primary)
  .setCustomId('customid')
  .setLabel('Press me'));