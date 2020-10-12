const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type User {
        _id: ID!
        username: String!
        createdSurveys: [Survey!]
    }
    type surveyResponse {
        yes: Int
        no: Int
    }
    type surveyForm {
        question: String!
        response: surveyResponse
    }
    type Survey {
        _id: ID!
        title: String!
        author_name: String!
        author_id: ID!
        questionnaire: [surveyForm!]!
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
    input surveyQuestion {
        question: String!
    }
    input surveyInputData{
        title: String!
        questions: [surveyQuestion!]!
    }
    type RootMutation {
        register(username: String!, password: String!): newUser!
        createSurvey(surveyInput: surveyInputData): Survey!
        takeSurvey(_id: ID!, answerData: [Boolean!]!): String!
    }
    type RootQuery {
        login(username: String!, password: String!): AuthData!
        getAllUserSurveys: allSurveys!
        getSurvey(_id: ID!): Survey!
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);