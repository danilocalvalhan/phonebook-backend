require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

morgan.token("post_data", (request) => {
	const bodyString = JSON.stringify(request.body);
	return bodyString.length > 2 ? bodyString : "";
});
app.use(cors());
app.use(express.json());
app.use(express.static("build"));
app.use(
	morgan(function (tokens, req, res) {
		return [
			tokens.method(req, res),
			tokens.url(req, res),
			tokens.status(req, res),
			tokens.res(req, res, "content-length"),
			"-",
			tokens["response-time"](req, res),
			"ms",
			tokens.post_data(req, res),
		].join(" ");
	})
);

app.get("/info", (request, response) => {
	const currentDate = new Date();
	Person.estimatedDocumentCount({}).then((count) => {
		response.send(`
			<p>Phonebook has info for ${count} people</p>
			<p>${currentDate}</p>
			`);
	});
});

app.get("/api/persons", (request, response) => {
	Person.find({}).then((people) => {
		response.json(people);
	});
});

app.get("/api/persons/:id", (request, response, next) => {
	const id = request.params.id;
	Person.findById(id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then((result) => {
			if (result) {
				response.status(204).end();
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
	const newPerson = new Person({
		name: request.body.name,
		number: request.body.number,
	});
	if (newPerson.name == false || newPerson.number == false) {
		return response.status(400).json({
			error: "name or number is missing",
		});
	} else {
		newPerson
			.save()
			.then(() => {
				return response.status(201).json(newPerson);
			})
			.catch((error) => next(error));
	}
});

app.put("/api/persons/:id", (request, response, next) => {
	const newPerson = {
		name: request.body.name,
		number: request.body.number,
	};

	Person.findByIdAndUpdate(request.params.id, newPerson, {
		new: true,
		runValidators: true,
		context: "query",
	})
		.then((result) => {
			if (result) {
				response.json(result);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
	console.log(error);

	if (error.name === "CastError") {
		response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		response.status(400).json({ error: error.message });
	}
	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on PORT ${PORT}`);
