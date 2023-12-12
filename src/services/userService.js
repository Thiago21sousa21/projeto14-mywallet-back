import { errorList } from '../error/errorList.js'
import { userRepository } from '../repositories/index.js'
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'

async function createRegistration(signupData) {
    const { name, email, password } = signupData;
    const user = await userRepository.getUserByEmail(email)
    if (user) throw errorList.conflict('email');
    const hash = bcrypt.hashSync(password, 10);
    const result = await userRepository.createUser({ name, email, password: hash });
    if (!result.acknowledged) throw errorList.internal();
    const recentUser = await userRepository.getUserByEmail(email);
    if (!recentUser) throw errorList.internal();
    const createAccount = await userRepository.createUserAccount(recentUser._id);
    if (!createAccount.acknowledged) throw errorList.internal();
}

async function signin(signinData) {
    const { email, password } = signinData;

    const user = await userRepository.getUserByEmail(email);
    if (!user) throw errorList.notFound('email');
    if (!bcrypt.compareSync(password, user.password)) throw errorList.unauthorized('Password');

    const token = uuid();

    await userRepository.createUserSession({ token, userId: user._id })

    return { token };
}

export const userService = {
    createRegistration,
    signin
}