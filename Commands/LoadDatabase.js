const enmap = require('enmap');

module.exports = {
  MukiSettings: new enmap({name:'settings'}),
  GoLive: new enmap({name:'streamings'}),
  TwitchStream: new enmap({name:'twitch'}),
  YoutubeStream: new enmap({name:'youtube'}),
  nasaLastPicture: new enmap({name:'nasa'}),
  tags: new enmap({name:'tags'}),
  webhooks: new enmap({name:'webhooks'}),
  votes: new enmap({name:'votes'}),
  votesCooldown: new enmap({name: 'cooldown'}),
  osu: new enmap({name:"osu"}),
  guildConfigs: new enmap({name:"guildconfigs"})
}