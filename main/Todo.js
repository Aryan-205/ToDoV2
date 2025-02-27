let id=4
let completed=false

function deleteTodo(id){
  document.getElementById(`task-${id}`).remove();
}
function addTodo(){

  //Taking the input value
  const inpEl=document.querySelector(".input-box")

  if(inpEl.value==""){
    alert("Please Enter the Task");
    return
  }

  // Creating the div
  const displayEl=document.createElement("div")
  displayEl.className="task"
  displayEl.id=`task-${id}`
  displayEl.innerHTML=`
  <div class="task-text-box">
    <p id="task-text-${id}" class="task-text">${inpEl.value}</p>
  </div>
  <div class="btn-box">
    <input type="checkbox" name="" id="tick-${id}" class="tick" onclick="taskCompleted(${id})">
    <button id="delete-btn-${id}" class="delete-btn" onclick="deleteTodo(${id})">Delete</button>
  </div>`
  
  document.querySelector(".task-box").appendChild(displayEl)
  
  inpEl.value="";

  id++
}
// Adding the task just by clicking the Enter key
document.querySelector(".input-box").addEventListener('keydown',(event)=>{
  if(event.key=='Enter'){
    addTodo()
  }
})

function taskCompleted(id){
  if(!completed){
    document.getElementById(`task-text-${id}`).style.textDecoration='line-through';
    completed=true
  } else {
    document.getElementById(`task-text-${id}`).style.textDecoration='none';
    completed=false
  }

}
