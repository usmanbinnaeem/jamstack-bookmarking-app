const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb'),
  q = faunadb.query;
  require('dotenv').config()

   var client = new faunadb.Client({ secret: process.env.FAUNADB_ADMIN_SECRET });

const typeDefs = gql`
  type Query {
    bookmark: [Bookmark!]
  }
  type Bookmark {
    id: ID!
    url: String!
    desc: String!
  }

  type Mutation {
    addBookMark(url: String, desc: String): Bookmark
    delBookmark(id: ID!): Bookmark
  }
`

const resolvers = {
  Query: {
    bookmark: async () => {
      try {
        let result = await client.query(
          q.Map(
            q.Paginate(
              q.Match(q.Index("all_links")
            )
          ), q.Lambda(x => q.Get(x))
        ))
        return result.data.map(d => {
          return {
            id: d.ref.id,
            url: d.data.url,
            desc: d.data.desc 
          }
        })
      } catch (error) {
        return error
      }
    },
  },

  Mutation: {
    addBookMark : async (_,{url, desc}) => {
      console.log('url', url, 'desc', desc);
      try {
      var result = await client.query(
        q.Create(
          q.Collection('links'),
          { data: {
            url,
            desc
          } },
        )
      );
      return result.ref.data;
      
    } 
    catch (error){
        console.log('Error: ');
        console.log(error);
    }
    },
     delBookmark: async (_, { id }) => {
      try {
        const result = await client.query(
          q.Delete(q.Ref(q.Collection("links"), id))
        )
        return result.data
      } catch (error) {
        return error
      }
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = server.createHandler()

module.exports = { handler }
