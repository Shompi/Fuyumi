const { CommandInteraction, MessageEmbed, Util } = require("discord.js");
const axios = require('axios').default;
const ClubID = "559503";
const matchResult = "wins" || "ties" || "losses";
const teamImageURL = "https://fifa21.content.easports.com/fifa/fltOnlineAssets/05772199-716f-417d-9fe0-988fa9899c4d/2021/fifaweb/crests/256x256/l21.png";

const getResultEmoji = (result) => {
  switch (result) {
    case 'wins':
      return "🟩";
    case 'ties':
      return "⬜";
    case 'losses':
      return "🟥";
    default:
      return "⬛";
  }
}

/**
 * @param {CommandInteraction} interaction 
 */
async function FifaPlayer(interaction) {
  await interaction.deferReply();
  const playerName = interaction.options.getString('pro_name');

  /** @type {[{name: string, gamesPlayed: string, goals: string, assists: string, manOfTheMatch: string, ratingAve: string, favoritePosition: string}] | null} */
  const rooster = await axios.get('https://proclubs.ea.com/api/fifa/members/career/stats?platform=pc&clubId=559503').then(response => response.data.members);

  const member = rooster.find(member => member.name === playerName);

  if (!member)
    return await interaction.editReply({ content: 'No encontré a ningún miembro del club con ese nombre.' });


  const memberEmbed = new MessageEmbed()
    .setAuthor({ name: "Exiliados FC" })
    .setTitle(`${member.name} | ${member.favoritePosition.toUpperCase()} | Rating: ${member.ratingAve}`)
    .setDescription(`**Partidos jugados:** ${member.gamesPlayed}\n**Goles:** ${member.goals}\n**Asistencias:** ${member.assists}\n**MVPs:** ${member.manOfTheMatch}`)
    .setColor(Util.resolveColor('BLUE'))
    .setThumbnail(teamImageURL)
    .setFooter({ text: "Estadísticas de Clubes Pro" })

  return await interaction.editReply({ embeds: [memberEmbed] });
}

/**
 * @param {CommandInteraction} interaction 
 */
async function FifaTeam(interaction) {
  await interaction.deferReply();
  const clubSeasonalStatsURL = "https://proclubs.ea.com/api/fifa/clubs/seasonalStats?platform=pc&clubIds=559503";
  const teamWebURL = "https://www.ea.com/games/fifa/pro-clubs/ps4-xb1-pc/overview?clubId=559503&platform=pc";
  /**
   * @type {{seasons: number, titleswon: number, rankingPoints: string, bestDivision: number, alltimeGoals: string, alltimeGoalsAgainst: string, seasonWins: string, goals: string, goalsAgainst: string, seasonTies: string, wins: string, losses: string, ties: string, seasonLosses: string, gamesPlayed: string, points: string, currentDivision: number, projectedPoints: number, recentResults: [matchResult], totalGames: number}}
   */

  const clubData = await axios.get(clubSeasonalStatsURL).then(response => response.data[0]);
  const divisionImage = `https://media.contentapi.ea.com/content/dam/eacom/fifa/pro-clubs/divisioncrest${clubData.currentDivision}.png`

  const currentSeasonInfo = `**Division:** ${clubData.currentDivision}\n**Puntos:** ${clubData.points}\n**Proyección:** ${clubData.projectedPoints} puntos.\n**Goles:** ${clubData.goals}\n**Goles en contra:** ${clubData.goalsAgainst}\n**Ultimos Partidos:** ${clubData.recentResults.map(result => getResultEmoji(result)).join("-")}`
  const generalInfo = `**Total de partidos jugados:** ${clubData.totalGames}\n**Puntos de Ranking:** ${clubData.rankingPoints}\n**Goles:** ${clubData.alltimeGoals}\n**Goles en contra:** ${clubData.alltimeGoalsAgainst}\n**Ganados:** ${clubData.wins}\n**Empates:** ${clubData.ties}\n**Perdidos:** ${clubData.losses}`

  const teamEmbed = new MessageEmbed()
    .setAuthor({ name: "Exiliados FC", iconURL: teamImageURL, url: teamWebURL })
    .setColor(Util.resolveColor("BLUE"))
    .addFields({
      name: "Información de la Temporada Actual", value: currentSeasonInfo
    }, {
      name: "Información General", value: generalInfo
    })
    .setThumbnail(divisionImage);

  return await interaction.editReply({ embeds: [teamEmbed] });
}




module.exports = {
  FifaPlayer,
  FifaTeam,
}