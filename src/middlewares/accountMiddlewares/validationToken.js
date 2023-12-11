import { db } from "../../database/databaseConnection.js";

export async function validationToken (req, res, next){

    const {authorization} = req.headers;
    const token = authorization?.replace('Bearer ','');
    if(!token)return res.status(401).send('usuario não logado');

    try{
        const userOn = await db.collection('sessions').findOne({token});
        if(!userOn )return res.status(404).send('usuario não permitido');
        res.locals.dataUser  = {userId: userOn.userId, token};
        next();
    }catch(erro){
        res.status(500).send(erro.message)
    }
}