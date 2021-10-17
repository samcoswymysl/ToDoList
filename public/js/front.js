const ulList = document.querySelector('ul');
const toDoInput = document.querySelector('.todoInput');
const addBtn = document.querySelector('.addBtn');
const editPopup = document.querySelector('.editTodo');
const saveEditBtn = document.querySelector('.saveEditBtn');
const editTaskInput = document.querySelector('.editTaskInput');

const checkIco = ' <i class="fas fa-check"></i>';
const deleteIco = '<i class="far fa-calendar-times"></i>';
const editIco = '<i class="fas fa-edit"></i>';

const showInfoLoading = () => {
  ulList.innerHTML = '<img src="css/img/loading.gif" alt="Loading..." class="loading">';
};

const createToolsPanel = (Li) => {
  const thisLi = Li;
  const div = document.createElement('div');
  const checkBtn = document.createElement('button');
  const editBtn = document.createElement('button');
  const deleteBtn = document.createElement('button');

  checkBtn.innerHTML = checkIco;
  checkBtn.classList.add('check');
  editBtn.innerHTML = editIco;
  editBtn.classList.add('edit');
  deleteBtn.innerHTML = deleteIco;
  deleteBtn.classList.add('delete');

  div.append(checkBtn, editBtn, deleteBtn);

  thisLi.append(div);
};

const creatTodolist = (toDoListArrayFromServer) => {
  if (!toDoListArrayFromServer.length) {
    toDoInput.setAttribute('placeholder', 'Any task on your ToDo List');
    ulList.innerHTML = '';
    return;
  }

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

const editTask = {

  showPopUp(ev) {
    editTask.editTaskId = ev.target.closest('li').dataset.id;
    editTask.editTaskLi = ev.target.closest('li');

    editPopup.classList.toggle('hideEdit');
    editTaskInput.value = editTask.editTaskLi.textContent;
  },
  async saveEdit() {
    showInfoLoading();
    const newValueTask = editTaskInput.value;
    const data = await fetch('http://localhost:3000/todo/edittask', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({editTaskId: editTask.editTaskId, newValueTask}),
    });

    const res = await data.json();
    creatTodolist(res);

    editPopup.classList.toggle('hideEdit');
  },
};

const sendNewTask = async (name) => {
  showInfoLoading();
  const data = await fetch('http://localhost:3000/todo', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({name}),
  });
  const res = await data.json();
  creatTodolist(res);
};

const deleteAndChangeStatusTodo = async (taskId, action) => {
  showInfoLoading();
  const data = await fetch('http://localhost:3000/todo/check&delete', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({taskId, action}),
  });
  const res = await data.json();
  creatTodolist(res);
};

const downlandTaskFormServer = async () => {
  showInfoLoading();
  const data = await fetch('http://localhost:3000/todo');
  const res = await data.json();
  ulList.innerHTML = '';
  res.info ? toDoInput.setAttribute('placeholder', `${res.info}`) : creatTodolist(res);
};

const addNewTask = async () => {
  const taskName = toDoInput.value;
  if (taskName === '') {
    toDoInput.setAttribute('placeholder', 'Enter the content of the task');
    return;
  }
  toDoInput.value = '';
  toDoInput.setAttribute('placeholder', 'Write your ToDo');
  await sendNewTask(taskName);
};

const deleteTask = async (ev) => {
  const liToRemove = ev.target.closest('li').dataset.id;
  await deleteAndChangeStatusTodo(liToRemove, 'delete');
};

const statusTaskEdit = async (ev) => {
  const statusChangeLi = ev.target.closest('li').dataset.id;
  await deleteAndChangeStatusTodo(statusChangeLi, 'changeStatus');
};

const checkClick = async (e) => {
  if (e.target.matches('.check')) {
    await statusTaskEdit(e);
  } else if (e.target.matches('.edit')) {
    editTask.showPopUp(e);
  } else if (e.target.matches('.delete')) {
    await deleteTask(e);
  }
};

addBtn.addEventListener('click', addNewTask);
ulList.addEventListener('click', checkClick);
saveEditBtn.addEventListener('click', editTask.saveEdit);
window.addEventListener('DOMContentLoaded', downlandTaskFormServer);

editTaskInput.addEventListener('keyup', async (e) => {
  if (e.key === 'Enter') {
    await editTask.saveEdit();
  }
});

toDoInput.addEventListener('keyup', async (e) => {
  if (e.key === 'Enter') {
    await addNewTask();
  }
});
