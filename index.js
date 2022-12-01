const express = require("express");
const app = express();

let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.use(express.json());

app.get("/info", (request, response) => {
	const currentDate = new Date();
	response.send(`
		<p>Phonebook has info for ${persons.length} people</p>
		<p>${currentDate}</p>
		`);
});

app.get("/api/persons", (request, response) => {
	response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	const person = persons.find((person) => person.id === id);
	person ? response.json(person) : response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter((person) => person.id !== id);

	response.status(204).end();
});

app.post("/api/persons", (request, response) => {
	const randomId = Math.floor(Math.random()*(10**9))
	const newPerson = request.body
	console.log(newPerson, randomId)
	newPerson.id = randomId
	persons = persons.concat(newPerson)

	response.status(201)
	response.json(newPerson)
})

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on PORT ${PORT}`);
