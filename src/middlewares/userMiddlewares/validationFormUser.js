
export function validationFormUser(schema){
    return (req, res, next)=>{
        const validadion = schema.validate(req.body, {abortEarly: false});
        if(validadion.error){
            const errors = validadion.error.details.map((detail)=> detail.message)
            return res.status(422).send(errors);
        }
        next();
    }
} 