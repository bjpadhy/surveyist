const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const surveySchema = new Schema(
	{
		title: {
			type: String,
			required: true
		},
		questions: [String],
		responses: [
			{
				response: {
					type: [ Boolean ]
				}
			}
		],
		author: {
			type: Schema.Types.ObjectId,
			ref: "User"
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Survey", surveySchema);