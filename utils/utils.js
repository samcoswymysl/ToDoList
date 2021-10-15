const { readFile, writeFile } = require('fs').promises;

const readTaskList = async () => {
  try {
    const data = await readFile('data/todo.json', 'utf8');
    const newData = data ? await JSON.parse(data) : [];
    return newData;
  } catch (er) {
    console.log(er);
    if (er.code === 'ENOENT') {
      return [];
    }
  }
};

const writeTaskList = async (data) => {
  try {
    await writeFile('data/todo.json', JSON.stringify(data));
  } catch (er) {
    console.log(er);
  }
};

const refactoringIdTask = (taskList) => {
  const newTaskList = taskList.map((task, index) => {
    task.taskId = index;
    return task;
  });

  return newTaskList;
};

const addNewTask = async (task) => {
  const newTask = task;
  const taskList = await readTaskList();

  newTask.active = false;
  newTask.taskId = taskList.length;
  taskList.push(newTask);
  await writeTaskList(taskList);
  return taskList;
};

const editToDoList = async (idTask, action) => {
  const toDoList = await readTaskList();

  if (action === 'delete') {
    toDoList.splice(idTask, 1);
    const correctList = refactoringIdTask(toDoList);
    console.log(correctList);
    await writeTaskList(correctList);
    return correctList;
  } if (action === 'changeStatus') {
    toDoList[idTask].active = !toDoList[idTask].active;
    await writeTaskList(toDoList);
    return toDoList;
  }
};

const saveEditTask = async (taskId, taskValue) => {
  const toDoList = await readTaskList();
  toDoList[taskId].name = taskValue;
  await writeTaskList(toDoList);
  return toDoList;
};

module.exports = {
  addNewTask,
  readTaskList,
  editToDoList,
  saveEditTask,
};
