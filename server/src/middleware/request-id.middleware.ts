import {Request,Response,NextFunction} from 'express'
import crypto from 'crypto'

const requestIdMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    const requestId = crypto.randomUUID()
    req.requestId = requestId
    res.setHeader('x-request-id',requestId)
    next()
}

export default requestIdMiddleware;

