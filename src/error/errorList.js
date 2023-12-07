import httpStatus from "http-status";

    function conflict(item='item'){
        return {
            name: 'conflict',
            message:`conflict! this ${item} already exists`,
            status: httpStatus.CONFLICT
        }
    }

    function notFound(item = 'item'){
        return {
            name: 'notFound',
            message:`${item} not found`,
            status: httpStatus.NOT_FOUND
        }
    }

    function schema(errors){
        return { 
            name: 'schema',
            message: errors,
            status: httpStatus.UNPROCESSABLE_ENTITY
        }
    }

    function unauthorized(item = 'item'){
        return {
            name: 'unauthorized', 
            message:`${item} unauthorized` , 
            status: httpStatus.UNAUTHORIZED
        }
        
    }
   
    function internal(){
        return {
            name: 'internal', 
            message:'sorry, something went wrong' , 
            status: httpStatus.INTERNAL_SERVER_ERROR
        }
        
    }
export const errorList = {
    conflict,
    notFound,
    schema,
    internal,
    unauthorized
}