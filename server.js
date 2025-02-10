import { ApolloServer, gql } from "apollo-server";
import fs from 'fs';

const rawData = fs.readFileSync('./dummy.json'); // JSON 파일 읽기
const { Users, Sales } = JSON.parse(rawData); // JSON 파싱

const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        nickName: String
    }
    type Sale {
        id: ID!
        address: String!
        author: User
    }
    type Query {
        allUsers: [User!]!
        user(id: ID!): User
        allSales: [Sale!]!
        sale(id: ID!): Sale
        ping: String!
    }
    type Mutation {
        postSale(address: String!): Sale!
        deleteSale(id: ID!): Boolean!
    }
`

const resolvers = {
    Query: {
        allUsers() {
            return Users
        },
        user(root, { id }) {
            return Sales.find((sale) => sale.id === id);
        },
        allSales() {
            return Sales
        },
        sale(root, { id, address}) {
            filteredSales = Sales
            if (id) {
                filteredSales.find((sale) => sale.id === id);
            }
            if (address) {
                filteredSales.find((sale) => sale.address === address);
            }
            return filteredSales
        },
        ping() {
            return 'pong';
        },
    },

    Mutation: {
        postSale(root, { address }) {
            const newSale = {
                id: Sales.length + 1,
                address
            }
            Sales.push(newSale);
            return newSale;
        },
        deleteSale(root, { id }) {
            const index = Sales.findIndex((sale) => sale.id === id);
            if (index !== -1) {
                Sales.splice(index, 1);
                return true
            }
            return false
        },
    }
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then((url) => {
    console.log(url)
})

