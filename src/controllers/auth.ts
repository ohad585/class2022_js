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
        .sign({"_id":newUser._id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : process.env.TOKEN_EXPIRATION})

        const refresh_token = await jwt
        .sign({"_id":newUser._id},
        process.env.REFRESH_TOKEN_SECRET)

        newUser.refreshToken = refresh_token
        await newUser.save()
        res.status(StatusCodes.OK).send({ accessToken : access_token,refreshToken:refresh_token ,_id:newUser._id})
    }catch(err){
        return res.status(StatusCodes.BAD_REQUEST).send({'error':err.message})
    }

}
/**
 * Login
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
        .sign({"_id":user._id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : process.env.TOKEN_EXPIRATION})

        const refresh_token = await jwt
        .sign({"_id":user._id},
        process.env.REFRESH_TOKEN_SECRET)

        user.refreshToken = refresh_token
        await user.save()

        res.status(StatusCodes.OK).send({ accessToken : access_token,refreshToken: refresh_token,_id:user._id})
    }catch(err){
        return res.status(StatusCodes.BAD_REQUEST).send({'error':err.message})
    }

    //calc access token

}
/**
 * renewToken
 * get new access token by the refresh token
 * @param {*http request} req 
 * @param {*http response} res 
 */
const renewToken = async (req,res)=>{
    //validate refresh token
    let tokken = req.headers['authorization']
    if(tokken == null || tokken == undefined){
        return res.status(StatusCodes.FORBIDDEN).send({'error':'token not provided'})
    }
    tokken = tokken.split(' ')[1]
    jwt.verify(tokken,
        process.env.REFRESH_TOKEN_SECRET,async (err,userID)=>{
            if(err){
                return res.status(StatusCodes.FORBIDDEN).send({'error':'token not provided'})
            }
            req.body._id = userID
            try{
            let user = await User.findById(userID)
            if(user.refreshToken!=tokken){
                user.refreshToken=''
                await user.save()
                return res.status(StatusCodes.FORBIDDEN).send({'error':err.message})
            }
            const access_token = await jwt
            .sign({"_id":user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn : process.env.TOKEN_EXPIRATION})

            const refresh_token = await jwt
            .sign({"_id":user._id},
            process.env.REFRESH_TOKEN_SECRET)

            user.refreshToken = refresh_token
            user.accessToken = access_token
            await user.save()

            res.status(StatusCodes.OK).send({ accessToken : access_token,refreshToken: refresh_token,_id:user._id})

            }catch(err) {
                return res.status(StatusCodes.FORBIDDEN).send({'error':err.message})
            }
        })

}

/**
 * renewToken
 * get new access token by the refresh token
 * @param {*http request} req 
 * @param {*http response} res 
 */
 const test = async (req,res)=>{
    res.status(StatusCodes.OK).send({})
 }

export = {
    register,
    login,
    renewToken,
    test
}