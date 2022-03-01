const axios = require('axios').default;
// Divison image https://media.contentapi.ea.com/content/dam/eacom/fifa/pro-clubs/divisioncrest7.png
// Team image https://fifa21.content.easports.com/fifa/fltOnlineAssets/05772199-716f-417d-9fe0-988fa9899c4d/2021/fifaweb/crests/256x256/l21.png

axios.get('https://proclubs.ea.com/api/fifa/members/career/stats?platform=pc&clubId=559503')
  .then(response => console.log(response.data));