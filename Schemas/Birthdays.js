const { Schema, createConnection } = require('mongoose');

async function getBirthdayModel() {
  console.log("Estableciendo conexión a mongodb/birthdays...");
  const connection = await createConnection('mongodb://localhost/birthdays').asPromise();

  console.log("Conexión establecida!");

  console.log("Creando schema para birthdays...");
  const BirthdaySchema = new Schema({
    month: Number,
    day: Number,
    userId: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    retries: {
      type: Number,
      default: 3
    },
    isSent: {
      type: Boolean,
      default: false
    }
  });

  console.log("Creando modelo para birthdays...");
  return connection.model('Birthday', BirthdaySchema);
}

module.exports = { getBirthdayModel }