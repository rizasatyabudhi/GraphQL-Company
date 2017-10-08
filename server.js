const express = require("express");

// Glue for express and GraphQL
const expressGraphQL = require("express-graphql");
const schema = require("./schema/schema.js");
const app = express();

//Apply expressGraphQL as middleware
app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true
  })
);

app.listen(4000, () => {
  console.log("listening");
});
