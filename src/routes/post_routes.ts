import express from 'express'
import Post from "../controllers/post"

const router = express.Router()


router.get('/',Post.getAllPosts)

router.post('/',Post.createNewPost)

router.get('/:id',Post.getPostById)

export = router