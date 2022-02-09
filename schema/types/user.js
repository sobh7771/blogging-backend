const graphql = require("graphql");
const { GraphQLDateTime } = require("graphql-scalars");
const BlogsEdgeType = require("./blogs-edge");
const UsersEdge = require("./users-edge");
const Blog = require("../../models/blog");
const User = require("../../models/user");

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
        resolve: async ({ following }) => {
          const users = await User.find({ _id: { $in: following } });

          return { total: following.length, nodes: users };
        },
      },
      blogs: {
        type: BlogsEdgeType,
        args: {
          cursor: {
            type: GraphQLInt,
            defaultValue: 0,
          },
          limit: {
            type: GraphQLInt,
            defaultValue: 3,
          },
        },
        async resolve(user, { cursor, limit }, req, info) {
          const count = await Blog.find({ author: user.id }).countDocuments();

          const nodes = await Blog.find({ author: user.id })
            .skip(cursor)
            .limit(limit)
            .sort({ _id: -1 });
          const len = nodes.length;
          let nextCursor = len + cursor;

          if (nextCursor >= count) nextCursor = null;

          return {
            nodes,
            nextCursor,
            total: count,
          };
        },
      },
    };
  },
});

module.exports = UserType;
