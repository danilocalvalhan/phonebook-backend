const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

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

function validator(val) {
	const numSplitArr = val.split("-").length === 2 ? val.split("-")[0] : false;
	if (numSplitArr.length === 2 || numSplitArr.length === 3) {
		return true;
	} else {
		return false;
	}
}

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true,
		unique: true,
		uniqueCaseInsensitive: true,
	},
	number: {
		type: String,
		minLength: 8,
		validate: validator,
		required: true,
	},
});

personSchema.plugin(uniqueValidator);

personSchema.set("toJSON", {
	transform: (document, returnObject) => {
		returnObject.id = returnObject._id.toString();
		delete returnObject._id;
		delete returnObject.__v;
	},
});

module.exports = mongoose.model("Person", personSchema);
