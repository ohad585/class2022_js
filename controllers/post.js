const Post = require('../models/post_model')

/**
 * Gets all the post
 * @param {*http request} req 
 * @param {*http response} res 
 */
const getAllPosts =async (req,res)=>{
    console.log('Getting posts')

    try{
        var posts
        const sender = req.query.sender
        if(sender == null | sender == undefined){
            posts = await Post.find()
        }else{
            posts = await Post.find({'sender' : sender})
        }
        res.status(200).send({posts})
    }catch(err){
        res.status(400).send({
            'err' :err.message
        })
    }


}
/**
 * Create new post
 * @param {http request} req 
 * @param {*http response} res 
 */
const createNewPost = async(req ,res)=>{
    console.log(req.body)
    const post = Post({
        message : req.body.message,
        sender : req.body.sender
    })

    try{
        newPost= await post.save()
        res.status(200).send(newPost)
    }catch(err){
        res.status(400).send({
            'status' :'fail',
            'err' :err.message
        })
    }
}


const getPostById =async (req,res)=>{
    console.log("getPostsById id=" + req.params.id);
    const id = req.params.id
    if(id == null | id == undefined){
        return res.status(400).send({
            'err':'no id provided'
        })
    }
    try{
        post =await Post.findById(id)
        if(post == undefined | post == null){
            res.status(400).send({
                'err':'No post found'
            })
        }
        res.status(200).send(post)
    }catch(err){
        return res.status(400).send({
            'err':err.message
        })
    }
}
module.exports = {
    getAllPosts,
    createNewPost,
    getPostById
}