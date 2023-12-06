import { db } from "../database/databaseConnection";

async function getAccountUserById (userId){
    return account = await db.collection('account').findOne({userId});
}

async function newTransaction (data){
    const {userId, newBalance, transactions, description, value, typeTransaction} = data;
    await db.collection('account').updateOne({userId}, { 
        $set: { 
            balance: newBalance,
            transactions: [...transactions, {
                description,
                value,
                time: Date.now(),
                typeTransaction
            }]
         }})
}

export const accountRepository = {
    getAccountUserById,
    newTransaction
}