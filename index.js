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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
