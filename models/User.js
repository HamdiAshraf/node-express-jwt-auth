const mongoose=require('mongoose');
const { isEmail }=require('validator')
const bcrypt=require('bcrypt')

const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,'email field must be provided'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Enter a valid email']
        
    },
    password:{
        type:String,
        required:[true,'password field must be provided'],
        minlength:[8,'password should be at least 8 characters']
    }
})

//fire function after save doc to db
// UserSchema.post('save',(doc,next)=>{
//     console.log(`new user was created & saved `,doc)
//     next()
// })

//fire function before save doc to db
UserSchema.pre('save',async function (next){
    const salt=await bcrypt.genSalt();
    this.password=await bcrypt.hash(this.password,salt)
    next()
    
})


//static method to login user
UserSchema.statics.login=async function(email,password){
    const user=await this.findOne({email});
    if(user){
        const auth=await bcrypt.compare(password,user.password)

        if(auth){
            return user;
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect email')
}

module.exports=mongoose.model('User',UserSchema)