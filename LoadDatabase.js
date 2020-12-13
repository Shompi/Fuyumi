const enmap = require('enmap');

module.exports = {
  MukiSettings: new enmap({name:'settings'}),
  GoLive: new enmap({name:'streamings'}),
  TwitchStream: new enmap({name:'twitch'}),
  YoutubeStream: new enmap({name:'youtube'}),
  nasaLastPicture: new enmap({name:'nasa'}),
  tags: new enmap({name:'tags'}),
  votes: new enmap({name:'votes'}),
  votesCooldown: new enmap({name: 'cooldown'}),
  guildConfigs: new enmap({name:"guildconfigs"}),
  guildAutoRoles: new enmap({name: "autoroles"}),
  gameImages: new enmap({name: "gameimages"}),
  enabledStreams: new enmap({ name: "enabledstreams" }),
}