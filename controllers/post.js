
/**
 * Gets all the post
 * @param {*http request} req 
 * @param {*http response} res 
 */
const getAllPosts = (req,res)=>{
    res.send('app get posts')
}
/**
 * Create new post
 * @param {http request} req 
 * @param {*http response} res 
 */
const createNewPost = (req ,res)=>{
    res.send('app post posts')
}
module.exports = {
    getAllPosts,
    createNewPost
}