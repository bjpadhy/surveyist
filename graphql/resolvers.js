const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Survey = require("../models/survey");

module.exports = {
	// Register new user
	register: async function ({ username, password }) {
		const errors = [];

		// Error Handling
		if (validator.isEmpty(username) || validator.isEmpty(password)) {
			errors.push({ description: "Username or Password cannot be empty." });
		}
		// Existing User Check
		const existingUser = await User.findOne({ username: username });
		if (existingUser) {
			errors.push({ description: "User already exists" });
		}
		if (errors.length > 0) {
			const error = new Error("Invalid Input.");
			error.data = errors;
			throw error;
		}

		// Hash Password and create User
		const hashedPw = await bcrypt.hash(password, 12);
		const user = new User({
			username: username,
			password: hashedPw
		});
		const createdUser = await user.save();
		return { ...createdUser._doc, _id: createdUser._id.toString() };
	},

	// Login a registered user
	login: async function ({ username, password }) {
		// Check whether user exists
		const user = await User.findOne({ username: username });
		if (!user) {
			const error = new Error("Unregistered user. Please register first.");
			throw error;
		}
		// Password matching
		const isCorrect = await bcrypt.compare(password, user.password);
		if (!isCorrect) {
			const error = new Error("Incorrect password.");
			error.code = 401;
			throw error;
		}
		// Token generation
		const token = jwt.sign({
			userID: user._id.toString(),
			username: user.username
		}, `${process.env.JWT_SECRET}`, { expiresIn: "1h" });
		return { token: token, userID: user._id.toString() };
	},

	// Create a new user
	createSurvey: async function ({ surveyInput }){
		// Required to skip Object prototype attached to args by default
		const inputData = JSON.parse(JSON.stringify(surveyInput));

		// Error handling
		const errors = [];
		if (validator.isEmpty(inputData.title) || !validator.isLength(inputData.title, { min: 1})){
			errors.push({ description: "Title cannot be empty." });
		}
		if (inputData.questions.length < 1) {
			errors.push({ description: "At least 1 question required." });
		}
		if (errors.length > 0) {
			const error = new Error("Invalid Input.");
			error.data = errors;
			throw error;
		}
		const survey = new Survey({
			title: inputData.title,
			questions: inputData.questions
		});
		const createdSurvey = await survey.save();
		return { ...createdSurvey._doc, _id: createdSurvey._id.toString(), questions: createdSurvey.questions, createdAt: createdSurvey.createdAt.toISOString() };
	}
};