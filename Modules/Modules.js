module.exports = {
  Help: {

  },
  Tags: require('./Tags/Tags'),
  Vote: require('./Vote/Vote'),
  Minecraft: require('./Minecraft/Query'),
  Osu: {
    osuLastPlay: require('./Osu/OsuLastPlay'),
    osuProfile: require('./Osu/OsuProfile'),
    osuTops: require('./Osu/TopPlay')
  },
  Boorus: {
    Yandere: require('./Boorus/Yandere'),
    Konachan: require('./Boorus/Kona'),
    KonaSafe: require('./Boorus/KonaSafe'),
    TagSearch: require('./Boorus/Tags')
  },
  Nekos: require('./NekosLife/Nekos'),
  Tablon: require('./tablonFotos'),
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
      ChangeRegion: require('./Guild/VoiceRegion')
    }
  },

  GuildInfo: {
    Info: require('./Guild/Info'),
    RoleInfo: require('./Guild/RoleInfo')
  },

  GuildConfigs: {
    Prefix: require('./Guild/Prefix'),
    AddWelcomePhrase: require('./Guild/AddPhrase'),
    RemoveWelcomePhrase: require('./Guild/RemovePhrase'),
    WelcomeChannel: require('./Guild/WelcomeChannel'),
    ToggleWelcomeChannel: require('./Guild/WelcomeToggle')
  },

  Music: {
    Volume: require('./Music/Volume'),
    Play: require('./Music/Play'),
    Moan: require('./Music/Moan')
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