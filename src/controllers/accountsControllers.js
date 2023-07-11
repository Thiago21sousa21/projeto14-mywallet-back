import { db } from "../database/databaseConnection.js";
import { transactionSchema } from "../schemas/accountsSchemas.js";

export async function newTransaction(req, res){
    const {tipo} = req.params;
    const {authorization} = req.headers;
    const {value, description} = req.body;



    const token = authorization?.replace('Bearer ','');
    if(!token)return res.status(401).send('usuario não logado')
    console.log(token);


    try{
        //verifica se o usuario está logado
        const userOn = await db.collection('sessions').findOne({token});
        if(!userOn )return res.status(404).send('usuario não permitido');
        //procura no banco de dados
        const filter = {userId: userOn.userId};
        //console.log(filter,  'tentando entendder o filter')
        const account = await db.collection('account').findOne(filter);
        console.log(account);

        if(tipo === 'entrada'){
            const newBalance = Number(account.balance) + Number(value);
            //console.log(newBalance);
            await db.collection('account').updateOne(filter, { 
                $set: { 
                    balance: newBalance,
                    transactions: [... account.transactions, {
                        description,
                        value,
                        time: Date.now(),
                        tipo
                    }]
                 }})
            //console.log(result )
            return res.send('somado com sucesso');

        } else if(tipo === 'saida'){
            //if(value > user.balance)return res.status(400).send('saida maior que o saldo!');
            const newBalance = Number(account.balance) - Number(value);
            await db.collection('account').updateOne(filter, { 
                $set: { 
                    balance: newBalance,
                    transactions: [... account.transactions, {
                        description,
                        value,
                        time: Date.now(),
                        tipo
                    }]
                 }})
            return res.send('subtraido com sucesso');

        }        
    }catch(erro){console.log(erro.message)}
}

export async function historicTransactions (req, res){
    const {authorization} = req.headers;
    console.log('executando', authorization)

    const token = authorization?.replace('Bearer ','');
    if(!token)return res.status(401).send('usuario não logado')
    console.log(token);

    try{

        const userOn = await db.collection('sessions').findOne({token});
        if(!userOn )return res.status(404).send('usuario não permitido'); 
        const filter = {userId: userOn.userId};
        const account = await db.collection('account').findOne(filter);
        const user = await db.collection('users').findOne({_id: userOn.userId});
        console.log('pegando a user ',user)

        //console.log('pegando a conta ',account)
        return res.send({
            balance: account.balance, transactions: account.transactions,
            name: user.name
        })


    }catch(erro){
        console.log(erro);
        return res.status(500).send(erro);
    }

}