const jwt = require("jsonwebtoken");
const  User = require("../model/schema");


const authenticate = async (req , res , next) => {
   try {
  // we are getting the token
    const token = req.cookies.jwtoken;
    
    // we are verifying the token
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

// now we are getting the user data from token
 const rootUser = await User.findOne({_id:verifyToken._id, "tokens.token": token });

 if(!rootUser) {
     throw new Error('User not found')

 } 
 req.token = token;
 req.rootUser = rootUser;

 req.userID = rootUser._id;

 // we have call the next else it will stuck in this function
 next();

   } catch(err) {
       res.status(401).send('Unauthorised: No token provided')
       console.log(err);
   }


}

module.exports = authenticate;