import {userService} from '../services'
import httpStatus from 'http-status';

export async function createRegistration(req, res){
    await userService.createRegistration(req.body)
    return res.sendStatus(httpStatus.CREATED);
}

export async function signin(req, res){
    const result = await userService.signin(req.body)
    res.send(result)
}