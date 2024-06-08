const mongoose =require ('mongoose')


mongoose.connect('mongodb://127.0.0.1:27017/miniproject')

const userSchema=mongoose.Schema({
    usename:String,
    name:String,
    email:String,
    age:Number,
    password:String,
    post:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }]
})


module.exports=mongoose.model('User',userSchema)