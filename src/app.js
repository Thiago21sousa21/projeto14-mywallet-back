import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt'

//config
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
dotenv.config();
const mongoClient = new MongoClient(process.env.BASE_URL);
try {
    await mongoClient.connect();
    console.log('MONGODB CONECTED');
} catch (error) {
    console.log(error);
}
const db = mongoClient.db();

app.post('/cadastro', async (req, res) => {
    console.log(req.body);
    const {name, email, password} = req.body;

    try {
        const user = await db.collection('users').findOne({email});
        if(user)return res.status(409).send('Email já cadastrado!');

        const hash =  bcrypt.hashSync(password, 10);
        console.log(hash);
        await db.collection('users').insertOne({
            name,
            email,
            password: hash
        });
        res.sendStatus(201);
    } catch (erro) {
        console.log(erro.message);
    }
})


app.post('/', async (req, res) => {
    console.log(req.body);
    //preciso receber os dados de login que são email e senha
    const {email, password} = req.body;
    //preciso verificar se existe esse email e  se a senha está correta

    try {
        const user = await db.collection('users').findOne({email});
        if(!user )return res.status(404).send('invalid email');
        if( !bcrypt.compareSync(password, user.password)) return res.status(401).send('invalid password');
        res.send('ok');

    } catch (erro) {
        console.log(erro.message);
    }
})



app.listen(PORT, () => { console.log(`RUNING PORT ${PORT}`) });