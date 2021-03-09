require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const morgan = require("morgan");
const Person = require("./mongo.js");

app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :body - :response-time ms"
  )
);

app.use("/", express.static("./build/"));

app.get("/", (req, res) => {
  res.sendFile("./index.html");
});

app.get("/api/persons", (req, res, next) => {
  Person.find({}).then(res.json).catch(next);
});

app.get("/info", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      const date = new Date().toString();
      res.send(
        `<div>Phone-book has info for ${persons.length} people.</div><div> ${date} </div>`
      );
    })
    .catch(next);
});

app.get("/api/persons/:personId", (req, res, next) => {
  const { personId } = req.params;
  Person.find({ id: personId })
    .then((person) => {
      if (person) res.json(person);
      else res.sendStatus(404);
    })
    .catch(next);
});

app.delete("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;
  Person.findOneAndDelete({ id })
    .then(() => {
      res.send("OK");
    })
    .catch(next);
});

app.post("/api/persons", (req, res, next) => {
  const requestedPerson = req.body;
  if (!requestedPerson.number || !requestedPerson.name)
    return res
      .status(400)
      .json({ error: "person must have a name and a number" });

  Person.find({ name: requestedPerson.name })
    .then((person) => {
      if (person.length) {
        return res
          .status(400)
          .json({ error: "Requested name has already been taken" });
      } else {
        requestedPerson.id = generateID(process.env.ID_LENGTH);
        const person = new Person(requestedPerson);
        person
          .save()
          .then(() => {
            res.send(requestedPerson);
          })
          .catch(next);
      }
    })
    .catch(next);
});

app.put("/api/persons/:personid", (req, res, next) => {
  const { number } = req.body;
  const { personid } = req.params;
  console.log("PUT RECIEVED!");
  Person.findOneAndUpdate({ id: personid }, { number }, { new: true })
    .then((dbRes) => {
      console.log(dbRes);
      res.send(dbRes);
    })
    .catch(next);
});

app.use(errorHandler);
app.use(unknownEndpoint);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//----------------------------------------middleWares----------------------------------------------

function unknownEndpoint(request, response) {
  response.status(404).send({ error: "unknown endpoint" });
}

function errorHandler(error, req, res) {
  res.status(500).send(error);
}

morgan.token("body", function (req) {
  return JSON.stringify(req.body);
});

//----------------------------------------Functions------------------------------------
function generateID(length) {
  const chars =
    "abcdefghijklmnopqrstuvwxtzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charsArr = chars.split("");
  let id = "";

  for (let i = 0; i < length; i++) {
    id += charsArr[Math.floor(Math.random() * 62)];
  }

  return id;
}
