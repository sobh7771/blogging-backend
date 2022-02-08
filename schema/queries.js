const { GraphQLObjectType, GraphQLString } = require("graphql");

const queries = new GraphQLObjectType({
  name: "Query",
  fields: {
    hello: {
      type: GraphQLString,
      resolve() {
        return "world";
      },
    },
  },
});

module.exports = queries;
