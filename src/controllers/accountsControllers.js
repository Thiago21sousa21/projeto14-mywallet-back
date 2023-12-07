import { accountService } from '../services/index.js'

export async function newTransaction(req, res) {
    const { typeTransaction } = req.params;
    const { value, description } = req.body;
    const { userId } = res.locals.dataUser

    await accountService.newTransaction({ typeTransaction, value, description, userId })
    res.send('ok');
}

export async function historicTransactions(req, res) {
    const { userId } = res.locals.dataUser

    const result = await accountService.historicTransactions(userId)
    return res.send(result)

}