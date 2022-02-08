const graphql = require("graphql");
const { GraphQLDateTime } = require("graphql-scalars");

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const BlogType = new GraphQLObjectType({
  name: "Blog",
  fields() {
    return {
      id: {
        type: GraphQLID,
      },
      title: {
        type: GraphQLString,
      },
      img: {
        type: GraphQLString,
      },
      body: {
        type: GraphQLString,
      },
      updatedAt: {
        type: GraphQLDateTime,
      },
      createdAt: {
        type: GraphQLDateTime,
      },
      tags: {
        type: new GraphQLList(GraphQLString),
      },
    };
  },
});

module.exports = BlogType;
