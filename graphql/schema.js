const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type surveyResponse {
        survey: Survey!
        yes: Int
        no: Int
    }
    type Response {
        responses: [surveyResponse]
    }
    type User {
        _id: ID!
        username: String!
        surveys: [Survey]
    }
    type Survey {
        _id: ID!
        title: String!
        questions: [String!]!
        author: User!
        createdAt: String!
    }
    type newUser {
        _id: ID!
        username: String!
    }
    type AuthData {
        token: String!
        userID: String!
        username: String!
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
        viewSurveys: 
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);