import User from '../models/user_model'
import { Request,Response } from 'express'
import {StatusCodes} from 'http-status-codes'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

/**
 * Gets all the post
 * @param {*http req} req 
 * @param {*http res} res 
 */
const register =async (req,res)=>{
    console.log('register')
    
    //validate email/password
    const email = req.body.email
    const password = req.body.password
    if(email == null || email == undefined || password == null || password == undefined){
        res.status(StatusCodes.BAD_REQUEST)
    }

    //encrypt password
    var encrypted_password
    try{
        const salt = await bcrypt.genSalt(10)
        encrypted_password = await bcrypt.hash(password,salt)

    }catch(err){

    }
    //check if email is not already taken

    //save user in db
    const user = new User({
        'email' : email,
        'password': encrypted_password
    })
    try{
        const newUser = await user.save()
        const access_token = await jwt
        .sign({"id":newUser._id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : process.env.TOKEN_EXPIRATION})
        res.status(StatusCodes.OK).send({"access_token": access_token})
    }catch(err){
        return res.status(StatusCodes.BAD_REQUEST).send({'error':err.message})
    }
    //login - create access token

}
/**
 * Gets all the post
 * @param {*http request} req 
 * @param {*http response} res 
 */
 const login =async (req,res)=>{
    console.log('login')
    //check password match

    const email = req.body.email
    const password = req.body.password
    if(email == null || email == undefined || password==null || password == undefined ){
        return res.status(StatusCodes.BAD_REQUEST).send({'error':'Wrong user or password'})
    }

    try{
        const user = await User.findOne({"email":email})
        if(user == null || user == undefined ){
            return res.status(StatusCodes.BAD_REQUEST).send({'error':'Wrong user or password'})
        }
        const match = await bcrypt.compare(password,user.password)
        if(!match){
            return res.status(StatusCodes.BAD_REQUEST).send({'error':'Wrong user or password'})
        }
        const access_token = await jwt
        .sign({"id":user._id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : process.env.TOKEN_EXPIRATION})
        res.status(StatusCodes.OK).send({"access_token": access_token})
    }catch(err){
        return res.status(StatusCodes.BAD_REQUEST).send({'error':err.message})
    }

    //calc access token

}

export = {
    register,
    login
}