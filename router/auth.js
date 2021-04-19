const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const authenticate = require("../middleware/authenticate");


require('../db/conn');
const User = require("../model/schema");

router.get('/', (req, res) => {
    res.send(`hello world  from the  from router.js`);
 });
 //Using promises storing data
// router.post('/register', (req, res) => {

//     //using aqma script2015
// const { name, email, phone, work, password, cpassword} = req.body;

// if(!name || !email || !phone || !work || !password || !cpassword) {
//     return res.status(422).json({error:"please filled the field properly"});
// }  


// User.findOne({email: email}).then((userExist) => {
// if(userExist) {
//    return res.status(422).json({ error: "Email already exist"});
// }
// //const user = new User(req.body)
// //const user = new User({name:name, email:email, phone:phone, work:work, password:password, cpassword:cpassword})
// const user = new User({name, email, phone, work, password, cpassword});

// user.save().then(() => {
//    res.status(201).json({message:"user registered successfully"});
// }).catch((err) => res.status(500).json({error:"Failed to registered"}));

// }).catch((err) => { console.log(err); });

// });

router.post('/register', async (req, res) => {

   //using aqma script2015
const { name, email, phone, work, password, cpassword} = req.body;

    //validation
if(!name || !email || !phone || !work || !password || !cpassword) {
   return res.status(422).json({error:"please filled the field properly"});
}  
try {
    const userExist = await User.findOne({email: email})
    if(userExist) {
      return res.status(422).json({ error: "Email already exist"});
    }  else if(password != cpassword) {
      return res.status(422).json({ error: "Password and Confirm passowrd is not same"});
    } else {
      const user = new User({name, email, phone, work, password, cpassword});

      //  const userRegister = await user.save()
      //   if(userRegister) {
      //    res.status(201).json({message:"user registered successfully"});
      //   } else {
      //    res.status(500).json({error:"Failed to registered"});
      //   }
   
   
      //yaha pe
       await user.save();
      res.status(201).json({message:"user registered successfully"});
    }
    } catch(err) {
   console.log(err);
}
});




//login route code

router.post('/signin', async  (req, res) => {
// console.log(req.body);
// res.json({ message: "awesome"});
try {
   let token;
const {email, password} = req.body;

if(!email || !password)
{
   return res.status(400).json({error:"Plz fill the data"})
}

const userLogin =  await User.findOne({email:email});
//console.log(userLogin);

if(userLogin) {
   const isMatch = await bcrypt.compare(password, userLogin.password);
   
    token = await userLogin.generateAuthToken();
   console.log(token);

   res.cookie("jwtoken", token, {
   expires: new Date(Date.now() + 25892000000),
   httpOnly:true
   });

   if(!isMatch) {
      res.status(400).json({message: "Invalid Credential"});
   } else {
      res.json({message: "user Signin Successfully"});
   }
} else {
   res.status(400).json({message: "Invalid Credential"});

}
} catch (err) {
   console.log(err);
}
});

//about us page

 router.get('/about', authenticate, (req, res) => {
   // console.log(`hello  about world  from the server`);
    // we are requesting the data(full data)
    res.send(req.rootUser);
 });

 // get user data for contact us and home page
 router.get('/getData', authenticate, (req, res) => {

//console.log(`hello  getData world  from the server`);
    // we are requesting the data(full data)
    res.send(req.rootUser);
 });

 //contact us page data
  router.post('/contact', authenticate, async (req, res) => {

   try {
        const {name, email, phone, message} = req.body;
        if(!name || !email || !phone || !message) {
           console.log("error in contact form");
           return res.json({error: "plzz filled the contact form"});
        }

        const userContact = await User.findOne({_id:req.userID });
        if(userContact) {
           const userMessage = await userContact.addMessage(name,email,phone,message);
            await userContact.save();

            res.status(201).json({message: "user contact successfuly"});

        }

   } catch (error) {
      console.log(error);
      
   }
   
  });

//logout page
router.get('/logout', (req, res) => {
   // console.log(`hello  about world  from the server`);
    // we are requesting the data(full data)
    res.clearCookie('jwtoken', {path: '/'});
    res.status(200).send('User logout');


 });





  module.exports = router;