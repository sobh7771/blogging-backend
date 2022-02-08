const { GraphQLObjectType, GraphQLString } = require("graphql");

const mutations = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    hello: {
      type: GraphQLString,
      resolve() {
        return "world";
      },
    },
  },
});

module.exports = mutations;
