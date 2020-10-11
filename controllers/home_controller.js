const Post = require('../models/post');
const { post } = require('../routes');
const User = require('../models/user');

module.exports.home = async function(req, res){
    // return res.end('<h1>Express is up for codeial</h1>');
   // console.log(req.cookies);
    //res.cookie('user_id',25);

    // Post.find({}, function(err, posts){
    //     return res.render('home',{
    //         title:"Codeial | home",
    //         posts: posts
    // });
    // });
   try {
    //populate the user for each post    
    let posts = await post.find({})
    .populate('user')
    .populate({
        path:'comments',
        populate:{
            path: 'user'
        }
    });
    let users = await User.find({});
       
        return res.render('home',{
            title:"Codeial | home",
            posts: posts,
            all_users: users
        });
      
       
   } catch (error) {
       console.log('error', err);
       return;
   }
   
}

//module.exports.actionName = function(req, res){}