let allTask = JSON.parse(localStorage.getItem("tasks")) || [];
let editIndex = -1;

const title = document.getElementById("title");
const description = document.getElementById("description");
const date = document.getElementById("date");
const priority = document.getElementById("priority");
const todostatus = document.getElementById("status");

const tMain = document.getElementById("tMain");
const allTodos = document.getElementById("allTodos");
const pTodos = document.getElementById("pTodos");
const cTodos = document.getElementById("cTodos");

const todoCount = document.getElementById("todoCount");
const pCount = document.getElementById("pCount");
const cCount = document.getElementById("cCount");

function onAddTask(isEdit = false) {
  if (!title.value || !description.value || !date.value) {
    alert("Enter all the fields");
    return;
  }

  let newTaskObj = {
    title: title.value,
    description: description.value,
    date: date.value,
    status: todostatus.value,
    priority: priority.value,
  };

  if (editIndex !== -1) {
    allTask[editIndex] = newTaskObj;
    editIndex = -1;
  } else {
    allTask.push(newTaskObj);
  }

  // Clear form fields after adding/updating task
  title.value = "";
  description.value = "";
  date.value = "";
  showTodos();
}

function showTodos(data = null) {
  !data && localStorage.setItem("tasks", JSON.stringify(allTask));

  let todoHtml = "";
  let pHtml = "";
  let cHtml = "";

  let tC = 0;
  let pC = 0;
  let cC = 0;

  let finalData = data || allTask || [];
  finalData.forEach((value, index) => {
    let tempHtml = `
      <div class="todoContainer">
        <div class="titleContainer">
          <div class="title">${value.title}</div>
          <div class="chip-text ${value.priority}">${value.priority} Priority</div>
        </div>
        <div>
          <i data-bs-toggle="offcanvas" data-bs-target="#addTask" onclick="onTodoUpdate(${index})" class="fa-solid fa-pen-to-square"></i>
          <i onclick="onTodoDelete(${index})" class="fa-solid fa-trash"></i>
        </div>
      </div>`;

    if (value.status === "todo") {
      todoHtml += tempHtml;
      tC += 1;
    } else if (value.status === "progress") {
      pHtml += tempHtml;
      pC += 1;
    } else {
      cHtml += tempHtml;
      cC += 1;
    }
  });

  todoCount.innerText = tC;
  allTodos.innerHTML = todoHtml;

  pCount.innerText = pC;
  pTodos.innerHTML = pHtml;

  cCount.innerText = cC;
  cTodos.innerHTML = cHtml;

  // Hide 'ToDo' section if no tasks exist
  if (tC === 0) tMain.style.display = "none";
}

function onTodoUpdate(index) {
  let oneTask = allTask[index];
  title.value = oneTask.title;
  description.value = oneTask.description;
  todostatus.value = oneTask.status;
  date.value = oneTask.date;
  priority.value = oneTask.priority;

  editIndex = index;
}

function onTodoDelete(index) {
  allTask.splice(index, 1);
  showTodos();
}

function onSearchInput(event) {
  let searchText = event.target.value;
  let filteredTask = allTask.filter((value) => {
    return value.title.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
  });

  showTodos(filteredTask);
}

// Initial call to display all tasks
showTodos();

// Function to handle task status filter
document.querySelectorAll('input[name="taskStatus"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    const selectedStatus = document.querySelector('input[name="taskStatus"]:checked').id;
    let filteredTasks = [];

    if (selectedStatus === "all") {
      filteredTasks = allTask;
    } else {
      filteredTasks = allTask.filter((task) => task.status === selectedStatus);
    }

    showTodos(filteredTasks);
  });
});
