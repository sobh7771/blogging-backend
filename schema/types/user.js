const graphql = require("graphql");
const { GraphQLDateTime } = require("graphql-scalars");

const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;

const UserType = new GraphQLObjectType({
  name: "User",
  fields() {
    return {
      id: {
        type: GraphQLID,
      },
      name: {
        type: GraphQLString,
      },
      email: {
        type: GraphQLString,
      },
      createdAt: {
        type: GraphQLDateTime,
      },
      updatedAt: {
        type: GraphQLDateTime,
      },
    };
  },
});

module.exports = UserType;
