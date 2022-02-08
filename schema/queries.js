const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList,
} = require("graphql");
const Blog = require("../models/blog");
const BlogType = require("./types/blog");
const BlogsEdgeType = require("./types/blogs-edge");
const UserType = require("./types/user");
const User = require("../models/user");
const { isLoggedIn } = require("../utils");

const queries = new GraphQLObjectType({
  name: "Query",
  fields: {
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
      async resolve(source, { cursor, limit }, req, info) {
        const count = await Blog.find().countDocuments();

        const nodes = await Blog.find()
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
    blog: {
      type: BlogType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve(_, { id }) {
        return Blog.findById(id);
      },
    },
    viewer: {
      type: UserType,
      resolve(source, args, req, info) {
        return req.user;
      },
    },
    recommendations: {
      type: new GraphQLNonNull(new GraphQLList(UserType)),
      async resolve(source, { size = 4 }, req, info) {
        isLoggedIn(req);

        const { user } = req;

        const users = await User.aggregate([
          { $match: { _id: { $nin: [...user.following, user._id] } } },
          { $sample: { size } },
        ]);

        return users.map((user) => {
          user = { ...user, id: user._id };
          return user;
        });
      },
    },
  },
});

module.exports = queries;
