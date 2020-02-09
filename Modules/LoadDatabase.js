const enmap = require('enmap');

module.exports = {
  settings: new enmap({name:'settings'}),
  streamings: new enmap({name:'streamings'}),
  nasaLastPicture: new enmap({name:'nasa'}),
  tags: new enmap({name:'tags'}),
  webhooks: new enmap({name:'webhooks'}),
  votes: new enmap({name:'votes'}),
  osu: new enmap({name:"osu"})
}