let id=1
let completed=false

// Adding the task just by clicking the Enter key

function showMessage(message) {
  const toast = document.querySelector(".toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 1000);
}
showMessage("hello")
//Delete a todo
async function deleteTodo(id){
  document.getElementById(`task-${id}`).remove();
  const response = await axios.delete("http://localhost:2999/delete", {
    data: { id }, // ✅ Must use `data`
    headers: { Authorization: localStorage.getItem("token") },
  });

  showMessage("Task deleted")
  displayUsers()
}

// Add a todo
async function addTodo(){

  //Taking the input value
  const taskInput = document.querySelector(".input-box");
  const taskText = taskInput.value;


  if(taskText==""){
    alert("Please Enter the Task");
    return
  }
  const newTask = {
    id: id,
    task: taskText,
    completed: false,
  };

  taskInput.value="";

  // Creating the div
  const displayEl=document.createElement("div")
  displayEl.className="task"
  displayEl.id=`task-${id}`
  displayEl.innerHTML=`
  <div class="task-text-box">
    <p id="task-text-${id}" class="task-text">${taskText}</p>
  </div>
  <div class="btn-box">
    <input type="checkbox" name="" id="tick-${id}" class="tick" onclick="taskCompleted(${id})">
    <button id="delete-btn-${id}" class="delete-btn" onclick="deleteTodo(${id})">Delete</button>
  </div>`
  
  document.querySelector(".task-box").appendChild(displayEl)

  const response = await axios.post("http://localhost:2999/add", newTask, {  
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  id++
  showMessage("Task added")
  displayUsers()
}

// async function taskCompleted(id){
//   if(!completed){
//     document.getElementById(`task-text-${id}`).style.textDecoration='line-through';
//     completed=true
//     await axios.put("http://localhost:2999/complete",{
//       id,
//       completed
//     })

//   } else {
//     document.getElementById(`task-text-${id}`).style.textDecoration='none';
//     completed=false
//     await axios.put("http://localhost:2999/complete",{
//       id,
//       completed
//     })
//   }
//   showMessage("Task completed")
// }
async function taskCompleted(id) {
  const checkbox = document.getElementById(`tick-${id}`);
  const isCompleted = checkbox.checked; 

  document.getElementById(`task-text-${id}`).style.textDecoration = isCompleted ? 'line-through' : 'none';

  await axios.put("http://localhost:2999/complete", {
    id:Number(id),
    completed: isCompleted
  });

  showMessage(isCompleted ? "Task marked as completed" : "Task marked as incomplete");
  displayUsers()
}


document.querySelector(".input-box").addEventListener('keydown',(event)=>{
  if(event.key=='Enter'){
    addTodo()
  }
})

async function displayUsers() {
  const token = localStorage.getItem("token"); // Retrieve the token

  if (!token) {
    console.error("No token found in localStorage");
    return;
  }

  try {
    const response = await axios.get("http://localhost:2999/todos", {
      headers: {
        Authorization: token // Send the token in the request
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
}
