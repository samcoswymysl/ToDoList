const express = require('express');

const { todoRouter } = require('./routes/todo');

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use('/todo', todoRouter);

app.listen(3000, '127.0.0.1');
