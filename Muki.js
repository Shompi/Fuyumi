const AkairoClient = require('./Classes/AkairoClient');

const client = new AkairoClient();

client.login(require('./Keys/auth').beta);