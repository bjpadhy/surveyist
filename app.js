const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const app = express();
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var root = { hello: () => "Hello world!" };

// Middlewares
app.use(compression());
app.use(helmet());
app.use(cors());

app.use("/graphql", graphqlHTTP({
	schema: schema,
	rootValue: root,
	graphiql: true,
}));

// Server Start
app.listen(8080 || process.env.PORT, () => console.log("Now browse to localhost:8080/graphql"));