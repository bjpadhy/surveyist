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
    type newUser {
        _id: ID!
        username: String!
    }
    type AuthData {
        token: String!
        userID: String!
    }
    input surveyInputData{
        title: String!
        questions: [String!]!
    }
    type RootMutation {
        register(username: String!, password: String!): newUser!
        createSurvey(surveyInput: surveyInputData): Survey!
    }
    type RootQuery {
        login(username: String!, password: String!): AuthData!
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);