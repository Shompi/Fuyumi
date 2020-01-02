class ServerInfo {
  constructor(info) {
    this.data = {
      type: info.data.type,
      id: info.data.id,
      attributes: {
        name: new String(info.data.attributes.name),
        ip: info.data.attributes.ip,
        players: info.data.attributes.players,
        maxPlayers: info.data.attributes.maxPlayers,
        rank: info.data.attributes.rank,
        status: new String(info.data.attributes.status),
        country: info.data.attributes.country,
        details: {
          map: info.data.attributes.details.map,
          environment: info.data.attributes.details.environment,
          rust_description: info.data.attributes.details.rust_description,
          rust_headerimage: info.data.attributes.details.rust_headerimage,
          rust_description: info.data.attributes.details.rust_description,
          rust_queued_players: info.data.attributes.details.rust_queued_players,
          rust_last_wipe: info.data.attributes.details.rust_last_wipe,
        }
      },
      relationships: {
        game: {
          data: {
            type: info.data.relationships.game.data.type,
            id: info.data.relationships.game.data.id
          }
        }
      }
    }
  }
}

module.exports = { ServerInfo }