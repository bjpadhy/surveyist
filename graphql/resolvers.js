const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../models/user");

module.exports = {
	register: async function( args ) {
		var userCredential = JSON.parse(JSON.stringify(args));
		const username = userCredential.credentials.username;
		const password = userCredential.credentials.password;
		const errors = [];
		if(validator.isEmpty(username) || validator.isEmpty(password)) {
			errors.push({description: "Username or Password cannot be empty."});
			const error = new Error("Invalid Input.");
			error.data = errors;
			throw error;
		}

		const existingUser = await User.findOne({ username: username });
		if (existingUser) {
			errors.push({description: "User already exists"});
			const existingUserError = new Error("Invalid Input.");
			existingUserError.data = errors;
			throw existingUserError;
		}
		const hashedPw = await bcrypt.hash(password, 12);
		const user = new User({
			username: username,
			password: hashedPw
		});
		const createdUser = await user.save();
		return { ...createdUser._doc, _id: createdUser._id.toString() };
	}
};