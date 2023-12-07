import httpStatus from 'http-status'
import { errorList } from '../error/errorList.js'
import { accountRepository, userRepository } from '../repositories/index.js'

export async function newTransaction(transactionData) {
    const { typeTransaction, value, description, userId } = transactionData;
    let newBalance;
    
    const account = await accountRepository.getAccountUserById(userId)
    if(!account) throw errorList.internal();

    if (typeTransaction === 'entrada') {
        newBalance = Number(account.balance) + Number(value);
    } else if (typeTransaction === 'saida') {
        newBalance = Number(account.balance) - Number(value);
    }

    const result = await accountRepository.newTransaction({ userId, newBalance, transactions: account.transactions, value, description, typeTransaction })
    if(!result.acknowledged)throw errorList.internal();
}

export async function historicTransactions(userId) {
    const account = await accountRepository.getAccountUserById(userId)
    const user = await userRepository.getUserById(userId)
    if(!account || !user) throw errorList.internal();
    return {
        balance: account.balance,
        transactions: account.transactions.reverse(),
        name: user.name
    }
}

export const accountService = {
    newTransaction,
    historicTransactions
}