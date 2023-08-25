const User=require('../models/User')
const jwt=require('jsonwebtoken')

const handleErrors=(error)=>{
    console.log(error.message,error.code)
    const errors={email:'',password:''};

    if(error.message.includes('User validation failed')){
        Object.values(error.errors).forEach(({ properties })=>{
            errors[properties.path]=properties.message;
        })
    }

    //incorrect email 
    if(error.message==='incorrect email'){
        errors.email='email is not registered'
    }

    //incorrect password 
    if(error.message==='incorrect password'){
        errors.password='incorrect password'
    }
    if(error.code===11000){
        errors.email='this email is already registered'
    }

    return errors;
}


const maxAge=3*24*60*60 ;//in token expects times in seconds but in cookies in mil seconds
const createToken=(id)=>{

    return jwt.sign({id},'my_secret_key',{
        expiresIn: maxAge
        
    })
}

exports.signup_get=(req,res)=>{
    res.render('signup')
}
exports.login_get=(req,res)=>{
    res.render('login')
}
exports.signup_post=async(req,res)=>{
    const { email,password }=req.body;
    try {
        
    const user=await User.create({ email,password })
    // const token=createToken(user._id);
    // res.cookie('jwt',token,{
    //     maxAge:maxAge*1000 //expects in msec
    // })
    res.status(201).json({user:user._id})
    } catch (error) {
        console.log(error)
        const errors=handleErrors(error)
        res.status(400).json({errors})
    }
}
exports.login_post=async(req,res)=>{
    try {
        const { email,password }=req.body;

    const user=await User.login(email,password);

    const token=createToken(user._id);
    res.cookie('jwt',token,{
        maxAge:maxAge*1000 //expects in msec
    })
    res.status(200).json({user:user._id})
    } catch (error) {
        const errors=handleErrors(error)
        res.status(400).json({errors})
    }

}


exports.logout_get=(req,res)=>{
    res.cookie('jwt','',{expiresIn:1})
    res.redirect('/')
}