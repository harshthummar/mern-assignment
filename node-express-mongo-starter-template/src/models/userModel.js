const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw Error("Email is not valid")
            }
        }

    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes("password"))
            {
                throw Error("This is not valid password")
            }
        }
    },
   
    profilePicture: {
        type: String, 
        trim: true,
        unique:true,
    },
    birthDate: {
        type: Date,
        required: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},{
    timestamps:true
})


userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email,password) => {

        const user = await User.findOne({email})
        if(!user)
        {
             throw new Error('Unable to login!')
            
            
        }
        
        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch) 
        {
           throw new Error('Unable to login!')
        }

        return user


}





const User = mongoose.model('User',userSchema)

module.exports = User