import {errorList} from '../error/errorList.js'
import {userRepository} from '../repositories'

async function createRegistration(signupData){
    const {name, email, password} = signupData;

    const user = await userRepository.getUserByEmail(email)
    if(user)throw errorList.conflict('email')

    const hash =  bcrypt.hashSync(password, 10);
    await userRepository.createUser({name, email, password: hash});

    const recentUser = await userRepository.getUserByEmail({email});
    await userRepository.createUserAccount(recentUser._id);
}

async function signin(signinData){
    const {email, password} = signinData;
 
    const user = await userRepository.getUserByEmail(email);
    if(!user )throw errorList.notFound('email');
    if( !bcrypt.compareSync(password, user.password))throw errorList.unauthorized('Password');
    
    const token = uuid();

    await userRepository.createUserSession({token, userId: user._id })

    return {token};
}

export const userService = {
    createRegistration,
    signin
}