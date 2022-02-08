const { PORT, NODE_ENV, COOKIE_KEY } = process.env;

if (NODE_ENV === "development") {
  require("dotenv").config();
}

require("./db/mongoose");
require("./services/passport");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const cookie = require("cookie-session");
const passport = require("passport");
const schema = require("./schema");

const app = express();

app.use(
  cookie({
    httpOnly: true,
    secure: NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [COOKIE_KEY],
    sameSite: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(PORT, () => console.log(`Server is up on ${PORT}`));
