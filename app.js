const express =require ('express')
const userModel=require('./model/user');
const postModel=require('./model/post')
const cookieParser = require('cookie-parser');
const bcrypt =require('bcrypt')
const app=express();
const jwt=require('jsonwebtoken')

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const PORT=3000;

app.get('/',(req,res)=>{
   res.render('index');
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/register',async (req,res)=>{

    let {username,name,password,age,email}=req.body;


    let user=await userModel.findOne({email})
    if(user) return res.status(500).send('User already register');
    
    bcrypt.genSalt(10,(err,salt)=>
    {
      bcrypt.hash(password,salt,async (err,hash)=>{
        let user =await userModel.create(
            {
                username,
                age,
                email,
                name,
                password:hash
            }
        );
        let token=jwt.sign({email:email,userid:user._id},"shhhh");
        res.cookie("token",token);

        res.send("registered")
      })
    })
})

app.post('/login',async(req,res)=>{
    let {email,password}=req.body;


    let user=await userModel.findOne({email});
    if(!user) return res.status(500).send('Something went wrong');
    //user ha 
    bcrypt.compare(password,user.password,(err,result)=>{
        if(result)
            {
                let token=jwt.sign({email:email,userid:user.id},"shhhh");
                res.cookie("token",token);
                res.status(200).redirect('/profile') ;
            }
             
        else
        res.redirect('/login');
    })
        
})

app.get('/logout',async(req,res)=>{
    res.cookie("token","");
    res.redirect("/login");
})

app.get('/profile',isLoggedIn,async(req,res)=>{
    // console.log(req.user);
    let user=await userModel.findOne({email:req.user.email})
    res.render('profile',{user})
})

//Protected Route  //middleware function
function isLoggedIn(req,res,next){
   if(req.cookies.token === "") res.redirect("/login")
    else{
     let data= jwt.verify(req.cookies.token,"shhhh")
     req.user=data;
     next();
     }
    
}

app.listen(PORT,()=>{
    console.log(`sever is running on port ${PORT}`)
})

