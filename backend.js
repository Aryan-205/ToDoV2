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
  res.sendFile(__dirname + "/signup_signin/index.html")
})

app.post("/signup",logger,(req,res)=>{
  const username=req.body.username
  const password=req.body.password
  const todos=[];
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.json({ message: "Username already exists! Please choose a different one." });
  }

  users.push({
    username,
    password,
    todos
  })
  res.json({
    message:"You have successfully sign-up"
  })
})
app.post("/signin",logger,(req,res)=>{

  
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
//Authentization of the token
function auth(req,res,next){
  let token=req.headers.authorization

  if (!token) {
    return res.json({
        message: "Token is missing!",
    });
  } 
  try {
    const decodedData = jwt.verify(token, JSON_secret);

    req.username = decodedData.username;

    next();
  } catch (error) {
    return res.json({
        message: "Invalid token!",
    });
  }
}
// Showing all the tasks
app.get("/todos", logger, auth, (req, res) => {
  console.log("All users:", users);
  console.log("Requested user:", req.username);

  const foundUser = users.find((u) => u.username === req.username);
  if (foundUser) {
    console.log("Found user's todos:", foundUser.todos);
    return res.json({ todos: foundUser.todos });
  } else {
    console.log("User not found in GET /todos");
    return res.json({ message: "User not found!" });
  }
});

// Adding the task
app.post("/add", logger, auth, (req, res) => {
  console.log("Received new task:", req.body); 
  const foundUser = users.find((u) => u.username === req.username);
  if (!foundUser) {
    return res.json({ message: "User not found!" });
  }

  const { id, task, completed } = req.body; 

  if (!task) {
    return res.json({ message: "Task is required!" });
  }

  foundUser.todos.push({ id, task, completed });
  console.log("after adding task:", foundUser.todos);
  console.log("All users:", users);

  res.json({ message: "Task successfully added" });
});
// Task is completed
app.put("/complete", logger, auth, (req, res) => {
  const taskid = Number(req.body.id); 
  const taskCompleted = req.body.completed;
  
  const foundUser = users.find((u) => u.username === req.username);
  if (!foundUser) {
    return res.json({ message: "User not found!" });
  }

  const taskOfId = foundUser.todos.find((u) => u.id === taskid);

  if (!taskOfId) {
    return res.json({ message: "Task not found!" });
  }

  taskOfId.completed = taskCompleted;  
  console.log(`Updated task ${taskid} completion:`, taskCompleted);
  
  res.json({ message: "Task status updated!" });
});

//Deleting a Task
app.delete("/delete",logger,auth,(req,res)=>{

  const taskid=req.body.id

  const foundUser = users.find((u) => u.username === req.username);
  if (!foundUser) {
    return res.json({ message: "User not found!" });
  }

  const restTasks = foundUser.todos.filter(u => u.id !== taskid);
  if(!restTasks){
    return res.json({message})
  }
  foundUser.todos=restTasks

  res.json({message:"Task deleted"})
})

app.listen(2999, () => {
  console.log("Server running on port 2999...");
});