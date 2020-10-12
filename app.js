// Server and Database Imports
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const path = require("path");

// Middleware Imports
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// GraphQL Init
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");
const auth = require("./middleware/auth");
const app = express();

// Middlewares
app.use(compression());
app.use(helmet());
app.use(cors());

// Serve static documentation files
app.use("/docs", express.static(path.join(__dirname, "public")));

// Init GraphQL and custom format errors
app.use(auth);
app.use(
	"/graphql",
	graphqlHTTP({
		schema: graphqlSchema,
		rootValue: graphqlResolver,
		graphiql: true,
		customFormatErrorFn(error) {
			if (!error.originalError) {
				return error;
			}
			const status = error.originalError.code || 500;
			const data = error.originalError.data;
			const message = error.message || "An Error Occurred.";
			return { statusCode: status, message: message, data: data };
		}
	})
);

// Handle wildcard redirect all
app.use("*", (req, res) => {
	res.redirect("/docs");
});

// Server Start
const PORT = process.env.PORT || 8080;
mongoose.connect(
	`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@survey-cluster.bkbjh.gcp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));
}).catch(err => console.log(err));