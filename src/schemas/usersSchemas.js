import Joi from "joi";


export const signupSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required()
});

export const siginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required()
});