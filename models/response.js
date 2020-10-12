const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const responseSchema = new Schema({
	responses: [
		{
			survey: {
				type: Schema.Types.ObjectId,
				ref: "Survey"
			},
			totalResponses: {
				type: Number
			},
			answers: {
				type: [Boolean]
			}
		}
	]
});

module.exports = mongoose.model("Response", responseSchema);