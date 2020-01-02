const Keyv = require('keyv');
const database = new Keyv('sqlite://./Databases/configs.sqlite');
database.on('error', err => console.log('Connection Error on Configs Database', err));
module.exports = async (configs) => {


  try{
   await database.set("configs", configs)
    console.log("Configuraciones actualizadas.");
    //console.log(configs);
  }catch(error){
    console.log("Error en configs database", error);
  }
}