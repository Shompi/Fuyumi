const { Schema, createConnection } = require('mongoose');

const connection = createConnection('mongodb://localhost/guilds')

const GuildSchema = new Schema({
  id: String,
  name: String,
  iconURL: String,
  memberCount: Number,
  channelCount: Number,
  owner: {
    tag: String,
    avatarURL: String
  }
});

const GuildModel = connection.model('Guild', GuildSchema);

module.exports = { GuildModel };
