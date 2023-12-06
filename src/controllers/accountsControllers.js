import {accountRepository, userRepository} from '../repositories'

export async function newTransaction(req, res){
    const {typeTransaction} = req.params;
    const {value, description} = req.body;
    const {userId} = res.locals.dataUser
    let newBalance;
    try{
        const account = await accountRepository.getAccountUserById(userId)
        if(typeTransaction === 'entrada'){
             newBalance = Number(account.balance) + Number(value);         
        } else if(typeTransaction === 'saida'){
            newBalance = Number(account.balance) - Number(value);   
        }

        await accountRepository.newTransaction({userId, newBalance, transactions: account.transactions, value, description, typeTransaction})
        
        return res.send('ok');      
    }catch(erro){
        console.log(erro.message)
    }
}

export async function historicTransactions (req, res){
    const {userId} = res.locals.dataUser

    try{

        const account = await accountRepository.getAccountUserById(userId)
        const user = await userRepository.getUserById(userId)

        return res.send({
            balance: account.balance, 
            transactions: account.transactions.reverse(),
            name: user.name
        })


    }catch(erro){
        console.log(erro);
        return res.status(500).send(erro);
    }

}