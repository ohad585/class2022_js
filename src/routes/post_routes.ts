import express from 'express'
import Post from "../controllers/post"
import authenticate from "../middleware/auth_middleware"

const router = express.Router()


router.get('/',Post.getAllPosts)

router.post('/',authenticate,Post.createNewPost)

router.get('/:id',Post.getPostById)

export = router