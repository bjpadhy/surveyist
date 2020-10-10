// Server and Database Imports
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

// Middleware Imports
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// Graphql Init
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");

const app = express();

// Middlewares
app.use(compression());
app.use(helmet());
app.use(cors());

app.use(
	"/graphql",
	graphqlHTTP({
		schema: graphqlSchema,
		rootValue: graphqlResolver,
		graphiql: true
	})
);

// Server Start
mongoose.connect(
	`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@survey-cluster.bkbjh.gcp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true}
).then(() => {
	app.listen(8080 || process.env.PORT, () => console.log("Server running on port 8080!"));
}).catch(err => console.log(err));