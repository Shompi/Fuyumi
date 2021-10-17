const CREDENTIALS = require('./config.json');
const axios = require('axios').default;
const keyv = require('keyv');
const tokens = new keyv("sqlite://twitchtokens.sqlite", { namespace: 'twitchtokens' });
const defaultCover = "https://puu.sh/F2ZUN/ea3856ca91.png";


const axiosInstance = axios.create({
  baseURL: "https://api.igdb.com/v4",
  timeout: 1500,
});

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


  const url = `https://id.twitch.tv/oauth2/token?client_id=${CREDENTIALS.clientId}&client_secret=${CREDENTIALS.clientSecret}&grant_type=client_credentials`;
  const response = await axios({
    method: 'POST',
    url: url
  });

  const { access_token, expires_in } = response.data;

  // Actualizamos la token en nuestra base de datos
  await tokens.set('token', { token: access_token, expires: (expires_in * 1000) + Date.now() });

  return tokens.get('token').token;
}

/** @param {string} gamename */
const getGameCoverByName = async (gamename) => {

  /**@type {{
    id: number,
    cover:number,
    name: string
  }} */

  const access_token = await getAccessToken();

  const response = await axiosInstance({
    url: '/covers',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Client-ID': CREDENTIALS.clientId,
      'Authorization': `Bearer ${access_token}`
    },
    data: `fields url; where game.name = "${gamename}";`
  });
  /**@type {{id: number, url: string}} */
  const cover = response.data[0];

  if (!cover)
    return console.log(defaultCover);

  return console.log(`https:${cover.url.replace("t_thumb", "t_720p")}`);
}

module.exports = {
  getGameCoverByName
}