import {NextFunction, Request,Response} from 'express'
import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'

const authMiddleWare = async (req:Request,res:Response,next:NextFunction)=>{
    const tokken = req.headers['authorization']
    if(tokken == null || tokken == undefined){
        return res.status(StatusCodes.FORBIDDEN).send({'error':'token not provided'})
    }
    jwt.verify(tokken,
        process.env.ACCESS_TOKEN_SECRET,(err,userID)=>{
            if(err){
                return res.status(StatusCodes.FORBIDDEN).send({'error':'token not provided'})
            }
            req.body._id = userID
            next()
        })
}

export = authMiddleWare