module.exports = {
  Help: {

  },
  Vote: require('./Vote/Vote'),
  Minecraft: require('./Minecraft/Query'),
  Osu: {
    osuLastPlay: require('./Osu/osuLastPlay'),
    osuProfile: require('./Osu/osuProfile'),
    osuTops: require('./Osu/topPlay')
  },
  Boorus: {
    Yandere: require('./Boorus/Yandere'),
    Konachan: require('./Boorus/Kona'),
    KonaSafe: require('./Boorus/KonaSafe'),
    TagSearch: require('./Boorus/Tags')
  },
  Nekos: require('./NekosLife/Nekos'),
  Tablon: require('./tablonFotos'),
  ChangeRegion: require('./ServerManagement/voiceRegion'),
  SaveConfigs: require('./saveConfig'),
  Currencies: require('./Currency/Currencies'),
  Discord: {
    Status: require('./Discord/Status')
  },
  NASA: {
    POTD: require('./NASA/POTD')
  },

  eventHandlers: {
    Presence: {
      Twitch: require('./EventHandler/Presence/Twitch'),
      GoLive: require('./EventHandler/voiceStateUpdate/GoLive')
    },
    Guild: {
      MemberRemove: require('./EventHandler/Guild/memberRemove/main'),
      MemberAdd: require('./EventHandler/Guild/memberAdd/main'),
    }
  },

  GuildInfo: {
    Info: require('./Guild/info'),
    RoleInfo: require('./Guild/RoleInfo')
  },
  /*BattleMetrics: {
    Rust: require('./BattleMetrics/Servers/Rust')
  },*/

  AnimeFLV: {
    Search: require('./AnimeFLV/Search')
  },
  AdminCommands: {
    MicMute: require('./Admin/MicMute'),
    CreateChannel: require('./Admin/CreateChannel')
  },
  DiscordJS: require('./DiscordJS/Docs')
}