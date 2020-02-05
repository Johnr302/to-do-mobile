const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const LOCAL_STORAGE_LIST_KEY = "tasks.list";
const tasksContainer = document.querySelector("[data-tasks]");
const listTitleElement = document.querySelector("[data-list-title]");
let selectedList = (LOCAL_SELECTED_LIST_ID_KEY = "task.selectedListId");
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_SELECTED_LIST_ID_KEY);
const tasksTemplate = document.getElementById("tasks-template");
const listDisplayContainer = document.querySelector(
  "[data-list-display-container]"
);

const newListSubmit = e => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName == null || listName === "") return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  selectedListId = list.id;
  saveAndRender();
};

newListForm.addEventListener("submit", newListSubmit);

const newTaskSubmit = e => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if (taskName == null || taskName === "") return;
  const task = createTask(taskName);
  newTaskInput.value = null;
  const selectedList = lists.find(list => list.id === selectedListId);
  selectedList.tasks.push(task);
  saveAndRender();
};

newTaskForm.addEventListener("submit", newTaskSubmit);

listsContainer.addEventListener("click", e => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});

tasksContainer.addEventListener("click", e => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = lists.find(list => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(
      task => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    save();
    renderTaskCount(selectedList);
  }
});

function myFunction(x) {
  x.classList.toggle("change");
}

let createList = name => {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: []
  };
};

let createTask = name => {
  return {
    id: Date.now().toString(),
    name: name,
    complete: false
  };
};

let saveAndRender = () => {
  save();
  render();
};

let save = () => {
  console.log(lists);
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_SELECTED_LIST_ID_KEY, selectedListId);
};

let render = () => {
  clearElement(listsContainer);
  renderLists();

  const selectedList = lists.find(list => list.id === selectedListId);
  if (selectedListId == null || selectedListId == "null") {
    listDisplayContainer.style.display = "none";
  } else {
    listDisplayContainer.style.display = "";
    // listTitleElement.innerText = selectedList.name;
    // renderTaskCount(selectedList);
    clearElement(tasksContainer);
    renderTasks(selectedList);
  }
};

let renderLists = () => {
  lists.forEach(list => {
    const listElement = document.createElement("li");
    listElement.dataset.listId = list.id;
    listElement.classList.add("list-name");
    listElement.innerText = list.name;
    if (list.id === selectedListId) {
      listElement.classList.add("active-list");
    }
    listsContainer.appendChild(listElement);
  });
};

let renderTasks = selectedList => {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(tasksTemplate.content, true);
    const checkbox = taskElement.querySelector("input");
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector("label");
    label.htmlFor = task.id;
    label.append(task.name);
    tasksContainer.appendChild(taskElement);
  });
};

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();
