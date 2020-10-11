const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){
   
    let posts = await post.find({})
    .populate('user')
    .populate({
        path:'comments',
        populate:{
            path: 'user'
        }
    });

    return res.json(200, {
    message: "List of posts",
    posts: posts 
    });
}


module.exports.destroy = async function(req, res){
    try {
        let post = await Post.findById(req.params.id);
       //.id means converting the object id into string
        if (post.user == req.user.id){
         post.remove();

        await Comment.deleteMany({post: req.params.id});
          return res.redirect('back');
         }else{
            return res.json(401, {
                message: "You cannot delete this post"
            })
        }
        return res.json(200,{
            message:"Post and associated comments deleted successfully!"
        });
    } catch (error) {
        console.log('error', err);
        return res.json(500, {
            message:"internal server err"
        });
        
    }
   
}