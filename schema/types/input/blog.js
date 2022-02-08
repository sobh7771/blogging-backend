const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLList,
} = require("graphql");

const BlogInputType = new GraphQLInputObjectType({
  name: "BlogInput",
  fields: {
    title: {
      type: GraphQLString,
    },
    img: {
      type: GraphQLString,
    },
    body: {
      type: GraphQLString,
    },
    tags: {
      type: new GraphQLList(GraphQLString),
    },
  },
});

module.exports = BlogInputType;
