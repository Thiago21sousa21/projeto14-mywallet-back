import { db } from "../database/databaseConnection.js";


async function getUserByEmail(email) {
    const user = await db.collection('users').findOne({ email });
    console.log(user)
    return user;
}

async function getUserById(_id) {
    const user = await db.collection('users').findOne({ _id });
    return user;
}

async function createUser(dataToCreation) {
    const user = await db.collection('users').insertOne(dataToCreation);
    return user
}

async function createUserAccount(userId) {
    return await db.collection('account').insertOne({
        userId,
        balance: 0,
        transactions: []
    });
}

async function createUserSession(dataToCreation) {
    await db.collection('sessions').insertOne(dataToCreation)
}

export const userRepository = {
    getUserByEmail,
    createUser,
    createUserAccount,
    createUserSession,
    getUserById
}