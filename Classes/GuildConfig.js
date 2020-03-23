module.exports = class {
  constructor(guild) {
    this.id = guild.id;
    this.name = guild.name;
    this.prefix = "muki!";
    this.welcome = {
      enabled: false,
      channelID: null,
      joinPhrases: [],
      leavePhrases: []
    }
  }
}