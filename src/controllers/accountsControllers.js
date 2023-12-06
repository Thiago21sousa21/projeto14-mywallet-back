import { db } from "../database/databaseConnection.js";

export async function newTransaction(req, res){
    const {typeTransaction} = req.params;
    const {value, description} = req.body;
    const {filter} = res.locals
    let newBalance;
    try{
        const account = await db.collection('account').findOne(filter);
        if(typeTransaction === 'entrada'){
             newBalance = Number(account.balance) + Number(value);         
        } else if(typeTransaction === 'saida'){
            newBalance = Number(account.balance) - Number(value);   
        }  
            await db.collection('account').updateOne(filter, { 
                $set: { 
                    balance: newBalance,
                    transactions: [... account.transactions, {
                        description,
                        value,
                        time: Date.now(),
                        typeTransaction
                    }]
                 }})
            return res.send('ok');      
    }catch(erro){
        console.log(erro.message)
    }
}

export async function historicTransactions (req, res){
    const {filter, userOn} = res.locals;

    try{

        const account = await db.collection('account').findOne(filter);
        const user = await db.collection('users').findOne({_id: userOn.userId});

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