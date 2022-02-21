const { Schema, createConnection } = require('mongoose');

async function establishConnection() {
  console.log("Estableciendo conexión a mongodb/guilds...");
  const connection = await createConnection('mongodb://localhost/guilds').asPromise();
  console.log("Conexión establecida!");

  console.log("Creando schema para guilds...");
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

  console.log("Creando modelo para guilds...");
  return connection.model('Guild', GuildSchema);
}

module.exports = { establishConnection };