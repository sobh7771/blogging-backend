const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require("graphql");
const BlogType = require("./types/blog");
const Blog = require("../models/blog");

const mutations = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addBlog: {
      type: BlogType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        body: { type: new GraphQLNonNull(GraphQLString) },
        tags: { type: new GraphQLList(GraphQLString) },
      },
      resolve: (source, { title, body, tags }, req, info) => {
        return Blog.create({
          title,
          body,
          tags,
        });
      },
    },
  },
});

module.exports = mutations;
