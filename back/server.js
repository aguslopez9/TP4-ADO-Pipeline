const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

let tasks = [
  { id: 1, title: 'Tarea 1', completed: false },
  { id: 2, title: 'Tarea 2', completed: false }
];

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  const newTask = { id: tasks.length + 1, title, completed: false };
  tasks.push(newTask);
  res.json(newTask);
});

app.listen(PORT, () => {
  console.log(`Backend en puerto ${PORT}`);
});
