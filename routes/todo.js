const express = require('express');
const { readFile, writeFile } = require('fs').promises;
const {
  addNewTask, readTaskList, editToDoList, saveEditTask,
} = require('../utils/utils');

const todoRouter = express.Router();

todoRouter.post('/new', async (req, res) => {
  res.json(await addNewTask(req.body));
});

todoRouter.post('/check&delete', async (req, res) => {
  const { taskId, action } = req.body;
  const data = await editToDoList(taskId, action);

  res.json(data);
});

todoRouter.post('/edittask', async (req, res) => {
  const { editTaskId, newValueTask } = req.body;

  const data = await saveEditTask(editTaskId, newValueTask);

  res.json(data);
});

todoRouter.get('/new', async (req, res) => {
  const data = await readTaskList();

  data.length ? res.json(data) : res.json({ info: 'Any task on your ToDo List' });
});

module.exports = {
  todoRouter,
};
