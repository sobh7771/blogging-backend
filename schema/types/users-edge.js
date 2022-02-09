const { GraphQLObjectType, GraphQLInt, GraphQLList } = require("graphql");

const UsersEdge = new GraphQLObjectType({
  name: "UsersEdge",
  fields: () => ({
    total: { type: GraphQLInt },
    nodes: {
      type: new GraphQLList(require("./user")),
    },
  }),
});

module.exports = UsersEdge;
