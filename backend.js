const express =require("express")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const JSON_secret = "andBandKaDola"

const app=express()

app.use(express.json())
app.use(cors())

const users=[]

function logger(req,res,next){
  console.log(`${req.method} request logged`)
  next()
}

app.get("/", function(req, res) {
  res.sendFile(__dirname + "./signup_signin/index.html")
})

app.post("/signup",(req,res)=>{
  const username=req.body.username
  const password=req.body.password

  users.push({
    username,
    password
  })
  res.json({
    message:"You have successfully sign-up"
  })
})
app.post("/signin",(req,res)=>{

  
  const username=req.body.username
  const password=req.body.password
  
  const token=jwt.sign({username},JSON_secret)
  
  const foundUser=users.find(u=>u.username==username && u.password==password)

  if(foundUser){
    return res.json({
      message:"You have successfully sign-in",
      token:token
    })
  } else {
    return res.json({
      message:"User not found Please Sign-up"
    })
  }
})
function auth(req,res,next){
  const token=req.headers.authorization

  if (!token) {
      return res.json({
          message: "Token is missing!",
      });
    }
  
    try {
      const decodedData = jwt.verify(token, JWT_SECRET);
  
      req.username = decodedData.username;

      next();
    } catch (error) {
      return res.json({
          message: "Invalid token!",
      });
    }
}

app.get("/todos",auth,(req,res)=>{
  const currentUser=req.username

  const foundUser = memory.find((user) => user.username === currentUser);

  if (foundUser) {
    return res.json({
        username: foundUser.username,
        password: foundUser.password,
    });
  } else {
    return res.json({
        message: "User not found!",
    });
  }
})

app.listen(2999, () => {
  console.log("Server running on port 2999...");
});
