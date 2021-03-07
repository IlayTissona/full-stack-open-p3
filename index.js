const express = require("express");
const app = express();
const PORT = 3001;
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
