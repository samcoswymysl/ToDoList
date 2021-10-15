const ulList = document.querySelector('ul');
const toDoInput = document.querySelector('.todoInput');
const addBtn = document.querySelector('.addBtn');
const showInfo = document.querySelector('.showInfo');
const editPopup = document.querySelector('.editTodo');
const saveEditBtn = document.querySelector('.saveEditBtn');
const editTaskInput = document.querySelector('.editTaskInput');

const checkIco = ' <i class="fas fa-check"></i>';
const deleteIco = '<i class="far fa-calendar-times"></i>';
const editIco = '<i class="fas fa-edit"></i>';

/** WYSYŁĄNIE Nowego TASKA DO BACKENDU!! NOWE */
const sendNewTask = (name) => {
  fetch('http://localhost:3000/todo/new', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  })
    .then((res) => res.json())
    .then((res) => {
      creatTodolist(res);
    });
};

/** POBRANIE TASKÓ Z SERWERA POPRAWIONE !!!! */

const downlandTaskFormServer = () => {
  fetch('http://localhost:3000/todo/new')
    .then((res) => res.json())
    .then((res) => (res.info ? (showInfo.textContent = res.info) : creatTodolist(res)));
};

/** EDYCJA TASKÓ I USÓWANIE POPRAWIONE */

const deleteAndChangeStatusTodo = (taskId, action) => {
  fetch('http://localhost:3000/todo/check&delete', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taskId, action }),
  })
    .then((res) => res.json())
    .then((res) => {
      creatTodolist(res);
    });
};


/** stworzenie panelu z przyciskami */

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

/** budowanie listy UL na podstawie tablicy zadańprzysłanej z serwera */

const creatTodolist = (toDoListArrayFromServer) => {
  const toDoArray = toDoListArrayFromServer;
  const taskListAr = [];
  ulList.innerHTML = '';

  toDoArray.forEach((element, index) => {
    taskListAr.push(element);
    const newLi = document.createElement('li');
    newLi.innerText = element.name;
    newLi.dataset.id = index;
    if (element.active === true) {
      newLi.classList.add('completed');
    }
    createToolsPanel(newLi);
    ulList.append(newLi);
  });
};

/** budowanie tablicy z zadaniami na podstawie  listy LI */

/** dodanie nowego zadania */

const addNewTask = () => {
  const taskName = toDoInput.value;
  if (taskName === '') {
    showInfo.innerText = 'Enter the content of the task';
    return;
  }
  showInfo.textContent = '';
  toDoInput.value = '';
  sendNewTask(taskName);
};

/** USUNIĘCIE POPRAWIONE */
const deleteTask = (ev) => {
  const liToRemove = ev.target.closest('li').dataset.id;
  deleteAndChangeStatusTodo(liToRemove, 'delete');
};

/** OODZNACZENIE ZADANIA ZROBIONE/NIEZRONIONE */

const statusTaskEdit = (ev) => {
  const statusChangeLi = ev.target.closest('li').dataset.id;
  deleteAndChangeStatusTodo(statusChangeLi, 'changeStatus');
};

/** WYŚWIETLANIE POPAPU EDIT I PRZYPISANIE WARTOŚCI INPUTA */
const editTask = {

  showPopUp(ev) {
    editTask.editTaskId = ev.target.closest('li').dataset.id;
    editTask.editTaskLi = ev.target.closest('li');

    editPopup.classList.toggle('hideEdit');
    editTaskInput.value = editTask.editTaskLi.textContent;
  },
  saveEdit() {
    const newValueTask = editTaskInput.value;
    fetch('http://localhost:3000/todo/edittask', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ editTaskId: editTask.editTaskId, newValueTask }),
    })
      .then((res) => res.json())
      .then((res) => {
        creatTodolist(res);
      });

    editPopup.classList.toggle('hideEdit');
  },
};



/**  sprawdzanie który przycisk kliknięto */
const checkClick = (e) => {
  if (e.target.matches('.check')) {
    statusTaskEdit(e);
  } else if (e.target.matches('.edit')) {
    editTask.showPopUp(e);
  } else if (e.target.matches('.delete')) {
    deleteTask(e);
  }
};

addBtn.addEventListener('click', addNewTask);
ulList.addEventListener('click', checkClick);
saveEditBtn.addEventListener('click', editTask.saveEdit);
window.addEventListener('DOMContentLoaded', downlandTaskFormServer);
