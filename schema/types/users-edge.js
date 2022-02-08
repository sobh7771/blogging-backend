const { GraphQLObjectType, GraphQLInt, GraphQLList } = require("graphql");
const UserType = require("./user");

const UsersEdge = new GraphQLObjectType({
  name: "UsersEdge",
  fields: {
    total: { type: GraphQLInt },
    // nodes: {
    //   type: new GraphQLList(UserType),
    // },
  },
});

module.exports = UsersEdge;
