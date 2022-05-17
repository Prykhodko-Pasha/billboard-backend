const { ApolloServer, gql } = require("apollo-server");
const { responsePathAsArray } = require("graphql");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Bill {
    title: String!
    text: String
    author: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    role: Role!
    token: String
  }

  enum Role {
    USER
    MODERATOR
    SUPERADMIN
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    bills: [Bill]
    user(id: ID!): User
    users: [User!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User!
  }
`;

const users = [
  {
    id: 1,
    name: "Pasha",
    email: "pasha@gmail.com",
    password: "123456",
    role: "SUPERADMIN",
    token: null,
  },
  {
    id: 2,
    name: "Ira",
    email: "ira@gmail.com",
    password: "123456",
    role: "USER",
    token: null,
  },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    bills: () => bills,
    users: () => users,
    user(parent, args, context, info) {
      const { id } = args;
      return users.filter((user) => user.id === Number(id))[0];
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
