import { db } from "../database/databaseConnection.js";
import bcrypt from 'bcrypt';
import { v4 as uuid } from "uuid";

export async function createRegistration(req, res){
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
        res.status(500).send(erro);
    }
}

export async function signin(req, res){
    console.log(req.body);
    const {email, password} = req.body;

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
}