module.exports = class WarnsLog {
  constructor(guild, member) {
    this.id = "";
    this.warns = 0;
    this.kicks = 0;
    this.mutes = 0;
    this.bans = 0;
  }
}