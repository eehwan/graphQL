import { ApolloServer, gql } from "apollo-server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
        createUser(name: String!, nickName: String): User!
        deleteUser(id: ID!): Boolean!
        postSale(address: String!, userId: ID!): Sale!
        deleteSale(id: ID!): Boolean!
    }
`;

const resolvers = {
    Query: {
        async allUsers() {
            return await prisma.user.findMany();
        },
        async user(_, { id }) {
            return await prisma.user.findUnique({ where: { id: Number(id) } });
        },
        async allSales() {
            return await prisma.sale.findMany({ include: { author: true } });
        },
        async sale(_, { id }) {
            return await prisma.sale.findUnique({ where: { id: Number(id) }, include: { author: true } });
        },
        ping() {
            return "pong";
        },
    },
    
    Mutation: {
        async createUser(_, { name, nickName }) {
            return await prisma.user.create({
                data: { name, nickName },
            });
        },
        async deleteUser(_, { id }) {
            try {
                await prisma.user.delete({ where: { id: Number(id) } });
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },
        async postSale(_, { address, userId }) {
            return await prisma.sale.create({
                data: {
                    address,
                    author: { connect: { id: Number(userId) } },
                },
                include: { author: true },
            });
        },
        async deleteSale(_, { id }) {
            try {
                await prisma.sale.delete({ where: { id: Number(id) } });
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
