// We need to tell GraphQL on how our data is arranged and how it can be accessed,
// we do this inside the schema file
// To tell what property/type of data each object has, and relation between data

const graphql = require("graphql");
const _ = require("lodash");
const axios = require("axios");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

const users = [
  { id: "23", firstName: "Bill", age: "20" },
  { id: "27", firstName: "Samantha", age: "21" }
];

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      // RootQuery has expectation of recieving id
      args: { id: { type: GraphQLString } },
      // resolve = used to return data from anywhere (database,API,etc)
      resolve(parentValue, args) {
        // find from users,return first user who has id of args.id (args.id will be provided when the query is made)
        // return _.find(users, { id: args.id });

        // get data from API
        return (
          axios
            .get(`http://localhost:3000/users/${args.id}`)
            // We need to target the "data" inside the response
            .then(resp => resp.data)
        );
      }
    }
  }
});

// Connector
module.exports = new GraphQLSchema({
  query: RootQuery
});
