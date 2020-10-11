const User = require('../models/user');
const { readyState } = require('../config/mongoose');

module.exports.profile = function(req,res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    });
}

module.exports.update =async function(req, res){
//     if(req.user.id= req.params.id){
//         User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
//             return res.redirect('back');
//         });
//     }else{
//         return res.status(401).send('Unauthorised');
//     }
// }
       if(req.user.id= req.params.id){
           try {
            let user= await User.findById(req.params.id);
            User.uploadedAvatar(req,res, function(err){
                if(err){console.log('*****Multre Error:', err)}
                
                user.name= req.body.name;
                user.email = req.body.email;
                if(req.file){
                   

                  //this is saving the path of the uploaded file into the avatar feild in the user
                   user.avatar= User.avatarPath +'/'+ req.file.filename;
                }
                user.save();
                return res.redirect('back');
            })   

           } catch (error) {
               req.flash('error', err);
               return res.redirect('back');
           }

       }else{
        req.flash('error', 'Unauthorised');
        return res.status(401).send('Unauthorised');
       }
    }


  /* if(req.cookies.user_id){
    User.findById(req.cookies.user_id, function(err, user){
        if(user){
            return res.render('user_profile',{
                title:"user-profile",
                user: user
            }) 
        } 
            return res.redirect('/users/sign-in');
        });
    
   }else{
       return res.redirect('/users/sign-in');
   }*/


//render the sign up page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
       return res.redirect('/user/profile');
    }
    return res.render('user_sign_up', {
        title: "Codeial| Sign Up"
    });
}

//render the sign in page
module.exports.signIn = function(req, res ){
    if(req.isAuthenticated()){
       return res.redirect('/user/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial| Sign In"
    });
}

//get the sign up data
module.exports.create = function(req, res){
    //console.log(req.body)
    if (req.body.password != req.body.confirmpassword){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err , user){
        if(err){console.log('error in finding user in signing up'); return}
        if(!user){
             User.create(req.body, function(err, user){
                if(err){console.log('error in creating user  signing up'); return}

                return res.redirect('/users/sign-in');
            })
        
        } else{
            return res.redirect('back');
        }

    });


}
//sign in and session for user
module.exports.createSession = function(req, res){
    req.flash('success', 'LOgged In Successfully');
    return res.redirect('/');
  /* // find the user
   User.findOne({email: req.body.email}, function(err ,user){
    if(err){console.log('error in finding user in signing in'); return}
    
    //handle user found
    if(user){
        //handle passwords which dont match
        if (user.password != req.body.password){
            return res.redirect('back');
        }

        //handle session creation
       res.cookie('user_id', user.id);
       return res.redirect('/users/profile');
    }else{
      //handle user not found
      return res.redirect('back');
    }

   });*/
}

 module.exports.destroySession = function(req, res) {
     req.logout();
     req.flash('success', 'You Have Logged Out!');
     return res.redirect('/');
 }