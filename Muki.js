const MukiClient = require('./Classes/MukiClient');

const client = new MukiClient();

client.login(require('./Keys/auth').stable);