module.exports = {
  Presence: {
    Twitch: require('./Events/Presence/Twitch'),
  },
  VoiceStateUpdate: {
    GoLive: require('./Events/voiceStateUpdate/GoLive')
  },
  Guild: {
    MemberAdd: require('./Events/Guild/memberAdd'),
    MemberRemove: require('./Events/Guild/memberRemove'),
  },
  ReactionAdd: {
    Stars: require('./Events/Stars/Stars')
  }
}
