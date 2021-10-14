const express = require('express');
const { json } = require('express');
const { readFile, writeFile } = require('fs').promises;

const app = express();
app.use(express.static('public'));
app.use(express.json());

app.post('/todo', async (req, res) => {
  try {
    await writeFile('data/todo.json', JSON.stringify(req.body));
    const data = await readFile('data/todo.json', 'utf8');

    if (data === '' || data === '[]') {
      res.send({ info: 'Any tasks on the list' });
    } else {
      res.send(data);
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(err);
      res.send({ name: 'Brak Zadań na liście' });
    }
  }
});

app.get('/todo', async (req, res) => {
  try {
    const data = await readFile('data/todo.json', 'utf8');
    console.log(data)
    if (data === '' || data === '[]') {
      res.send({info: 'Any tasks on the list'});
    } else {
      res.send(data);
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(err);
      console.log(res);
      res.send({info: 'Any tasks on the list'});
    }
  }
});

app.listen(3000, '127.0.0.1');
