class MukiConfigs {
  constructor(configs) {
    this.status = configs.status || "online";
    this.prefix = configs.prefix || "muki!";
    this.activityType = configs.activityType || "LISTENING";
    this.activityTo = configs.activityTo || "muki!";
  }
}

module.exports = { MukiConfigs };