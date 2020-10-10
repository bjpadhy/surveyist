const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = {
	// Register new user
	register: async function ({ username, password }) {
		const errors = [];

		// Validation
		if (validator.isEmpty(username) || validator.isEmpty(password)) {
			errors.push({ description: "Username or Password cannot be empty." });
			const error = new Error("Invalid Input.");
			error.data = errors;
			throw error;
		}

		// Existing User Check
		const existingUser = await User.findOne({ username: username });
		if (existingUser) {
			errors.push({ description: "User already exists" });
			const existingUserError = new Error("Invalid Input.");
			existingUserError.data = errors;
			throw existingUserError;
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
		// Check if user exists
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
	}
};