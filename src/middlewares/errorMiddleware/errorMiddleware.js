import httpStatus from "http-status"
import { errorList } from '../../error/errorList.js'

const handleError = (error, req, res, next)=>{

    if(errorList[error.name]!==undefined)return res.status(error.status).send(error.message)  

    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message)

}

export default handleError;