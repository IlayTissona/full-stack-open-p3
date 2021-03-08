const mongoose = require("mongoose");
// const password = "TNTAKHUCK";
const password = process.argv[2];

const url = `mongodb+srv://ilay-tissona:${password}@firsttestcluster.0m2ja.mongodb.net/phoneBookDataBase?retryWrites=true&w=majority`;

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

if (!process.argv[3]) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
    id: process.argv[5],
  });
  person.save().then((result) => {
    console.log(`added ${result.name} - ${result.number} to phoneBook`);
    mongoose.connection.close();
  });
}
