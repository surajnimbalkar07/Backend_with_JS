// ApiError is a custom error class used in backend projects.
// It helps us send consistent error responses.
// It extends the default Error class but adds extra fields like status code,
// errors array, success flag, etc. 
// So whenever something goes wrong in the API, instead of throwing a normal error,
// we throw ApiError which contains all information needed for the frontend.

class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}
