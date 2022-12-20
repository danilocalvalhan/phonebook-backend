const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log(
		"Please provide the password as an argument: node mongo.js <password>"
	);
	process.exit(1);
}

if (process.argv.length === 4) {
	console.log("Please provide a Name and Number");
	process.exit(9);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://Danilo:${password}@cluster0.u9dh8wv.mongodb.net/Phonebook?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model("Person", personSchema);

mongoose.set("strictQuery", true);

if (process.argv.length === 3) {
	mongoose.connect(url).then((result) => {
		console.log("phonebook:")
		Person.find({}).then((people) => {
			people.forEach((person) => {
				console.log(`${person.name} ${person.number}`);
			});
		mongoose.connection.close();
		});
	});
} else {
	mongoose
		.connect(url)
		.then((result) => {
			const person = new Person({
				name: name,
				number: number,
			});
			console.log(
				`Added ${person.name} number ${person.number} to phonebook`
			);
			return person.save();
		})
		.then(() => {
			return mongoose.connection.close();
		})
		.catch((err) => console.log(err));
}
