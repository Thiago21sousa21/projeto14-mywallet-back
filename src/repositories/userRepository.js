import { db } from "../database/databaseConnection";


async function getUserByEmail(email){
    const user = await db.collection('users').findOne({email});
    return user;
}

async function createUser(dataToCreation){
    await db.collection('users').insertOne(dataToCreation);
}

async function createUserAccount(userId){
    await db.collection('account').insertOne({
        userId,
        balance: 0,
        transactions: []
    });
}

async function createUserSession (dataToCreation){
    await db.collection('sessions').insertOne(dataToCreation)
}

export const userRepository = {
    getUserByEmail,
    createUser,
    createUserAccount, 
    createUserSession
}