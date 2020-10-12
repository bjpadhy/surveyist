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
		// _id is not a scalar graphql type and hence needs type conversion
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
		// _id is not a scalar graphql type and hence needs type conversion
		return { token: token, userID: user._id.toString(), username: user.username };
	},

	// Create a new survey
	createSurvey: async function ({ surveyInput }, request) {
		// Check if request is authenticated
		if (!request.isAuth) {
			const error = new Error("Unauthenticated! Please login to create a survey.");
			error.code = 401;
			throw error;
		}

		// Required to skip Object prototype attached to args by default
		const inputData = JSON.parse(JSON.stringify(surveyInput));

		// Error handling
		const errors = [];
		if (validator.isEmpty(inputData.title) || !validator.isLength(inputData.title, { min: 1 })) {
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

		// Get user to attach to survey
		const user = await User.findById(request.userID);
		if (!user) {
			const error = new Error("Cannot get user at this time. Please try again later.");
			error.code = 401;
			throw error;
		}
		let surveyForm = [];
		inputData.questions.forEach(element => {
			let tempObj = {
				question: element.question,
				response: {
					yes: 0,
					no: 0
				}
			};
			surveyForm.push(tempObj);
		});
		const survey = new Survey({
			title: inputData.title,
			author_name: user.username,
			author_id: user._id,
			questionnaire: surveyForm
		});
		const createdSurvey = await survey.save();
		user.createdSurveys.push(createdSurvey);
		await user.save();
		// _id and timestamp is not a scalar graphql type and hence needs type conversion
		return { ...createdSurvey._doc, _id: createdSurvey._id.toString(), questions: createdSurvey.questions, createdAt: createdSurvey.createdAt.toISOString() };
	},

	// Get all surveys for logged-in user
	getAllUserSurveys: async function (args, request) {
		// Check if request is authenticated
		if (!request.isAuth) {
			const error = new Error("Unauthenticated! Please login to create a survey.");
			error.code = 401;
			throw error;
		}
		const surveys = await Survey.find({ author_id: request.userID.toString() });
		if (!surveys) {
			const error = new Error("No surveys! Please create a survey to view");
			throw error;
		}
		return {
			totalSurveys: surveys.length, 			
			// _id and timestamp is not a scalar graphql type and hence needs type conversion
			surveys: surveys.map(s => {
				return {
					...s._doc,
					_id: s._id.toString(),
					createdAt: s.createdAt.toISOString()
				};
			})
		};
	},

	// Get specific survey
	getSurvey: async function ({_id}, request) {
		// Check if request is authenticated
		if (!request.isAuth) {
			const error = new Error("Unauthenticated! Please login to create a survey.");
			error.code = 401;
			throw error;
		}

		// Get survey by Survey ID
		const survey = await Survey.findById(_id);
		if (!survey) {
			const error = new Error("Survey not found.");
			error.code = 404;
			throw error;
		}
		// _id and timestamp is not a scalar graphql type and hence needs type conversion
		return { ...survey._doc, _id: survey._id.toString(), createdAt: survey.createdAt.toISOString() };
	},
 
	// Take a survey
	takeSurvey: async function (args){
		console.log(args);
		return "Your response has been recorded. Thank you for taking the survey.";
	}
};