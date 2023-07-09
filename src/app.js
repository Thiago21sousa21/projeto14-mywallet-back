import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { v4 as uuid } from "uuid";
import Joi from "joi";



//config
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
dotenv.config();
const mongoClient = new MongoClient(process.env.DATABASE_URL);
try {
    await mongoClient.connect();
    console.log('MONGODB CONECTED');
} catch (error) {
    console.log(error);
}
const db = mongoClient.db();



///SCHEMAS
const signupSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required()
});
const siginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required()
});
const transactionSchema = Joi.object({
    value: Joi.number().positive().required(),
    description: Joi.string().required()
});


app.post('/cadastro', async (req, res) => {
    console.log(req.body);
    const {name, email, password} = req.body;

    const validadion = signupSchema.validate(req.body, {abortEarly: false});
    if(validadion.error){
        console.log('caiu na no schema')
        const errors = validadion.error.details.map((detail)=> detail.message)
        return res.status(422).send(errors);
    }

    try {
        const user = await db.collection('users').findOne({email});
        if(user)return res.status(409).send('Email já cadastrado!');

        const hash =  bcrypt.hashSync(password, 10);
        console.log(hash);
        await db.collection('users').insertOne({
            name,
            email,
            password: hash,
        });

        const recentUser = await db.collection('users').findOne({
            name,
            email,
            password: hash,
        })
        console.log('achou o recent ', recentUser)
        await db.collection('account').insertOne({
            userId: recentUser._id,
            balance: 0,
            transactions: []
        });
        console.log('criou a conta ')

        

        res.sendStatus(201);
    } catch (erro) {
        console.log(erro.message);
    }
})


app.post('/', async (req, res) => {
    console.log(req.body);
    //preciso receber os dados de login que são email e senha
    const {email, password} = req.body;
    const validation = siginSchema.validate(req.body, {abortEarly: false});
    if(validation.error){
        const errors = validation.error.details.map((detail)=> detail.message)
        return res.status(422).send(errors)
    }

    //preciso verificar se existe esse email e  se a senha está correta

    try {
        const user = await db.collection('users').findOne({email});
        if(!user )return res.status(404).send('invalid email');
        if( !bcrypt.compareSync(password, user.password)) return res.status(401).send('invalid password');
        
        const token = uuid();
        await db.collection('sessions').insertOne({
            token,
            userId: user._id 
        })

        res.send({token});

    } catch (erro) {
        console.log(erro.message);
    }
});


app.post('/nova-transacao/:tipo', async(req, res)=>{
    const {tipo} = req.params;
    const {authorization} = req.headers;
    const {value, description} = req.body;

    const validation = transactionSchema.validate(req.body);
    if(validation.error){
        const errors = validation.error.details.map(detail=> detail.message);
        return res.status(422).send(errors);
    }

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

 
});

app.get('/home', async(req, res)=>{
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

});



app.listen(PORT, () => { console.log(`RUNING PORT ${PORT}`) });