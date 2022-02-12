const { GuildModel } = require('./Schemas/Guild')

GuildModel.deleteMany({}).then(() => { return null });