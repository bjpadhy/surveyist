const bcrypt = require("bcryptjs");
const User = require("../models/user");

module.exports = {
	register: async function( args ) {
		var userCredential = JSON.parse(JSON.stringify(args));
		const username = userCredential.credentials.username;
		const password = userCredential.credentials.password;
        
		const existingUser = await User.findOne({ username: username });
		if (existingUser) {
			const error = new Error("User already exists!");
			throw error;
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