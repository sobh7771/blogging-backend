const NODE_ENV = process.env.NODE_ENV || "development";

if (NODE_ENV === "development") {
  require("dotenv").config();
}

console.log(process.env.PORT);

require("./db/mongoose");
require("./services/passport");
const path = require("path");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const cookie = require("cookie-session");
const passport = require("passport");
const schema = require("./schema");

const app = express();
const public = path.join(__dirname, "./build");
const port = process.env.PORT;

app.use(
  cookie({
    httpOnly: true,
    secure: NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
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

app.use(express.static(public));
app.get("*", (req, res) => {
  res.sendFile(path(public, "./index.html"));
});

app.listen(port, () => console.log(`Server is up on ${port}`));
