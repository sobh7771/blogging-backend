const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
} = require("graphql");
const BlogType = require("./types/blog");
const Blog = require("../models/blog");
const BlogInputType = require("./types/input/blog");
const UserType = require("./types/user");
const User = require("../models/user");

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
    editBlog: {
      type: BlogType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
        blog: {
          type: new GraphQLNonNull(BlogInputType),
        },
      },
      async resolve(source, { id, blog }, req, info) {
        return Blog.findOneAndUpdate(
          { _id: id },
          { $set: blog },
          { new: true }
        );
      },
    },
    deleteBlog: {
      type: BlogType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      async resolve(source, { id }, req, info) {
        return Blog.findOneAndDelete({ _id: id });
      },
    },
    signup: {
      type: new GraphQLNonNull(UserType),
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
        },
        email: {
          type: new GraphQLNonNull(GraphQLString),
        },
        password: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      async resolve(_, { name, email, password }, req) {
        return new Promise(async (resolve, reject) => {
          try {
            const user = await User.create({ name, email, password });

            req.login(user, (err) => {
              if (err) reject(err);

              resolve(user);
            });
          } catch (err) {
            reject(err);
          }
        });
      },
    },
  },
});

module.exports = mutations;
