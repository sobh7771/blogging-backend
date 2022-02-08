const { PORT, NODE_ENV } = process.env;

if (NODE_ENV === "development") {
  require("dotenv").config();
}

require("./db/mongoose");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema");

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(PORT, () => console.log(`Server is up on ${PORT}`));
