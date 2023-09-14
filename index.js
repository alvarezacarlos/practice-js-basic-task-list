const bttn = document.querySelector("#create-task");
const titleInput = document.querySelector("#title");

let tasks = [];

const taskList = document.querySelector("#task-list");

const handleReopenTask = (e) => {
  const taskSelected = tasks.find((task) => task._id === e.target.id);
  taskSelected.status = "opened";
  e.target.hidden = true;
  e.target.previousElementSibling.disabled = false;
  e.target.previousElementSibling.innerText  = 'Complete Task'
  e.target.previousElementSibling.classList.remove("btn-secondary");
  e.target.previousElementSibling.classList.add("btn-info");
  e.target.previousElementSibling.previousElementSibling.disabled = false;
};

const handleDelete = (e) => {
  taskList.removeChild(e.target.parentNode.parentNode);
  const taskIndex = tasks.findIndex((task) => task._id === e.target.id);
  tasks.pop(taskIndex, 1);
  console.log(tasks);
};

const handleComplete = (e) => {
  const taskSelected = tasks.find((task) => task._id === e.target.id);
  taskSelected.status = "completed";
  e.target.innerText = "Task Completed";
  e.target.classList.remove("btn-info");
  e.target.classList.add("btn-secondary");
  e.target.previousElementSibling.disabled = true;
  e.target.nextElementSibling.hidden = false;
  e.target.disabled = true;
  console.log(tasks);
};

const domParser = (jsObject) => {
  const parser = new DOMParser();
  const parsedTask = parser.parseFromString(
    `
        <div class="task">
            <p>${jsObject.title}</p>  
            <div class="bttn-container"></div>
        </div>
    `,
    "text/html"
  );

  //delete bttn
  const deleteBttn = parser.parseFromString(
    `<button class="btn btn-danger" id=${jsObject._id}>Delete</button>`,
    "text/html"
  ).body.firstChild;

  //delete event
  deleteBttn.addEventListener("click", handleDelete);

  //append delete bttn to the card
  parsedTask.body.querySelector(".bttn-container").appendChild(deleteBttn);

  //complete bttn
  const completeBttn = parser.parseFromString(
    `<button class="btn btn-info" id=${jsObject._id}>Complete Task</button>`,
    "text/html"
  ).body.firstChild;

  //append complete bttn to the card
  parsedTask.body.querySelector(".bttn-container").appendChild(completeBttn);

  //complete event
  completeBttn.addEventListener("click", handleComplete);

  //re-open bttn
  const reopenBttn = parser.parseFromString(
    `<button class="btn btn-info" id=${jsObject._id} hidden>Re-open Task</button>`,
    "text/html"
  ).body.firstChild;

  //append reopenBttn to the card
  parsedTask.body.querySelector(".bttn-container").appendChild(reopenBttn);

  //complete event
  reopenBttn.addEventListener("click", handleReopenTask);

  //return card
  return parsedTask.body.firstChild;
};

const handleCreateTask = (e) => {
  const titleInput = document.querySelector("#title");
  const taskDesc = titleInput.value;
  if (taskDesc.trim().length <= 0) {
    alert("Please type the task you would like to create");
    return;
  }

  const task = {
    _id: Date.now().toString(36) + Math.random().toString(36),
    title: taskDesc,
    status: "opened",
  };

  tasks.push(task);

  titleInput.value = "";

  const parsedTask = domParser(task);
  taskList.appendChild(parsedTask);

  console.log(tasks);
};

titleInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleCreateTask();
  }
});

bttn.addEventListener("click", handleCreateTask);
