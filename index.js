require("dotenv").config();
const fs = require("fs");
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

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/info", (req, res) => {
  Person.find({}).then((persons) => {
    const date = new Date().toString();
    res.send(
      `<div>Phone-book has info for ${persons.length} people.</div><div> ${date} </div>`
    );
  });
});

app.get("/api/persons/:personId", (req, res) => {
  const { personId } = req.params;
  Person.find({ id: personId }).then((person) => {
    if (person) res.json(person);
    else res.sendStatus(404);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  Person.findOneAndDelete({ id }).then((result) => {
    res.send("OK");
  });
});

app.post("/api/persons", (req, res) => {
  const requestedPerson = req.body;
  if (!requestedPerson.number || !requestedPerson.name)
    return res
      .status(400)
      .json({ error: "person must have a name and a number" });

  Person.find({ name: requestedPerson.name }).then((person) => {
    if (person.length) {
      return res
        .status(400)
        .json({ error: "Requested name has already been taken" });
    } else {
      requestedPerson.id = generateID(process.env.ID_LENGTH);
      const person = new Person(requestedPerson);
      person.save().then(() => {
        res.send(requestedPerson);
      });
    }
  });
});

app.use(unknownEndpoint);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//----------------------------------------middleWares----------------------------------------------

function requestLogger(request, response, next) {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
}

function unknownEndpoint(request, response) {
  response.status(404).send({ error: "unknown endpoint" });
}

morgan.token("body", function (req, res) {
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

  const existingIds = JSON.parse(fs.readFileSync(process.cwd() + "/ids.json"));
  const isExists = existingIds.some((val) => val === id);

  if (isExists) {
    return generateID(length);
  }
  existingIds.push(id);
  fs.writeFileSync(process.cwd() + "/ids.json", JSON.stringify(existingIds));
  return id;
}
