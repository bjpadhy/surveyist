const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Response {
        response: [Boolean]
    }
    type Survey {
        _id: ID!
        title: String!
        questions: [String!]!
        author: User!
        responses: [Response]
        createdAt: String!
    }
    type User {
        _id: ID!
        username: String!
        surveys: [Survey!]
    }
    input userCredential {
        username: String!
        password: String!
    }
    type RootMutation {
        register(credentials: userCredential): User!
    }
    type RootQuery {
        hello: String
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);