module.exports = class {
  constructor(guild) {
    this.id = guild.id;
    this.adminRole = null;
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