const ulList = document.querySelector('ul');
const toDoInput = document.querySelector('.todoInput');
const addBtn = document.querySelector('.addBtn');
const showInfo = document.querySelector('.showInfo');
const liList = document.getElementsByTagName('li');
const editPopup = document.querySelector('.editTodo');
const saveEditBtn = document.querySelector('.saveEditBtn');
const editTaskInput = document.querySelector('.editTaskInput');

const checkIco = ' <i class="fas fa-check"></i>';
const deleteIco = '<i class="far fa-calendar-times"></i>';
const editIco = '<i class="fas fa-edit"></i>';
const saveIco = '<i class="fas fa-save"></i>';

const taskListAr = [];
let editTaskLi;

class CreateTask {
  constructor(name, active) {
    this.name = name;
    this.active = active;
  }
}

const sentMessageToBackEnd = () => {
  fetch('http://localhost:3000/todo', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskListAr),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.info) {
        showInfo.textContent = res.info;
        return;
      }
      creatTodolist(res);
    });
};

const downlandTaskFormServer = () => {
  fetch('http://localhost:3000/todo')
    .then((res) => res.json())
    .then((res) => {
      console.log(res);

      if (res.info) {
        showInfo.textContent = res.info;
        return;
      }
      creatTodolist(res);
    });
};

const clearInfo = () => {
  showInfo.textContent = '';
};

const clearInputText = () => {
  toDoInput.value = '';
};

const createToolsPanel = (Li) => {
  const thisLi = Li;
  const checkBtn = document.createElement('button');
  const editBtn = document.createElement('button');
  const deleteBtn = document.createElement('button');

  checkBtn.innerHTML = checkIco;
  checkBtn.classList.add('check');
  editBtn.innerHTML = editIco;
  editBtn.classList.add('edit');
  deleteBtn.innerHTML = deleteIco;
  deleteBtn.classList.add('delete');

  thisLi.append(checkBtn, editBtn, deleteBtn);
};

const creatTodolist = (toDoListArrayFromServer) => {
  const toDoArray = toDoListArrayFromServer;
  ulList.innerHTML = '';
  taskListAr.length = 0;

  toDoArray.forEach((element) => {
    taskListAr.push(element);
    const newLi = document.createElement('li');
    newLi.innerText = element.name;
    if (element.active === true) {
      newLi.classList.add('completed');
    }
    createToolsPanel(newLi);
    ulList.append(newLi);
  });
};

const refactorTaskList = () => {
  taskListAr.length = 0;

  for (let i = 0; i < liList.length; i++) {
    const taskObj = new CreateTask(liList[i].textContent.trim(), liList[i].classList.contains('completed'));
    taskListAr.push(taskObj);
  }
  sentMessageToBackEnd();
};

const createTodoElement = (nameTask) => {
  const newTask = new CreateTask(nameTask, false);
  taskListAr.push(newTask);
  sentMessageToBackEnd();
};

const addNewTask = () => {
  const taskName = toDoInput.value;
  if (taskName === '') {
    showInfo.innerText = 'Enter the content of the task';
    return;
  }
  clearInputText();
  clearInfo();
  createTodoElement(taskName);
};

const deleteTask = (ev) => {
  ev.target.closest('li').remove();
  refactorTaskList();
};

const editTask = (ev2) => {
  editTaskLi = ev2.target.closest('li');
  editPopup.classList.toggle('hideEdit');
  editTaskInput.value = editTaskLi.textContent;
};

const saveEdit = () => {
  editTaskLi.textContent = editTaskInput.value;
  createToolsPanel(editTaskLi);
  editTaskInput.value = '';
  editPopup.classList.toggle('hideEdit');
  refactorTaskList();
};

const checkClick = (e) => {
  if (e.target.matches('.check')) {
    e.target.closest('li').classList.toggle('completed');
    refactorTaskList();
  } else if (e.target.matches('.edit')) {
    editTask(e);
  } else if (e.target.matches('.delete')) {
    deleteTask(e);
  }
};

addBtn.addEventListener('click', addNewTask);
ulList.addEventListener('click', checkClick);
saveEditBtn.addEventListener('click', saveEdit);
window.addEventListener('DOMContentLoaded', downlandTaskFormServer);
