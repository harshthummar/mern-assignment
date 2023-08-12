const express = require('express')
const router = new express.Router()
const User = require('../models/userModel')
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs')
const upload  = require('../utils/multer')

//signup user
router.post('/register',upload.single("profilePicture"),async (req,res)=>{
    
     const { filename } = req.file;
    
    const {password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = new User({
      ...req.body,
      password: hashedPassword, 
      profilePicture:filename
    });

    

    try{

        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})


    }
    catch(error)
    {
        console.log(error.message);
        res.status(500).send(error)
    }
    
})


//login user
router.post('/login',async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        if(!user)
        {
            
            res.status(404).send({ message:"Invalid User"})
            return
        }
        const token = await user.generateAuthToken()
        res.send({ user , token})
    }
    catch(error)
    {
        console.log(error.message);
        res.status(500).send(error.message)
    }
      
})

router.get('/profile',auth,async (req,res) => {
    try{
        const user = await User.findById({_id:req.user._id});
        
        if(!user)
        {
            
            res.status(404).send({ message:"User profile not find"})
            return
        }
        
        res.status(200).send(user);
    }
    catch(error)
    {
        console.log(error.message);
        res.status(500).send(error.message)
    }
      
})


//logout user
router.post('/logout',auth,async (req,res) => {
    try{
            req.user.tokens = req.user.tokens.filter((token)=>{
                return token.token !== req.token
            })

            await req.user.save()
            res.send()
    }
    catch(e){
        console.log(e);
        res.status(500).send(e)
    }
})




module.exports = router