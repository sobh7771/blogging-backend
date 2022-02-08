const { GraphQLObjectType, GraphQLInt, GraphQLID } = require("graphql");
const Blog = require("../models/blog");
const BlogType = require("./types/blog");
const BlogsEdgeType = require("./types/blogs-edge");

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
  },
});

module.exports = queries;
