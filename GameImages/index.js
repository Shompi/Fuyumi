const { clientId, clientSecret } = require('./config.json');
const { request } = require('undici');
const keyv = require('keyv');
const tokens = new keyv("sqlite://twitchtokens.sqlite", { namespace: 'twitchtokens' });
const imagesLocalDB = new keyv("sqlite://gameimages.sqlite", { namespace: 'gameimages' });
const defaultCover = "https://puu.sh/F2ZUN/ea3856ca91.png";

const baseURL = "https://api.igdb.com/v4"

const getAccessToken = async () => {

  /**
  * @type {{token: string, expires: number}}
  */

  const token = await tokens.get('token');

  if (token) {
    // Chequear el tiempo de expiración

    // Si el tiempo de expiración del token que tenemos en la base de datos es mayor al tiempo actual
    // entonces nuestra token aún está activa
    if (token.expires >= Date.now()) return token.token;
  }


  const url = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;
  const response = await request(url, { method: 'POST' }).then(response => response.body.json()).catch(() => null);

  if (!response) return;

  const { access_token, expires_in } = response;

  // Actualizamos la token en nuestra base de datos
  console.log("Se actualizó la token de IGDB");
  await tokens.set('token', { token: access_token, expires: (expires_in * 1000) + Date.now() });

  return await tokens.get('token').token;
}

/**
 *
 * @param {String} gamename
 * @returns {Promise<String>} url de la imagen del juego
 */
const getGameCoverByName = async (gamename) => {

  // Primero chequemos que la imágen esté en la base de datos

  const savedImage = await imagesLocalDB.get(gamename).catch(() => null);

  if (savedImage) return savedImage;

  const access_token = await getAccessToken();

  if (!access_token) return;

  const response = await request(baseURL + "/covers", {
    headers: {
      'accept': 'application/json',
      'Client-ID': clientId,
      'authorization': `Bearer ${access_token}`
    },
    method: 'POST',
    body: `fields url; where game.name = "${gamename}";`
  }).then(response => response.body.json());

  /**@type {{id: number, url: string}} */
  const cover = response[0];
  console.log("Response from api:", response);
  if (!cover) return defaultCover;

  console.log(`Juego sin imagen: ${gamename}`);

  const formatedUrl = `https:${cover.url.replace("t_thumb", "t_720p")}`;

  // Guardamos la imagen a nuestra base de datos para evitar futuras consultas a la API
  await imagesLocalDB.set(gamename, formatedUrl);

  return formatedUrl;
}

module.exports = { getGameCoverByName }