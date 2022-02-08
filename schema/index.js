const { GraphQLSchema } = require("graphql");
const queries = require("./queries");
const mutations = require("./mutations");

module.exports = new GraphQLSchema({ query: queries, mutation: mutations });
