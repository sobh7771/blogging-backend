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
const { isLoggedIn } = require("../utils");

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
        isLoggedIn(req);

        return Blog.create({
          author: req.user.id,
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
        isLoggedIn(req);

        return Blog.findOneAndUpdate(
          { _id: id, author: req.user.id },
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
      async resolve(_, { id }, req) {
        isLoggedIn(req);

        return Blog.findOneAndDelete({ _id: id, author: req.user.id });
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
    logout: {
      type: UserType,
      resolve(_, __, req) {
        const { user } = req;
        req.logout();

        return user;
      },
    },
    login: {
      type: new GraphQLNonNull(UserType),
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(source, { email, password }, req, info) {
        const user = await User.findByCredentials(email, password);

        return new Promise((resolve, reject) => {
          req.login(user, (err) => {
            if (err) {
              return reject();
            }

            resolve(user);
          });
        });
      },
    },
    follow: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      async resolve(_, { id }, req) {
        const currAuthUser = isLoggedIn(req);
        const user = await User.findById(id);

        if (!user) {
          throw new Error("Not Found");
        }

        currAuthUser.following = [...currAuthUser.following, id];
        user.followers = [...user.followers, currAuthUser._id];

        Promise.all[(currAuthUser.save(), user.save())];
      },
    },
    unfollow: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      async resolve(source, { id }, req, info) {
        const currAuthUser = isLoggedIn(req);
        const user = await User.findById(id);

        if (!user) {
          throw new Error("Not Found");
        }

        currAuthUser.following = currAuthUser.following.filter(
          (fId) => fId + "" !== id
        );

        user.followers = user.followers.filter(
          (fId) => fId + "" !== currAuthUser.id + ""
        );

        Promise.all[(currAuthUser.save(), user.save())];
      },
    },
  },
});

module.exports = mutations;
