const { Client, EmbedBuilder, Colors, TextChannel } = require('discord.js')
const { request } = require('undici')

const APIURL = "https://api.gael.cloud/general/public/sismos"
let oldEartquake = null

/**
 * 
 * @param {Client} client 
 */
async function EarthquakeMonitor(client) {

  const newEarthquake = await getEarthquakes().catch((error) => console.error(error))

  if (!newEarthquake) return undefined

  /**
   * @type {TextChannel}
   */
  const channel = client.channels.cache.get("541007291718172683")

  return await channel.send({
    embeds: [newEarthquake]
  })
}

async function getEarthquakes() {

  const getColor = (magnitud) => {

    return parseFloat(magnitud) < 6 ? Colors.Yellow
      : magnitud < 7 ? Colors.Orange
        : magnitud < 8 ? Colors.DarkOrange
          : Colors.Red

  }

  /**
   * @type {[{Fecha: string, Profundidad: string, Magnitud: string, RefGeografica: string, FechaUpdate:string}]} Lista de temblores
   */
  const list = await request(APIURL).then(response => response.body.json())

  if (!list || list.length === 0) return;

  const lastEarthquake = list[0]

  if (lastEarthquake.Fecha === oldEartquake?.Fecha) return null

  oldEartquake = lastEarthquake;

  if (parseFloat(lastEarthquake.Magnitud) >= 5.5) {
    const embed = new EmbedBuilder()
      .setTitle(`Sismo de magnitud ${lastEarthquake.Magnitud} a ${lastEarthquake.RefGeografica}`)
      .setDescription(`**El sismo se registró a una profundidad de ${lastEarthquake.Profundidad}km**\n**Fecha:** \`${lastEarthquake.Fecha}\``)
      .setColor(getColor(lastEarthquake.Magnitud))

    return embed
  }

  return null
}

module.exports = { EarthquakeMonitor }