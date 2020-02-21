module.exports = {
  Presence: {
    Twitch: require('./EventHandler/Presence/Twitch'),
    GoLive: require('./EventHandler/voiceStateUpdate/GoLive')
  },
  Guild: {
    MemberRemove: require('./EventHandler/Guild/memberRemove/main'),
    MemberAdd: require('./EventHandler/Guild/memberAdd/main'),
  }
}
