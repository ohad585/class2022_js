import express from 'express'
import Auth from "../controllers/auth"
import authenticate from "../middleware/auth_middleware"

const router = express.Router()


/**
* @swagger
* tags:
*   name: Auth
*   description: The Authentication API
*/

/**
* @swagger
*   components:
*       securitySchemes:
*           bearerAuth:
*               type: http
*               scheme: bearer
*               bearerFormat: JWT
*/

/**
* @swagger
*   components:
*       schemas:
*           User:
*               type: object
*           required:
*               - email
*               - password
*           properties:
*               email:
*                   type: string
*                   description: The user email
*               password:
*                   type: string
*                   description: The user password
*           example:
*               email: 'bob@gmail.com'
*               password: '123456'
*/

router.post('/login',Auth.login)

/**
* @swagger
*    /auth/register:
*       post:
*           summary: registers a new user
*           tags: [Auth]
*       requestBody:
*           required: true
*       content:
*           application/json:
*       schema:
*           $ref: '#/components/schemas/User'
*       responses:
*           200:
*               description: Register success return access and refresh token
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*/
router.post('/register',Auth.register)

router.get('/refresh',Auth.renewToken)

router.get('/test',authenticate,Auth.test)


export = router