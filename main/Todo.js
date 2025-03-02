let id=1

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
    data: { id }, // 
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

async function taskCompleted(id) {
  const checkbox = document.getElementById(`tick-${id}`);
  const isCompleted = checkbox.checked ? true : false; 

  document.getElementById(`task-text-${id}`).style.textDecoration = isCompleted ? 'line-through' : 'none';

  await axios.put("http://localhost:2999/complete", {
    id:Number(id),
    completed: isCompleted
  }, {
    headers: {
      Authorization: localStorage.getItem("token")  
    }
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
    const tasks = response.data.todos;
    console.log("Updated tasks:", tasks);

    const taskBox = document.querySelector(".task-box");
    taskBox.innerHTML = "";  // Clear existing tasks

    tasks.forEach(task => {
      const displayEl = document.createElement("div");
      displayEl.className = "task";
      displayEl.id = `task-${task.id}`;
      displayEl.innerHTML = `
        <div class="task-text-box">
          <p id="task-text-${task.id}" class="task-text" style="text-decoration: ${task.completed ? 'line-through' : 'none'};">
            ${task.task}
          </p>
        </div>
        <div class="btn-box">
          <input type="checkbox" id="tick-${task.id}" class="tick" ${task.completed ? 'checked' : ''} onclick="taskCompleted(${task.id})">
          <button id="delete-btn-${task.id}" class="delete-btn" onclick="deleteTodo(${task.id})">Delete</button>
        </div>`;

      taskBox.appendChild(displayEl);
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
}
displayUsers()
