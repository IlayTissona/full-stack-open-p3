const express = require("express");
const app = express();
const PORT = 3001;
const morgan = require("morgan");

app.use(express.json());
// app.use(requestLogger);
app.use(morgan("tiny"));

let persons = [
  {
    id: 1,
    name: "Ilay Tissona",
    number: "0536204048",
  },
  {
    id: 2,
    name: "Ilay Txcvsona",
    number: "0536265048",
  },
  {
    id: 3,
    name: "Ilay Tighnona",
    number: "0531578048",
  },
  {
    id: 4,
    name: "Ilay Tsvsona",
    number: "0536597328",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const date = new Date().toString();
  res.send(
    `<div>Phone-book has info for ${persons.length} people.</div><div> ${date} </div>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  const person = persons.find((person) => person.id === Number(id));
  if (person) res.json(person);
  else res.sendStatus(404);
});

app.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  const person = persons.find((person) => person.id === Number(id));
  if (person) {
    persons = persons.filter((person) => person.id !== Number(id));
    res.sendStatus(200);
  } else res.sendStatus(404);
});

app.post("/api/persons", (req, res) => {
  const requestedPerson = req.body;
  if (!requestedPerson.number || !requestedPerson.name)
    return res
      .status(400)
      .json({ error: "person must have a name and a number" });
  let existing = persons.find((person) => person.name === requestedPerson.name);
  if (existing)
    return res
      .status(400)
      .json({ error: "Requested name has already been taken" });

  const id = Math.floor(Math.random() * 100);
  requestedPerson.id = id;
  persons.push(requestedPerson);
  res.send(requestedPerson);
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
