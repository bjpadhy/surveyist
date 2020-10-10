const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const surveySchema = new Schema(
	{
		title: {
			type: String,
			required: true
		},
		questions: {
			type: [ String ],
			required: true
		},
		responses: [
			{
				response: {
					type: [ Boolean ]
				}
			}
		],
		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Survey", surveySchema);