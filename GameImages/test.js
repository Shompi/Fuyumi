const axios = require('axios').default;
const CREDENTIALS = require('./config.json');

const url = `https://id.twitch.tv/oauth2/token?client_id=${CREDENTIALS.clientId}&client_secret=${CREDENTIALS.clientSecret}&grant_type=client_credentials`;
axios({
  method: 'POST',
  url: url
}).then(response => console.log(response));