const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const surveySchema = new Schema(
	{
		title: {
			type: String,
			required: true
		},
		questions: {
			type: [String],
			required: true
		},
		author_name: {
			type: String,
			required: true
		},
		author_id: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Survey", surveySchema);