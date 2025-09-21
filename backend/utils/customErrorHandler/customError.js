export class AppError extends Error{
    constructor(
        message,
        {status = 500, code = "INTERNAL_ERROR", details = null} = {}){
            super(message);
            this.name = this.constructor.name;
            this.status = status; //HTTP Status
            this.code = code; //Stable machine logs for clients/logs
            this.details = details; //Extra context (validation isuues etc.)
        }
}

export class BadRequestError extends AppError{
    constructor(message = 'Bad request', details){
        super(message, {status: 400, code:'BAD_REQUEST', details});
    }
}
export class UnauthorizedError extends AppError{
    constructor(message = 'Unauthorized'){
        super(message, {status: 401, code:'UNAUTHORIZED'});
    }
}
export class ForbiddenError extends AppError{
    constructor(message = 'ForbiddenError'){
        super(message, {status: 403, code:'FORBIDDEN'});
    }
}
export class NotFoundError extends AppError{
    constructor(message = 'Not found', details){
        super(message, {status: 404, code:'NOT_FOUND', details});
    }
}
export class ConflictError extends AppError{
    constructor(message = "Conflict error"){
        super(message, {status:409, code:'CONFLICT', details});
    }
}
export class InternalServerError extends AppError{
    constructor(message = "Internal server error"){
        super(message, {status:500, code:'INTERNAL_SERVER_ERROR', details});
    }
}