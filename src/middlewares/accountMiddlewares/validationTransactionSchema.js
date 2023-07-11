import { transactionSchema } from "../../schemas/accountsSchemas.js";

export function validationFormTransaction(req, res, next){
    const validation = transactionSchema.validate(req.body);
    if(validation.error){
        const errors = validation.error.details.map(detail=> detail.message);
        return res.status(422).send(errors);
    }
    next();
}

