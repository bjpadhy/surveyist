const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type surveyResponse {
        survey: Survey!
        yes: Int!
        no: Int!
    }
    type Response {
        responses: [surveyResponse]
    }
    type User {
        _id: ID!
        username: String!
        createdSurveys: [Survey!]
    }
    type Survey {
        _id: ID!
        title: String!
        questions: [String!]!
        author_name: String!
        author_id: ID!
        createdAt: String!
    }
    type allSurveys {
        surveys: [Survey]
        totalSurveys: Int!
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
        getAllSurveys: allSurveys!
        getSurvey(_id: ID!): Survey!
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);