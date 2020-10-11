const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const responseSchema = new Schema({
	responses: [
		{
			survey: {
				type: Schema.Types.ObjectId,
				ref: "Survey"
			},
			yes: {
				type: Number
			},
			no: {
				type: Number
			}
		}
	]
});

module.exports = mongoose.model("Response", responseSchema);