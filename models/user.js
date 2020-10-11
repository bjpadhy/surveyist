const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	createdSurveys: [
		{
			type: Schema.Types.ObjectId,
			ref: "Survey"
		}
	]
});

module.exports = mongoose.model("User", userSchema);