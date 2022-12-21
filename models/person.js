const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log("Connecting to ", url);
mongoose.set("strictQuery", true);
mongoose
	.connect(url)
	.then((result) => {
		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		console.log("Unable to connect to MongoDB, error: ", error.message);
	});

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

personSchema.set("toJSON", {
	transform: (document, returnObject) => {
		returnObject.id = returnObject._id.toString();
		delete returnObject._id;
		delete returnObject.__v;
	},
});

module.exports = mongoose.model("Person", personSchema);
