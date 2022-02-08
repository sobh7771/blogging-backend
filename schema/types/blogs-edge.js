const graphql = require("graphql");
const BlogType = require("./blog");

const { GraphQLObjectType, GraphQLList, GraphQLInt } = graphql;

const BlogsEdgeType = new GraphQLObjectType({
  name: "BlogsEdge",
  fields: {
    nodes: {
      type: new GraphQLList(BlogType),
    },
    nextCursor: {
      type: GraphQLInt,
    },
    total: {
      type: GraphQLInt,
    },
  },
});

module.exports = BlogsEdgeType;
