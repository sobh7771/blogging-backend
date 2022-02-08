const graphql = require("graphql");
const { GraphQLDateTime } = require("graphql-scalars");
const UsersEdge = require("./users-edge");

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList, GraphQLInt } =
  graphql;

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
      followers: {
        type: UsersEdge,
        resolve: ({ followers }) => ({ total: followers.length }),
      },
      following: {
        type: UsersEdge,
        resolve: ({ following }) => ({ total: following.length }),
      },
    };
  },
});

module.exports = UserType;
