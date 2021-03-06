// We need to tell GraphQL on how our data is arranged and how it can be accessed,
// we do this inside the schema file
// To tell what property/type of data each object has, and relation between data

const graphql = require("graphql");
const _ = require("lodash");
const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const users = [
  { id: "23", firstName: "Bill", age: "20" },
  { id: "27", firstName: "Samantha", age: "21" }
];

const CompanyType = new GraphQLObjectType({
  name: "Company",
  // we need to use arrow function to fix Circular Reference Gotcha
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      // for 1 to Many relationship
      type: new GraphQLList(UserType),
      // parentValue == instance of company that we currently working with
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(res => res.data);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    // Make relation between user and company
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(res => res.data);
      }
    }
  })
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
            .then(res => res.data)
        );
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then(res => res.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // the fields in mutation refer to the name of the operation
    addUser: {
      // type = type of data that will be returned
      type: UserType,
      args: {
        // GraphQLNonNull == required to fill
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { firstName, age }) {
        return axios
          .post(`http://localhost:3000/users`, { firstName, age })
          .then(res => res.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }) {
        return axios
          .delete(`http://localhost:3000/users/${id}`)
          .then(res => res.data);
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios
          .patch(
            `http://localhost:3000/users/${args.id}`,
            // args.firstName,
            // args.age,
            // args.companyId, can be destructured as
            args
          )
          .then(res => res.data);
      }
    }
  }
});

// Connector
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
