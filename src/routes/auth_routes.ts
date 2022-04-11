import express from 'express'
import Auth from "../controllers/auth"
import authenticate from "../middleware/auth_middleware"

const router = express.Router()


router.post('/login',Auth.login)

router.post('/register',Auth.register)
router.post('/register',Auth.register)

router.post('/refresh',Auth.renewToken)

router.get('/test',authenticate,Auth.test)


export = router