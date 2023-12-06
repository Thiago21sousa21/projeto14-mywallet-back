import bcrypt from 'bcrypt';
import { v4 as uuid } from "uuid";
import {userRepository} from '../repositories'

export async function createRegistration(req, res){
    console.log(req.body);
    const {name, email, password} = req.body;

    try {
        
        const user = await userRepository.getUserByEmail(email)
        if(user)return res.status(409).send('Email já cadastrado!');

        const hash =  bcrypt.hashSync(password, 10);
        
        await userRepository.createUser({name, email, password: hash});

        const recentUser = await userRepository.getUserByEmail({email});

        await userRepository.createUserAccount(recentUser._id);

        res.sendStatus(201);
    } catch (erro) {
        res.status(500).send(erro);
    }
}

export async function signin(req, res){
    const {email, password} = req.body;

    try {
        const user = await userRepository.getUserByEmail(email)
        if(!user )return res.status(404).send('invalid email');
        if( !bcrypt.compareSync(password, user.password)) return res.status(401).send('invalid password');
        
        const token = uuid();

        await userRepository.createUserSession({token, userId: user._id })

        res.send({token});

    } catch (erro) {
        console.log(erro.message);
    }
}