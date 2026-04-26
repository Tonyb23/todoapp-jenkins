const express = require('express');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;


// In-memory storage for todos
let todos = [];
let nextId = 1;

// Middleware to parse JSON bodies and serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GET /api/todos -- return all todos
app.get('/api/todos', (req, res) => {
    res.json(todos);
});

// POST /api/todos -- create a new todo
app.post('/api/todos', (req, res) => {
    const { text } = req.body;
    if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Todo text is required' });
    }
    const todo = {
        id: nextId++,
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
    };
    todos.push(todo);
    res.status(201).json(todo);
});

// PUT /api/todos/:id -- toggle a todo complete or incomplete
app.put('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    todo.completed = !todo.completed;
    res.json(todo);
});

// DELETE /api/todos/:id -- remove a todo
app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    todos.splice(index, 1);
    res.json({ message: 'Todo deleted successfully' });
});

// GET /health -- health check for the pipeline
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', todos: todos.length, version: 'Dockerised' });
});

module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log('Todo app running on port ' + PORT);
    });
}
