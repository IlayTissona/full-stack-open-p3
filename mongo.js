const mongoose = require("mongoose");
require("dotenv").config();
const password = process.env.DB_PASSWORD;

const url = process.env.DB_URL.replace("PASSWORD", password);

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
});

const Person = mongoose.model("Person", personSchema);

module.exports = mongoose.model("Person", personSchema);
